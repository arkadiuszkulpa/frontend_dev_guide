import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('form');
  const pricing = useMemo(() => calculatePricing(formData), [formData]);

  return (
    <FormCard
      title={t('steps.pricingSummary.title')}
      subtitle={t('steps.pricingSummary.subtitle')}
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