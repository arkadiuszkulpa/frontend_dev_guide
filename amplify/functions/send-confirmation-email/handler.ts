import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({});

const SENDER_EMAIL = process.env.SENDER_EMAIL || 'admin@arkadiuszkulpa.co.uk';
const ADMIN_EMAIL = 'admin@arkadiuszkulpa.co.uk';

interface DesignAssets {
  [key: string]: string;
}

interface SendEmailArgumentsRaw {
  enquiryId: string;
  // Contact Information
  fullName: string;
  email: string;
  phone: string;
  preferredContact: string;
  // Business Information
  businessName?: string;
  businessDescription: string;
  // Involvement
  involvementLevel: string;
  accountManagement?: string;
  // Website Complexity + Features
  websiteComplexity: string;
  corePages: string | string[];
  corePagesOther?: string;
  dynamicFeatures?: string | string[];
  dynamicFeaturesOther?: string;
  advancedFeatures?: string | string[];
  advancedFeaturesOther?: string;
  // AI Features
  aiFeatures: string | string[];
  // Competitor/Inspiration
  competitorWebsites?: string | string[];
  inspirationWebsite?: string;
  inspirationReason?: string;
  // Design Assets
  designAssets: string | DesignAssets;
}

interface SendEmailArguments {
  enquiryId: string;
  fullName: string;
  email: string;
  phone: string;
  preferredContact: string;
  businessName?: string;
  businessDescription: string;
  involvementLevel: string;
  accountManagement?: string;
  websiteComplexity: string;
  corePages: string[];
  corePagesOther?: string;
  dynamicFeatures: string[];
  dynamicFeaturesOther?: string;
  advancedFeatures: string[];
  advancedFeaturesOther?: string;
  aiFeatures: string[];
  competitorWebsites: string[];
  inspirationWebsite?: string;
  inspirationReason?: string;
  designAssets: DesignAssets;
}

function parseJsonArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseJsonObject(value: string | object | undefined): DesignAssets {
  if (!value) return {};
  if (typeof value === 'object') return value as DesignAssets;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function parseArguments(raw: SendEmailArgumentsRaw): SendEmailArguments {
  return {
    enquiryId: raw.enquiryId,
    fullName: raw.fullName,
    email: raw.email,
    phone: raw.phone,
    preferredContact: raw.preferredContact,
    businessName: raw.businessName,
    businessDescription: raw.businessDescription,
    involvementLevel: raw.involvementLevel,
    accountManagement: raw.accountManagement,
    websiteComplexity: raw.websiteComplexity,
    corePages: parseJsonArray(raw.corePages),
    corePagesOther: raw.corePagesOther,
    dynamicFeatures: parseJsonArray(raw.dynamicFeatures),
    dynamicFeaturesOther: raw.dynamicFeaturesOther,
    advancedFeatures: parseJsonArray(raw.advancedFeatures),
    advancedFeaturesOther: raw.advancedFeaturesOther,
    aiFeatures: parseJsonArray(raw.aiFeatures),
    competitorWebsites: parseJsonArray(raw.competitorWebsites),
    inspirationWebsite: raw.inspirationWebsite,
    inspirationReason: raw.inspirationReason,
    designAssets: parseJsonObject(raw.designAssets),
  };
}

interface AppSyncEvent {
  arguments: SendEmailArgumentsRaw;
}

export const handler = async (event: AppSyncEvent): Promise<boolean> => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const args = parseArguments(event.arguments);

  if (!args.email) {
    console.log('No email address provided');
    return false;
  }

  try {
    // Send confirmation to user
    await sendUserConfirmationEmail(args);
    console.log(`Confirmation email sent to ${args.email}`);

    // Send detailed copy to admin
    await sendAdminNotificationEmail(args);
    console.log(`Admin notification sent to ${ADMIN_EMAIL}`);

    return true;
  } catch (error) {
    console.error('Failed to send emails:', error);
    return false;
  }
};

function formatArrayAsList(arr?: string[]): string {
  if (!arr || arr.length === 0) return 'None specified';
  return arr.map(item => `• ${item}`).join('\n');
}

function formatArrayAsHtmlList(arr?: string[]): string {
  if (!arr || arr.length === 0) return '<em>None specified</em>';
  return '<ul style="margin: 5px 0; padding-left: 20px;">' + arr.map(item => `<li>${item}</li>`).join('') + '</ul>';
}

function getInvolvementLabel(value: string): string {
  const labels: Record<string, string> = {
    'do-it-for-me': 'Do it for me',
    'teach-me-basics': 'Teach me the basics',
    'guide-me': 'Guide me through it',
  };
  return labels[value] || value;
}

function getAccountManagementLabel(value?: string): string {
  if (!value) return '';
  const labels: Record<string, string> = {
    'you-manage': "You manage everything in your accounts",
    'my-name-you-setup': 'Set them up in my name, but you do the setup',
    'walk-me-through': 'Walk me through it so I own and understand it',
  };
  return labels[value] || value;
}

function getComplexityLabel(value: string): string {
  const labels: Record<string, string> = {
    'simple-static': 'Simple & static',
    'some-moving-parts': 'Some moving parts',
    'full-featured': 'Full-featured',
  };
  return labels[value] || value;
}

function getPreferredContactLabel(value: string): string {
  const labels: Record<string, string> = {
    'email': 'Email',
    'phone': 'Phone',
    'whatsapp': 'WhatsApp',
  };
  return labels[value] || value;
}

function summarizeAssets(assets: DesignAssets): { ready: number; needed: number; notApplicable: number; total: number } {
  let ready = 0;
  let needed = 0;
  let notApplicable = 0;

  Object.values(assets).forEach(status => {
    if (['yes', 'draft', 'use-standard', 'create-from-logo', 'suggest-for-me'].includes(status)) {
      ready++;
    } else if (['no', 'not-sure'].includes(status)) {
      needed++;
    } else if (status === 'na') {
      notApplicable++;
    }
  });

  return { ready, needed, notApplicable, total: ready + needed + notApplicable };
}

function getAssetsNeedingHelp(assets: DesignAssets): string[] {
  const assetLabels: Record<string, string> = {
    logo: 'Logo',
    logoVariations: 'Logo variations',
    brandColours: 'Brand colours',
    brandFonts: 'Brand fonts',
    brandGuidelines: 'Brand guidelines',
    heroImage: 'Hero image',
    teamPhotos: 'Team photos',
    productPhotos: 'Product photos',
    servicePhotos: 'Service photos',
    locationPhotos: 'Location photos',
    behindScenes: 'Behind-the-scenes photos',
    customerPhotos: 'Customer photos',
    stockImagery: 'Stock imagery',
    icons: 'Icons',
    illustrations: 'Illustrations',
    infographics: 'Infographics',
    charts: 'Charts/diagrams',
    backgrounds: 'Background patterns',
    socialGraphics: 'Social media graphics',
    favicon: 'Favicon',
    promoVideo: 'Promotional video',
    productDemos: 'Product demo videos',
    testimonialVideos: 'Testimonial videos',
    backgroundVideo: 'Background video',
    audioFiles: 'Audio files',
    homepageText: 'Homepage text',
    aboutText: 'About page text',
    serviceDescriptions: 'Service descriptions',
    teamBios: 'Team bios',
    testimonials: 'Testimonials',
    caseStudies: 'Case studies',
    faqContent: 'FAQ content',
    blogPosts: 'Blog posts',
    legalText: 'Legal text',
    tagline: 'Tagline',
    callToAction: 'Call-to-action text',
    brochures: 'Brochures/PDFs',
    priceLists: 'Price lists',
    catalogues: 'Catalogues',
    certificates: 'Certificates',
    pressMentions: 'Press mentions',
    clientLogos: 'Client logos',
    partnerLogos: 'Partner logos',
    certificationBadges: 'Certification badges',
    awardLogos: 'Award logos',
    asSeenIn: '"As seen in" logos',
    starRatings: 'Star ratings',
    existingContent: 'Existing content',
    domainOwned: 'Domain name',
    emailAccounts: 'Email accounts',
    customerDatabase: 'Customer database',
    productDatabase: 'Product database',
    socialAccounts: 'Social media accounts',
    googleBusiness: 'Google Business profile',
  };

  const needsHelp: string[] = [];
  Object.entries(assets).forEach(([key, status]) => {
    if (['no', 'not-sure'].includes(status)) {
      needsHelp.push(assetLabels[key] || key);
    }
  });
  return needsHelp;
}

async function sendUserConfirmationEmail(args: SendEmailArguments): Promise<void> {
  const referenceNumber = args.enquiryId.slice(0, 8).toUpperCase();
  const businessText = args.businessName ? ` for ${args.businessName}` : '';
  const assetSummary = summarizeAssets(args.designAssets);

  const subject = `We've received your website enquiry - Ref: ${referenceNumber}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 650px; margin: 0 auto; padding: 20px; }
    .header { background: #0ea5e9; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .reference { background: white; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; }
    .reference-number { font-size: 24px; font-weight: bold; color: #0ea5e9; }
    .section { background: white; padding: 20px; border-radius: 6px; margin: 15px 0; }
    .section-title { font-weight: bold; color: #0ea5e9; margin-bottom: 10px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
    .detail-row { margin: 8px 0; }
    .detail-label { color: #6b7280; font-size: 14px; }
    .detail-value { color: #111827; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
    ul { margin: 5px 0; padding-left: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;">Thank You, ${args.fullName}!</h1>
      <p style="margin:10px 0 0 0; opacity: 0.9;">We've received your website enquiry${businessText}</p>
    </div>
    <div class="content">
      <div class="reference">
        <p style="margin:0 0 5px 0; color: #6b7280;">Your Reference Number</p>
        <p class="reference-number" style="margin:0;">${referenceNumber}</p>
      </div>

      <p>We're excited to help bring your vision to life! Below is a summary of the information you provided:</p>

      <div class="section">
        <div class="section-title">Contact Details</div>
        <div class="detail-row">
          <span class="detail-label">Name:</span>
          <span class="detail-value">${args.fullName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${args.email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">${args.phone}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Preferred Contact:</span>
          <span class="detail-value">${getPreferredContactLabel(args.preferredContact)}</span>
        </div>
        ${args.businessName ? `<div class="detail-row"><span class="detail-label">Business:</span> <span class="detail-value">${args.businessName}</span></div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">How We'll Work Together</div>
        <div class="detail-row">
          <span class="detail-label">Involvement Level:</span>
          <span class="detail-value">${getInvolvementLabel(args.involvementLevel)}</span>
        </div>
        ${args.accountManagement ? `
        <div class="detail-row">
          <span class="detail-label">Account Management:</span>
          <span class="detail-value">${getAccountManagementLabel(args.accountManagement)}</span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Website Type</div>
        <div class="detail-row">
          <span class="detail-label">Complexity:</span>
          <span class="detail-value">${getComplexityLabel(args.websiteComplexity)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Core Pages:</span>
          ${formatArrayAsHtmlList(args.corePages)}
        </div>
        ${args.dynamicFeatures.length > 0 ? `
        <div class="detail-row">
          <span class="detail-label">Dynamic Features:</span>
          ${formatArrayAsHtmlList(args.dynamicFeatures)}
        </div>` : ''}
        ${args.advancedFeatures.length > 0 ? `
        <div class="detail-row">
          <span class="detail-label">Advanced Features:</span>
          ${formatArrayAsHtmlList(args.advancedFeatures)}
        </div>` : ''}
      </div>

      ${args.aiFeatures.length > 0 && !args.aiFeatures.includes('ai-none') ? `
      <div class="section">
        <div class="section-title">AI Features</div>
        ${formatArrayAsHtmlList(args.aiFeatures)}
      </div>` : ''}

      <div class="section">
        <div class="section-title">Your Business</div>
        <div class="detail-row">
          <span class="detail-value">${args.businessDescription}</span>
        </div>
        ${args.competitorWebsites.length > 0 ? `
        <div class="detail-row">
          <span class="detail-label">Competitors:</span>
          ${formatArrayAsHtmlList(args.competitorWebsites)}
        </div>` : ''}
        ${args.inspirationWebsite ? `
        <div class="detail-row">
          <span class="detail-label">Inspiration:</span>
          <span class="detail-value">${args.inspirationWebsite}</span>
        </div>` : ''}
        ${args.inspirationReason ? `
        <div class="detail-row">
          <span class="detail-label">What you like:</span>
          <span class="detail-value">${args.inspirationReason}</span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Materials Summary</div>
        <div class="detail-row">
          <span class="detail-value">
            <strong>${assetSummary.ready}</strong> items ready |
            <strong>${assetSummary.needed}</strong> items need help |
            <strong>${assetSummary.notApplicable}</strong> not applicable
          </span>
        </div>
      </div>

      <p><strong>What happens next?</strong></p>
      <ul>
        <li>We'll review your requirements in detail</li>
        <li>We'll be in touch within 24-48 hours</li>
        <li>We'll discuss the best options tailored to your needs</li>
      </ul>

      <p>If you have any questions in the meantime, feel free to reply to this email.</p>

      <p>Best regards,<br><strong>Arkadiusz Kulpa</strong></p>
    </div>
    <div class="footer">
      <p>This is an automated confirmation. Please keep this email for your records.</p>
    </div>
  </div>
</body>
</html>
`;

  const textBody = `
Thank You, ${args.fullName}!

We've received your website enquiry${businessText} and we're excited to help bring your vision to life.

Your Reference Number: ${referenceNumber}

========================================
SUMMARY OF YOUR ENQUIRY
========================================

CONTACT DETAILS
---------------
Name: ${args.fullName}
Email: ${args.email}
Phone: ${args.phone}
Preferred Contact: ${getPreferredContactLabel(args.preferredContact)}
${args.businessName ? `Business: ${args.businessName}` : ''}

HOW WE'LL WORK TOGETHER
-----------------------
Involvement Level: ${getInvolvementLabel(args.involvementLevel)}
${args.accountManagement ? `Account Management: ${getAccountManagementLabel(args.accountManagement)}` : ''}

WEBSITE TYPE
------------
Complexity: ${getComplexityLabel(args.websiteComplexity)}

Core Pages:
${formatArrayAsList(args.corePages)}
${args.dynamicFeatures.length > 0 ? `\nDynamic Features:\n${formatArrayAsList(args.dynamicFeatures)}` : ''}
${args.advancedFeatures.length > 0 ? `\nAdvanced Features:\n${formatArrayAsList(args.advancedFeatures)}` : ''}

${args.aiFeatures.length > 0 && !args.aiFeatures.includes('ai-none') ? `AI FEATURES\n-----------\n${formatArrayAsList(args.aiFeatures)}\n` : ''}

YOUR BUSINESS
-------------
${args.businessDescription}
${args.competitorWebsites.length > 0 ? `\nCompetitors:\n${formatArrayAsList(args.competitorWebsites)}` : ''}
${args.inspirationWebsite ? `\nInspiration: ${args.inspirationWebsite}` : ''}
${args.inspirationReason ? `What you like: ${args.inspirationReason}` : ''}

MATERIALS SUMMARY
-----------------
${assetSummary.ready} items ready | ${assetSummary.needed} items need help | ${assetSummary.notApplicable} not applicable

========================================

What happens next?
- We'll review your requirements in detail
- We'll be in touch within 24-48 hours
- We'll discuss the best options tailored to your needs

If you have any questions in the meantime, feel free to reply to this email.

Best regards,
Arkadiusz Kulpa
`;

  const command = new SendEmailCommand({
    Source: SENDER_EMAIL,
    Destination: {
      ToAddresses: [args.email],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8',
        },
        Text: {
          Data: textBody,
          Charset: 'UTF-8',
        },
      },
    },
  });

  await sesClient.send(command);
}

async function sendAdminNotificationEmail(args: SendEmailArguments): Promise<void> {
  const referenceNumber = args.enquiryId.slice(0, 8).toUpperCase();
  const submittedAt = new Date().toLocaleString('en-GB', {
    timeZone: 'Europe/London',
    dateStyle: 'full',
    timeStyle: 'short'
  });
  const assetSummary = summarizeAssets(args.designAssets);
  const assetsNeedingHelp = getAssetsNeedingHelp(args.designAssets);

  const subject = `New Website Enquiry - ${args.fullName}${args.businessName ? ` (${args.businessName})` : ''} - Ref: ${referenceNumber}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 700px; margin: 0 auto; padding: 20px; }
    .header { background: #059669; color: white; padding: 25px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 22px; }
    .header p { margin: 5px 0 0 0; opacity: 0.9; }
    .content { background: #f9fafb; padding: 25px; border-radius: 0 0 8px 8px; }
    .meta { background: #ecfdf5; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #059669; }
    .section { background: white; padding: 20px; border-radius: 6px; margin: 15px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .section-title { font-weight: bold; color: #059669; margin-bottom: 12px; font-size: 16px; border-bottom: 2px solid #d1fae5; padding-bottom: 8px; }
    .detail-row { margin: 10px 0; display: flex; }
    .detail-label { color: #6b7280; min-width: 160px; font-weight: 500; }
    .detail-value { color: #111827; flex: 1; }
    .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 3px; }
    ul { margin: 5px 0; padding-left: 20px; }
    li { margin: 4px 0; }
    .quick-actions { background: #eff6ff; padding: 15px; border-radius: 6px; margin-top: 20px; }
    .quick-actions a { color: #2563eb; text-decoration: none; font-weight: 500; }
    .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .warning-title { color: #dc2626; font-weight: bold; margin-bottom: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Website Enquiry Received</h1>
      <p>Reference: ${referenceNumber}</p>
    </div>
    <div class="content">
      <div class="meta">
        <strong>Submitted:</strong> ${submittedAt}<br>
        <strong>Enquiry ID:</strong> ${args.enquiryId}
      </div>

      <div class="section">
        <div class="section-title">Contact Information</div>
        <div class="detail-row">
          <span class="detail-label">Full Name:</span>
          <span class="detail-value"><strong>${args.fullName}</strong></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value"><a href="mailto:${args.email}">${args.email}</a></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone:</span>
          <span class="detail-value"><a href="tel:${args.phone}">${args.phone}</a></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Preferred Contact:</span>
          <span class="detail-value"><span class="highlight">${getPreferredContactLabel(args.preferredContact)}</span></span>
        </div>
        ${args.businessName ? `
        <div class="detail-row">
          <span class="detail-label">Business Name:</span>
          <span class="detail-value"><strong>${args.businessName}</strong></span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Working Relationship</div>
        <div class="detail-row">
          <span class="detail-label">Involvement Level:</span>
          <span class="detail-value"><span class="highlight">${getInvolvementLabel(args.involvementLevel)}</span></span>
        </div>
        ${args.accountManagement ? `
        <div class="detail-row">
          <span class="detail-label">Account Management:</span>
          <span class="detail-value">${getAccountManagementLabel(args.accountManagement)}</span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Website Requirements</div>
        <div class="detail-row">
          <span class="detail-label">Complexity Tier:</span>
          <span class="detail-value"><span class="highlight">${getComplexityLabel(args.websiteComplexity)}</span></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Core Pages:</span>
          <span class="detail-value">${formatArrayAsHtmlList(args.corePages)}</span>
        </div>
        ${args.corePagesOther ? `
        <div class="detail-row">
          <span class="detail-label">Other Core Pages:</span>
          <span class="detail-value">${args.corePagesOther}</span>
        </div>` : ''}
        ${args.dynamicFeatures.length > 0 ? `
        <div class="detail-row">
          <span class="detail-label">Dynamic Features:</span>
          <span class="detail-value">${formatArrayAsHtmlList(args.dynamicFeatures)}</span>
        </div>` : ''}
        ${args.dynamicFeaturesOther ? `
        <div class="detail-row">
          <span class="detail-label">Other Dynamic:</span>
          <span class="detail-value">${args.dynamicFeaturesOther}</span>
        </div>` : ''}
        ${args.advancedFeatures.length > 0 ? `
        <div class="detail-row">
          <span class="detail-label">Advanced Features:</span>
          <span class="detail-value">${formatArrayAsHtmlList(args.advancedFeatures)}</span>
        </div>` : ''}
        ${args.advancedFeaturesOther ? `
        <div class="detail-row">
          <span class="detail-label">Other Advanced:</span>
          <span class="detail-value">${args.advancedFeaturesOther}</span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">AI Features</div>
        ${args.aiFeatures.includes('ai-none') ? '<p><em>No AI features requested</em></p>' : formatArrayAsHtmlList(args.aiFeatures)}
      </div>

      <div class="section">
        <div class="section-title">Business Information</div>
        <p style="margin: 0 0 15px 0; white-space: pre-wrap;">${args.businessDescription}</p>
        ${args.competitorWebsites.length > 0 ? `
        <div class="detail-row">
          <span class="detail-label">Competitors:</span>
          <span class="detail-value">${formatArrayAsHtmlList(args.competitorWebsites)}</span>
        </div>` : ''}
        ${args.inspirationWebsite ? `
        <div class="detail-row">
          <span class="detail-label">Inspiration Site:</span>
          <span class="detail-value"><a href="${args.inspirationWebsite}" target="_blank">${args.inspirationWebsite}</a></span>
        </div>` : ''}
        ${args.inspirationReason ? `
        <div class="detail-row">
          <span class="detail-label">What They Like:</span>
          <span class="detail-value">${args.inspirationReason}</span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Design Assets Summary</div>
        <div class="detail-row">
          <span class="detail-label">Ready to use:</span>
          <span class="detail-value"><strong>${assetSummary.ready}</strong> items</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Need help with:</span>
          <span class="detail-value"><strong>${assetSummary.needed}</strong> items</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Not applicable:</span>
          <span class="detail-value"><strong>${assetSummary.notApplicable}</strong> items</span>
        </div>
      </div>

      ${assetsNeedingHelp.length > 0 ? `
      <div class="warning">
        <div class="warning-title">Assets Requiring Additional Work</div>
        <p style="margin: 0;">The client needs help with:</p>
        ${formatArrayAsHtmlList(assetsNeedingHelp)}
      </div>` : ''}

      <div class="quick-actions">
        <strong>Quick Actions:</strong><br>
        <a href="mailto:${args.email}?subject=Re: Your Website Enquiry - Ref: ${referenceNumber}">Reply to ${args.fullName}</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const textBody = `
========================================
NEW WEBSITE ENQUIRY RECEIVED
========================================

Reference: ${referenceNumber}
Submitted: ${submittedAt}
Enquiry ID: ${args.enquiryId}

========================================
CONTACT INFORMATION
========================================
Full Name: ${args.fullName}
Email: ${args.email}
Phone: ${args.phone}
Preferred Contact: ${getPreferredContactLabel(args.preferredContact)}
${args.businessName ? `Business Name: ${args.businessName}` : ''}

========================================
WORKING RELATIONSHIP
========================================
Involvement Level: ${getInvolvementLabel(args.involvementLevel)}
${args.accountManagement ? `Account Management: ${getAccountManagementLabel(args.accountManagement)}` : ''}

========================================
WEBSITE REQUIREMENTS
========================================
Complexity Tier: ${getComplexityLabel(args.websiteComplexity)}

Core Pages:
${formatArrayAsList(args.corePages)}
${args.corePagesOther ? `Other Core Pages: ${args.corePagesOther}` : ''}

${args.dynamicFeatures.length > 0 ? `Dynamic Features:\n${formatArrayAsList(args.dynamicFeatures)}` : ''}
${args.dynamicFeaturesOther ? `Other Dynamic: ${args.dynamicFeaturesOther}` : ''}

${args.advancedFeatures.length > 0 ? `Advanced Features:\n${formatArrayAsList(args.advancedFeatures)}` : ''}
${args.advancedFeaturesOther ? `Other Advanced: ${args.advancedFeaturesOther}` : ''}

========================================
AI FEATURES
========================================
${args.aiFeatures.includes('ai-none') ? 'No AI features requested' : formatArrayAsList(args.aiFeatures)}

========================================
BUSINESS INFORMATION
========================================
${args.businessDescription}

${args.competitorWebsites.length > 0 ? `Competitors:\n${formatArrayAsList(args.competitorWebsites)}` : ''}
${args.inspirationWebsite ? `Inspiration Site: ${args.inspirationWebsite}` : ''}
${args.inspirationReason ? `What They Like: ${args.inspirationReason}` : ''}

========================================
DESIGN ASSETS SUMMARY
========================================
Ready to use: ${assetSummary.ready} items
Need help with: ${assetSummary.needed} items
Not applicable: ${assetSummary.notApplicable} items

${assetsNeedingHelp.length > 0 ? `\nASSETS REQUIRING ADDITIONAL WORK:\n${formatArrayAsList(assetsNeedingHelp)}` : ''}

========================================
`;

  const command = new SendEmailCommand({
    Source: SENDER_EMAIL,
    Destination: {
      ToAddresses: [ADMIN_EMAIL],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8',
        },
        Text: {
          Data: textBody,
          Charset: 'UTF-8',
        },
      },
    },
  });

  await sesClient.send(command);
}
