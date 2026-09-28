interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdentityServices {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: {
    theme: 'outline';
    size: 'large';
    text: 'continue_with';
    shape: 'rectangular';
    width: number;
  }) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleIdentityServices;
      };
    };
  }
}

let googleScriptPromise: Promise<void> | undefined;
let initializedClientId: string | undefined;
let activeCredentialHandler: ((credential: string) => void) | undefined;

function loadGoogleIdentityServices(): Promise<void> {
  if (window.google) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    let script = document.getElementById('google-identity-services') as HTMLScriptElement | null;
    const handleLoad = () => {
      if (window.google) resolve();
      else reject(new Error('Google Identity Services did not initialize.'));
    };
    const handleError = () => reject(new Error('Could not load Google Identity Services.'));

    if (!script) {
      script = document.createElement('script');
      script.id = 'google-identity-services';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', handleLoad, { once: true });
      script.addEventListener('error', handleError, { once: true });
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', handleLoad, { once: true });
      script.addEventListener('error', handleError, { once: true });
    }
  }).catch((error: unknown) => {
    googleScriptPromise = undefined;
    throw error;
  });

  return googleScriptPromise;
}

export function mountGoogleButton(
  container: HTMLElement,
  clientId: string,
  onCredential: (credential: string) => void,
  onError: (error: Error) => void,
): () => void {
  let cancelled = false;
  const handler = (credential: string) => onCredential(credential);
  activeCredentialHandler = handler;

  void loadGoogleIdentityServices()
    .then(() => {
      if (cancelled || !window.google) return;
      if (initializedClientId && initializedClientId !== clientId) {
        throw new Error('Google Identity Services is already initialized with a different client ID.');
      }
      if (!initializedClientId) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => activeCredentialHandler?.(response.credential),
        });
        initializedClientId = clientId;
      }

      container.replaceChildren();
      window.google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: Math.min(container.clientWidth, 400),
      });
    })
    .catch((error: unknown) => {
      if (!cancelled) {
        onError(error instanceof Error ? error : new Error('Google sign-in could not be initialized.'));
      }
    });

  return () => {
    cancelled = true;
    if (activeCredentialHandler === handler) activeCredentialHandler = undefined;
    container.replaceChildren();
  };
}
