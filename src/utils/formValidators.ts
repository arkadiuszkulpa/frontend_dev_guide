import { EnquiryFormData } from '../types/enquiry';
import { isValidEmail, isValidPhone } from './validators';

export function validateInvolvementLevel(formData: EnquiryFormData): boolean {
  if (formData.involvementLevel === '') return false;
  if (formData.involvementLevel !== 'guide-me' && formData.accountManagement === '') return false;
  return true;
}

export function validateWebsiteComplexity(formData: EnquiryFormData): boolean {
  return formData.websiteComplexity !== '';
}

export function validateFeatures(formData: EnquiryFormData): boolean {
  return formData.corePages.length > 0;
}

export function validateAIFeatures(formData: EnquiryFormData): boolean {
  return formData.aiFeatures.length > 0;
}

export function validateYourBusiness(formData: EnquiryFormData): boolean {
  const hasDescription = formData.businessDescription.trim().length >= 10;
  const hasAtLeastOneCompetitor = formData.competitorWebsites.some(url => url.trim() !== '');
  return hasDescription && hasAtLeastOneCompetitor;
}

export function validateDesignAssets(formData: EnquiryFormData): boolean {
  const assets = formData.designAssets;
  return assets.logo !== '' && assets.brandColours !== '';
}

export function validateContactInfo(formData: EnquiryFormData): boolean {
  return (
    formData.fullName.trim() !== '' &&
    isValidEmail(formData.email) &&
    isValidPhone(formData.phone) &&
    formData.preferredContact !== ''
  );
}

export function validatePricingSummary(): boolean {
  return true;
}
