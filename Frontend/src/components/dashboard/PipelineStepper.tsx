import { Upload, ClipboardPaste, Search, FileBarChart, Sparkles, Check } from 'lucide-react';

export type PipelineStep = 0 | 1 | 2 | 3 | 4;

const steps = [
  { icon: Upload, label: 'Upload Resume' },
  { icon: ClipboardPaste, label: 'Paste JD' },
  { icon: Search, label: 'Analyze' },
  { icon: FileBarChart, label: 'View Results' },
  { icon: Sparkles, label: 'Optimize' },
];

interface PipelineStepperProps {
  currentStep: PipelineStep;
  onStepClick?: (step: PipelineStep) => void;
}

export function PipelineStepper({ currentStep, onStepClick }: PipelineStepperProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-between min-w-[640px] px-2 py-4">
        {steps.map((step, i) => {
          const stepNum = i as PipelineStep;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isNavigable = stepNum <= currentStep && stepNum !== 2;
          return (
            <div key={step.label} className="flex flex-1 items-center">
              {/* Step circle + label */}
              <button
                type="button"
                disabled={!isNavigable}
                onClick={() => onStepClick?.(stepNum)}
                className={`flex flex-col items-center gap-2 ${isNavigable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  className={`relative flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                    isComplete
                      ? 'border-accent-500 bg-accent-500 text-white'
                      : isCurrent
                      ? 'border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-110'
                      : 'border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900'
                  } ${isCurrent ? 'animate-node-pulse' : ''}`}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                  {!isComplete && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                      {i + 1}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'text-brand-600 dark:text-brand-400'
                      : isComplete
                      ? 'text-accent-600 dark:text-accent-400'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="flex-1 mx-3 h-0.5 rounded-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                  <div
                    className={`absolute inset-0 transition-all duration-700 ${
                      stepNum < currentStep
                        ? 'bg-gradient-to-r from-accent-500 to-brand-500 w-full'
                        : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
