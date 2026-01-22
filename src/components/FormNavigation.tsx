interface FormNavigationProps {
  onBack: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting?: boolean;
  canProceed?: boolean;
}

export function FormNavigation({
  onBack,
  onNext,
  isFirstStep,
  isLastStep,
  isSubmitting = false,
  canProceed = true,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          isFirstStep
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
        }`}
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canProceed || isSubmitting}
        className={`px-8 py-3 rounded-lg font-medium transition-colors ${
          canProceed && !isSubmitting
            ? 'bg-primary-500 text-white hover:bg-primary-600'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? 'Submitting...' : isLastStep ? 'Submit' : 'Continue'}
      </button>
    </div>
  );
}
