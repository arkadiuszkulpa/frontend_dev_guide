import { useMemo } from 'react';
import { FormCard } from '../../components/FormCard';
import { PriceMatrixGraphic } from '../../components/PriceMatrixGraphic';
import {
  PriceBreakdownCard,
  ContentNeedsWarning,
  DisclaimerNote,
} from '../../components/PriceBreakdownCard';
import { calculatePricing } from '../../utils/calculatePricing';
import { EnquiryFormData } from '../../types/enquiry';

interface StepProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function PricingSummary({ formData }: StepProps) {
  const pricing = useMemo(() => calculatePricing(formData), [formData]);

  return (
    <FormCard
      title="Your Estimated Quote"
      subtitle="Based on your selections, here's what you can expect to invest."
    >
      <div className="space-y-8">
        {/* Price Matrix Graphic */}
        <PriceMatrixGraphic
          complexity={formData.websiteComplexity}
          involvement={formData.involvementLevel}
        />

        {/* Price Breakdown */}
        <PriceBreakdownCard pricing={pricing} />

        {/* Content Needs Warning - only shown if needed */}
        {pricing.contentNeeds.length > 0 && (
          <ContentNeedsWarning items={pricing.contentNeeds} />
        )}

        {/* Disclaimer */}
        <DisclaimerNote />
      </div>
    </FormCard>
  );
}

export function validatePricingSummary(): boolean {
  // Always valid - this is just a summary step
  return true;
}
