interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
