import { useState, useCallback } from 'react';
import { EnquiryFormData, initialFormData } from '../types/enquiry';

const TOTAL_STEPS = 8;

export function useEnquiryForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<EnquiryFormData>(initialFormData);
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
    setFormData(initialFormData);
    setCurrentStep(0);
  }, []);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

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
    isSubmitting,
    setIsSubmitting,
  };
}
