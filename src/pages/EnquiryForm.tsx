import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { Layout } from '../components/Layout';
import { ProgressBar } from '../components/ProgressBar';
import { FormNavigation } from '../components/FormNavigation';
import { useEnquiryForm } from '../hooks/useEnquiryForm';

import { InvolvementLevel, validateInvolvementLevel } from './form/01_InvolvementLevel';
import { WebsiteComplexity, validateWebsiteComplexity } from './form/02_WebsiteComplexity';
import { Features, validateFeatures } from './form/02b_Features';
import { AIFeatures, validateAIFeatures } from './form/03_AIFeatures';
import { YourBusiness, validateYourBusiness } from './form/04_YourBusiness';
import { DesignAssetsStep, validateDesignAssets } from './form/05_DesignAssets';
import { ContactInfo, validateContactInfo } from './form/06_ContactInfo';
import { PricingSummary, validatePricingSummary } from './form/07_PricingSummary';

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
    displayStep,
    displayTotalSteps,
    isSubmitting,
    setIsSubmitting,
  } = useEnquiryForm();

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const validators = [
    validateInvolvementLevel,  // Step 0
    validateWebsiteComplexity, // Step 1
    validateFeatures,          // Step 2
    validateAIFeatures,        // Step 3
    validateYourBusiness,      // Step 4
    validateDesignAssets,      // Step 5
    validateContactInfo,       // Step 6
    validatePricingSummary,    // Step 7
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
        // Step 1: Involvement
        involvementLevel: formData.involvementLevel,
        accountManagement: formData.accountManagement || undefined,

        // Step 2: Complexity + Features
        websiteComplexity: formData.websiteComplexity,
        corePages: formData.corePages,
        corePagesOther: formData.corePagesOther || undefined,
        dynamicFeatures: formData.dynamicFeatures,
        dynamicFeaturesOther: formData.dynamicFeaturesOther || undefined,
        advancedFeatures: formData.advancedFeatures,
        advancedFeaturesOther: formData.advancedFeaturesOther || undefined,

        // Step 3: AI Features
        aiFeatures: formData.aiFeatures,

        // Step 4: Your Business
        businessName: formData.businessName || undefined,
        businessDescription: formData.businessDescription,
        competitorWebsites: formData.competitorWebsites,
        inspirationWebsite: formData.inspirationWebsite || undefined,
        inspirationReason: formData.inspirationReason || undefined,

        // Step 5: Design Assets (stored as JSON)
        designAssets: JSON.stringify(formData.designAssets),

        // Step 6: Contact Info
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        preferredContact: formData.preferredContact,
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
            preferredContact: formData.preferredContact,
            // Business Information
            businessName: formData.businessName || undefined,
            businessDescription: formData.businessDescription,
            // Involvement
            involvementLevel: formData.involvementLevel,
            accountManagement: formData.accountManagement || undefined,
            // Website Complexity + Features
            websiteComplexity: formData.websiteComplexity,
            corePages: JSON.stringify(formData.corePages),
            corePagesOther: formData.corePagesOther || undefined,
            dynamicFeatures: JSON.stringify(formData.dynamicFeatures),
            dynamicFeaturesOther: formData.dynamicFeaturesOther || undefined,
            advancedFeatures: JSON.stringify(formData.advancedFeatures),
            advancedFeaturesOther: formData.advancedFeaturesOther || undefined,
            // AI Features
            aiFeatures: JSON.stringify(formData.aiFeatures),
            // Competitor/Inspiration
            competitorWebsites: JSON.stringify(formData.competitorWebsites),
            inspirationWebsite: formData.inspirationWebsite || undefined,
            inspirationReason: formData.inspirationReason || undefined,
            // Design Assets
            designAssets: JSON.stringify(formData.designAssets),
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
        return <InvolvementLevel {...props} />;
      case 1:
        return <WebsiteComplexity {...props} />;
      case 2:
        return <Features {...props} />;
      case 3:
        return <AIFeatures {...props} />;
      case 4:
        return <YourBusiness {...props} />;
      case 5:
        return <DesignAssetsStep {...props} />;
      case 6:
        return <ContactInfo {...props} />;
      case 7:
        return <PricingSummary {...props} />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <ProgressBar currentStep={displayStep} totalSteps={displayTotalSteps} />
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
