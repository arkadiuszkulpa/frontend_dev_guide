import { useNavigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { Layout } from '../components/Layout';
import { ProgressBar } from '../components/ProgressBar';
import { FormNavigation } from '../components/FormNavigation';
import { useEnquiryForm } from '../hooks/useEnquiryForm';

import { ContactInfo, validateContactInfo } from './form/01_ContactInfo';
import { BusinessType, validateBusinessType } from './form/02_BusinessType';
import { Goals, validateGoals } from './form/03_Goals';
import { CurrentSituation, validateCurrentSituation } from './form/04_CurrentSituation';
import { Audience, validateAudience } from './form/05_Audience';
import { ContentFeatures, validateContentFeatures } from './form/06_ContentFeatures';
import { StylePreferences, validateStylePreferences } from './form/07_StylePreferences';
import { Timeline, validateTimeline } from './form/08_Timeline';

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
      const { data: enquiry } = await client.models.Enquiry.create({
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

      // Send confirmation email with all form data
      if (enquiry?.id) {
        try {
          await client.mutations.sendConfirmationEmail({
            enquiryId: enquiry.id,
            // Contact Information
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            businessName: formData.businessName || undefined,
            // Business Understanding
            businessDescription: formData.businessDescription,
            // Goals
            primaryGoal: formData.primaryGoal,
            secondaryGoals: JSON.stringify(formData.secondaryGoals || []),
            // Current Situation
            hasExistingWebsite: formData.hasExistingWebsite ?? false,
            existingWebsiteUrl: formData.existingWebsiteUrl || undefined,
            currentChallenges: JSON.stringify(formData.currentChallenges || []),
            // Audience
            targetAudience: formData.targetAudience,
            audienceLocation: formData.audienceLocation,
            // Content & Features
            contentTypes: JSON.stringify(formData.contentTypes || []),
            desiredFeatures: JSON.stringify(formData.desiredFeatures || []),
            // Preferences
            stylePreference: formData.stylePreference,
            exampleSites: JSON.stringify(formData.exampleSites || []),
            // Timeline & Budget
            urgency: formData.urgency,
            budgetRange: formData.budgetRange || undefined,
            // Additional Notes
            additionalNotes: formData.additionalNotes || undefined,
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Don't block navigation - enquiry was saved successfully
        }
      }

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
