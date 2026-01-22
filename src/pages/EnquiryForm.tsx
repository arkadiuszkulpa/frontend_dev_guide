import { useNavigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { Layout } from '../components/Layout';
import { ProgressBar } from '../components/ProgressBar';
import { FormNavigation } from '../components/FormNavigation';
import { useEnquiryForm } from '../hooks/useEnquiryForm';

import { ContactInfo, validateContactInfo } from './form/ContactInfo';
import { BusinessType, validateBusinessType } from './form/BusinessType';
import { Goals, validateGoals } from './form/Goals';
import { CurrentSituation, validateCurrentSituation } from './form/CurrentSituation';
import { Audience, validateAudience } from './form/Audience';
import { ContentFeatures, validateContentFeatures } from './form/ContentFeatures';
import { StylePreferences, validateStylePreferences } from './form/StylePreferences';
import { Timeline, validateTimeline } from './form/Timeline';

const client = generateClient<Schema>();

export function EnquiryForm() {
  const navigate = useNavigate();
  const {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    isSubmitting,
    setIsSubmitting,
  } = useEnquiryForm();

  const validators = [
    validateContactInfo,
    validateBusinessType,
    validateGoals,
    validateCurrentSituation,
    validateAudience,
    validateContentFeatures,
    validateStylePreferences,
    validateTimeline,
  ];

  const canProceed = validators[currentStep](formData);

  const handleNext = async () => {
    if (isLastStep) {
      await handleSubmit();
    } else {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await client.models.Enquiry.create({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName || undefined,
        businessDescription: formData.businessDescription,
        primaryGoal: formData.primaryGoal,
        secondaryGoals: formData.secondaryGoals,
        hasExistingWebsite: formData.hasExistingWebsite ?? false,
        existingWebsiteUrl: formData.existingWebsiteUrl || undefined,
        currentChallenges: formData.currentChallenges,
        targetAudience: formData.targetAudience,
        audienceLocation: formData.audienceLocation,
        contentTypes: formData.contentTypes,
        desiredFeatures: formData.desiredFeatures,
        stylePreference: formData.stylePreference,
        exampleSites: formData.exampleSites,
        urgency: formData.urgency,
        budgetRange: formData.budgetRange || undefined,
        additionalNotes: formData.additionalNotes || undefined,
      });
      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('There was an error submitting your enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const props = { formData, updateFormData };

    switch (currentStep) {
      case 0:
        return <ContactInfo {...props} />;
      case 1:
        return <BusinessType {...props} />;
      case 2:
        return <Goals {...props} />;
      case 3:
        return <CurrentSituation {...props} />;
      case 4:
        return <Audience {...props} />;
      case 5:
        return <ContentFeatures {...props} />;
      case 6:
        return <StylePreferences {...props} />;
      case 7:
        return <Timeline {...props} />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      {renderStep()}
      <FormNavigation
        onBack={prevStep}
        onNext={handleNext}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        isSubmitting={isSubmitting}
        canProceed={canProceed}
      />
    </Layout>
  );
}
