import { useTranslation } from 'react-i18next';
import { PricingBreakdown, PricingLineItem } from '../types/enquiry';
import { formatPriceRange } from '../utils/calculatePricing';

interface PriceBreakdownCardProps {
  pricing: PricingBreakdown;
}

interface SectionProps {
  title: string;
  items: PricingLineItem[];
}

function PriceSection({ title, items }: SectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="py-3 border-t border-gray-200">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {title}
      </h4>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">• {item.label}</span>
            <span className="text-gray-700 font-medium">
              +{formatPriceRange(item.price)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PriceBreakdownCard({ pricing }: PriceBreakdownCardProps) {
  const { t } = useTranslation('form');
  const hasAddOns =
    pricing.aiFeatures.length > 0 || pricing.integrations.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Base Price - always shown */}
      <div className="p-4 bg-green-50 border-b border-green-100">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wide">
              {t('pricing.basePrice')}
            </h4>
            <p className="text-sm text-green-600 mt-1">{pricing.base.label}</p>
          </div>
          <span className="text-lg font-bold text-green-700">
            {formatPriceRange(pricing.base.price)}
          </span>
        </div>
      </div>

      {/* Add-ons section */}
      <div className="px-4">
        <PriceSection title={t('pricing.aiFeatures')} items={pricing.aiFeatures} />
        <PriceSection title={t('pricing.integrations')} items={pricing.integrations} />
      </div>

      {/* Total */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 mt-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">
            {t('pricing.estimatedTotal')}
          </span>
          <span className="text-xl font-bold text-gray-900">
            {formatPriceRange(pricing.total)}
          </span>
        </div>
        {!hasAddOns && (
          <p className="text-xs text-gray-500 mt-1">
            {t('pricing.basePriceOnly')}
          </p>
        )}
      </div>
    </div>
  );
}

interface ContentNeedsWarningProps {
  items: PricingLineItem[];
}

export function ContentNeedsWarning({ items }: ContentNeedsWarningProps) {
  const { t } = useTranslation('form');

  if (items.length === 0) return null;

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <h4 className="text-sm font-semibold text-amber-800 mb-2">
        {t('pricing.contentNeedsTitle')}
      </h4>
      <p className="text-sm text-amber-700 mb-3">
        {t('pricing.contentNeedsSubtitle')}
      </p>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between text-sm">
            <span className="text-amber-700">• {item.label}</span>
            <span className="text-amber-800 font-medium">
              {formatPriceRange(item.price)}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-amber-600 mt-3 pt-3 border-t border-amber-200">
        {t('pricing.contentNeedsNote')}
      </p>
    </div>
  );
}

export function DisclaimerNote() {
  const { t } = useTranslation('form');

  return (
    <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
      <svg
        className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-sm text-blue-700">
        {t('pricing.disclaimer')}
      </p>
    </div>
  );
}
