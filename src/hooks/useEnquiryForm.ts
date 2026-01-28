import { useState, useCallback } from 'react';
import { EnquiryFormData, createInitialFormData } from '../types/enquiry';

// 8 logical steps (0-7), displayed as 7 steps to user (step 2 and 2b shown as "Step 2")
const TOTAL_STEPS = 8;

// Maps logical step to display step for progress bar
const DISPLAY_STEP_MAP: Record<number, number> = {
  0: 1, // Involvement Level -> Step 1
  1: 2, // Website Complexity -> Step 2
  2: 2, // Features (2b) -> Step 2
  3: 3, // AI Features -> Step 3
  4: 4, // Your Business -> Step 4
  5: 5, // Design Assets -> Step 5
  6: 6, // Contact Info -> Step 6
  7: 7, // Pricing Summary -> Step 7
};

const DISPLAY_TOTAL_STEPS = 7;

export function useEnquiryForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<EnquiryFormData>(createInitialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = useCallback((updates: Partial<EnquiryFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, TOTAL_STEPS - 1)));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(createInitialFormData());
    setCurrentStep(0);
  }, []);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  // Calculate progress based on display steps
  const displayStep = DISPLAY_STEP_MAP[currentStep];
  const progress = (displayStep / DISPLAY_TOTAL_STEPS) * 100;

  return {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    isFirstStep,
    isLastStep,
    progress,
    totalSteps: TOTAL_STEPS,
    displayStep,
    displayTotalSteps: DISPLAY_TOTAL_STEPS,
    isSubmitting,
    setIsSubmitting,
  };
}
