import { useTranslation } from 'react-i18next';
import {
  WebsiteComplexity,
  InvolvementLevel,
  BASE_PRICES,
  PriceRange,
} from '../types/enquiry';
import { formatPriceRange } from '../utils/calculatePricing';

interface PriceMatrixGraphicProps {
  complexity: WebsiteComplexity;
  involvement: InvolvementLevel;
}

type NonEmptyComplexity = Exclude<WebsiteComplexity, ''>;
type NonEmptyInvolvement = Exclude<InvolvementLevel, ''>;

const COMPLEXITY_ORDER: NonEmptyComplexity[] = [
  'simple-static',
  'some-moving-parts',
  'full-featured',
];

const INVOLVEMENT_ORDER: NonEmptyInvolvement[] = [
  'do-it-for-me',
  'teach-me-basics',
  'guide-me',
];

const COMPLEXITY_TRANSLATION_KEYS: Record<NonEmptyComplexity, string> = {
  'simple-static': 'simpleStatic',
  'some-moving-parts': 'someMovingParts',
  'full-featured': 'fullFeatured',
};

const INVOLVEMENT_TRANSLATION_KEYS: Record<NonEmptyInvolvement, string> = {
  'do-it-for-me': 'doItForMe',
  'teach-me-basics': 'teachMeBasics',
  'guide-me': 'guideMe',
};

function getPrice(
  complexity: NonEmptyComplexity,
  involvement: NonEmptyInvolvement
): PriceRange {
  return BASE_PRICES[complexity][involvement];
}

export function PriceMatrixGraphic({
  complexity,
  involvement,
}: PriceMatrixGraphicProps) {
  const { t } = useTranslation('form');

  const isSelected = (c: NonEmptyComplexity, i: NonEmptyInvolvement) =>
    complexity === c && involvement === i;

  const getComplexityLabel = (c: NonEmptyComplexity) =>
    t(`pricing.complexityLabels.${COMPLEXITY_TRANSLATION_KEYS[c]}`);

  const getInvolvementLabel = (i: NonEmptyInvolvement) =>
    t(`pricing.involvementLabels.${INVOLVEMENT_TRANSLATION_KEYS[i]}`);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">{t('pricing.matrix.title')}</h3>

      {/* Desktop view - full matrix */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-medium text-gray-500"></th>
              {COMPLEXITY_ORDER.map((c) => (
                <th
                  key={c}
                  className={`p-2 text-center text-xs font-medium ${
                    complexity === c ? 'text-indigo-700' : 'text-gray-500'
                  }`}
                >
                  {getComplexityLabel(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOLVEMENT_ORDER.map((i) => (
              <tr key={i}>
                <td
                  className={`p-2 text-xs font-medium whitespace-nowrap ${
                    involvement === i ? 'text-indigo-700' : 'text-gray-500'
                  }`}
                >
                  {getInvolvementLabel(i)}
                </td>
                {COMPLEXITY_ORDER.map((c) => {
                  const selected = isSelected(c, i);
                  const price = getPrice(c, i);
                  return (
                    <td
                      key={`${c}-${i}`}
                      className={`p-3 text-center border ${
                        selected
                          ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      <span className="text-sm">{formatPriceRange(price)}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view - simplified display */}
      <div className="sm:hidden">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="text-center">
            <p className="text-xs text-indigo-600 font-medium mb-1">
              {t('pricing.matrix.yourSelection')}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              {complexity && involvement ? (
                <>
                  {getComplexityLabel(complexity as NonEmptyComplexity)} +{' '}
                  {getInvolvementLabel(involvement as NonEmptyInvolvement)}
                </>
              ) : (
                t('pricing.matrix.completePreviousSteps')
              )}
            </p>
            {complexity && involvement && (
              <p className="text-xl font-bold text-indigo-700">
                {formatPriceRange(
                  getPrice(
                    complexity as NonEmptyComplexity,
                    involvement as NonEmptyInvolvement
                  )
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-indigo-600 rounded"></span>
          <span>{t('pricing.matrix.legend')}</span>
        </div>
      </div>
    </div>
  );
}
