import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({});

const SENDER_EMAIL = process.env.SENDER_EMAIL || 'admin@arkadiuszkulpa.co.uk';
const ADMIN_EMAIL = 'admin@arkadiuszkulpa.co.uk';

interface SendEmailArgumentsRaw {
  enquiryId: string;
  // Contact Information
  fullName: string;
  email: string;
  phone: string;
  businessName?: string;
  // Business Understanding
  businessDescription: string;
  // Goals
  primaryGoal: string;
  secondaryGoals?: string | string[];
  // Current Situation
  hasExistingWebsite: boolean;
  existingWebsiteUrl?: string;
  currentChallenges?: string | string[];
  // Audience
  targetAudience: string;
  audienceLocation: string;
  // Content & Features
  contentTypes: string | string[];
  desiredFeatures: string | string[];
  // Preferences
  stylePreference: string;
  exampleSites?: string | string[];
  // Timeline & Budget
  urgency: string;
  budgetRange?: string;
  // Additional Notes
  additionalNotes?: string;
}

interface SendEmailArguments {
  enquiryId: string;
  fullName: string;
  email: string;
  phone: string;
  businessName?: string;
  businessDescription: string;
  primaryGoal: string;
  secondaryGoals?: string[];
  hasExistingWebsite: boolean;
  existingWebsiteUrl?: string;
  currentChallenges?: string[];
  targetAudience: string;
  audienceLocation: string;
  contentTypes: string[];
  desiredFeatures: string[];
  stylePreference: string;
  exampleSites?: string[];
  urgency: string;
  budgetRange?: string;
  additionalNotes?: string;
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

function parseArguments(raw: SendEmailArgumentsRaw): SendEmailArguments {
  return {
    enquiryId: raw.enquiryId,
    fullName: raw.fullName,
    email: raw.email,
    phone: raw.phone,
    businessName: raw.businessName,
    businessDescription: raw.businessDescription,
    primaryGoal: raw.primaryGoal,
    secondaryGoals: parseJsonArray(raw.secondaryGoals),
    hasExistingWebsite: raw.hasExistingWebsite,
    existingWebsiteUrl: raw.existingWebsiteUrl,
    currentChallenges: parseJsonArray(raw.currentChallenges),
    targetAudience: raw.targetAudience,
    audienceLocation: raw.audienceLocation,
    contentTypes: parseJsonArray(raw.contentTypes),
    desiredFeatures: parseJsonArray(raw.desiredFeatures),
    stylePreference: raw.stylePreference,
    exampleSites: parseJsonArray(raw.exampleSites),
    urgency: raw.urgency,
    budgetRange: raw.budgetRange,
    additionalNotes: raw.additionalNotes,
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
  return '<ul>' + arr.map(item => `<li>${item}</li>`).join('') + '</ul>';
}

async function sendUserConfirmationEmail(args: SendEmailArguments): Promise<void> {
  const referenceNumber = args.enquiryId.slice(0, 8).toUpperCase();
  const businessText = args.businessName ? ` for ${args.businessName}` : '';

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
        ${args.businessName ? `<div class="detail-row"><span class="detail-label">Business:</span> <span class="detail-value">${args.businessName}</span></div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Your Business</div>
        <div class="detail-row">
          <span class="detail-value">${args.businessDescription}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Your Goals</div>
        <div class="detail-row">
          <span class="detail-label">Primary Goal:</span>
          <span class="detail-value">${args.primaryGoal}</span>
        </div>
        ${args.secondaryGoals && args.secondaryGoals.length > 0 ? `
        <div class="detail-row">
          <span class="detail-label">Additional Goals:</span>
          ${formatArrayAsHtmlList(args.secondaryGoals)}
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Current Situation</div>
        <div class="detail-row">
          <span class="detail-label">Existing Website:</span>
          <span class="detail-value">${args.hasExistingWebsite ? 'Yes' : 'No'}</span>
        </div>
        ${args.existingWebsiteUrl ? `<div class="detail-row"><span class="detail-label">Current URL:</span> <span class="detail-value">${args.existingWebsiteUrl}</span></div>` : ''}
        ${args.currentChallenges && args.currentChallenges.length > 0 ? `
        <div class="detail-row">
          <span class="detail-label">Current Challenges:</span>
          ${formatArrayAsHtmlList(args.currentChallenges)}
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Target Audience</div>
        <div class="detail-row">
          <span class="detail-label">Who:</span>
          <span class="detail-value">${args.targetAudience}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${args.audienceLocation}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Content & Features</div>
        <div class="detail-row">
          <span class="detail-label">Content Types:</span>
          ${formatArrayAsHtmlList(args.contentTypes)}
        </div>
        <div class="detail-row">
          <span class="detail-label">Desired Features:</span>
          ${formatArrayAsHtmlList(args.desiredFeatures)}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Style & Preferences</div>
        <div class="detail-row">
          <span class="detail-label">Style Preference:</span>
          <span class="detail-value">${args.stylePreference}</span>
        </div>
        ${args.exampleSites && args.exampleSites.length > 0 ? `
        <div class="detail-row">
          <span class="detail-label">Example Sites:</span>
          ${formatArrayAsHtmlList(args.exampleSites)}
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Timeline & Budget</div>
        <div class="detail-row">
          <span class="detail-label">Urgency:</span>
          <span class="detail-value">${args.urgency}</span>
        </div>
        ${args.budgetRange ? `<div class="detail-row"><span class="detail-label">Budget Range:</span> <span class="detail-value">${args.budgetRange}</span></div>` : ''}
      </div>

      ${args.additionalNotes ? `
      <div class="section">
        <div class="section-title">Additional Notes</div>
        <div class="detail-row">
          <span class="detail-value">${args.additionalNotes}</span>
        </div>
      </div>` : ''}

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
${args.businessName ? `Business: ${args.businessName}` : ''}

YOUR BUSINESS
-------------
${args.businessDescription}

YOUR GOALS
----------
Primary Goal: ${args.primaryGoal}
${args.secondaryGoals && args.secondaryGoals.length > 0 ? `Additional Goals:\n${formatArrayAsList(args.secondaryGoals)}` : ''}

CURRENT SITUATION
-----------------
Existing Website: ${args.hasExistingWebsite ? 'Yes' : 'No'}
${args.existingWebsiteUrl ? `Current URL: ${args.existingWebsiteUrl}` : ''}
${args.currentChallenges && args.currentChallenges.length > 0 ? `Current Challenges:\n${formatArrayAsList(args.currentChallenges)}` : ''}

TARGET AUDIENCE
---------------
Who: ${args.targetAudience}
Location: ${args.audienceLocation}

CONTENT & FEATURES
------------------
Content Types:
${formatArrayAsList(args.contentTypes)}

Desired Features:
${formatArrayAsList(args.desiredFeatures)}

STYLE & PREFERENCES
-------------------
Style Preference: ${args.stylePreference}
${args.exampleSites && args.exampleSites.length > 0 ? `Example Sites:\n${formatArrayAsList(args.exampleSites)}` : ''}

TIMELINE & BUDGET
-----------------
Urgency: ${args.urgency}
${args.budgetRange ? `Budget Range: ${args.budgetRange}` : ''}

${args.additionalNotes ? `ADDITIONAL NOTES\n----------------\n${args.additionalNotes}` : ''}

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

  const subject = `🔔 New Website Enquiry - ${args.fullName}${args.businessName ? ` (${args.businessName})` : ''} - Ref: ${referenceNumber}`;

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
    .detail-label { color: #6b7280; min-width: 140px; font-weight: 500; }
    .detail-value { color: #111827; flex: 1; }
    .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 3px; }
    ul { margin: 5px 0; padding-left: 20px; }
    li { margin: 4px 0; }
    .quick-actions { background: #eff6ff; padding: 15px; border-radius: 6px; margin-top: 20px; }
    .quick-actions a { color: #2563eb; text-decoration: none; font-weight: 500; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 New Website Enquiry Received</h1>
      <p>Reference: ${referenceNumber}</p>
    </div>
    <div class="content">
      <div class="meta">
        <strong>Submitted:</strong> ${submittedAt}<br>
        <strong>Enquiry ID:</strong> ${args.enquiryId}
      </div>

      <div class="section">
        <div class="section-title">👤 Contact Information</div>
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
        ${args.businessName ? `
        <div class="detail-row">
          <span class="detail-label">Business Name:</span>
          <span class="detail-value"><strong>${args.businessName}</strong></span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">🏢 Business Description</div>
        <p style="margin: 0; white-space: pre-wrap;">${args.businessDescription}</p>
      </div>

      <div class="section">
        <div class="section-title">🎯 Goals</div>
        <div class="detail-row">
          <span class="detail-label">Primary Goal:</span>
          <span class="detail-value"><span class="highlight">${args.primaryGoal}</span></span>
        </div>
        ${args.secondaryGoals && args.secondaryGoals.length > 0 ? `
        <div class="detail-row">
          <span class="detail-label">Secondary Goals:</span>
          <span class="detail-value">${formatArrayAsHtmlList(args.secondaryGoals)}</span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">📊 Current Situation</div>
        <div class="detail-row">
          <span class="detail-label">Has Website:</span>
          <span class="detail-value">${args.hasExistingWebsite ? '<span style="color: #059669;">✓ Yes</span>' : '<span style="color: #dc2626;">✗ No</span>'}</span>
        </div>
        ${args.existingWebsiteUrl ? `
        <div class="detail-row">
          <span class="detail-label">Current URL:</span>
          <span class="detail-value"><a href="${args.existingWebsiteUrl}" target="_blank">${args.existingWebsiteUrl}</a></span>
        </div>` : ''}
        ${args.currentChallenges && args.currentChallenges.length > 0 ? `
        <div class="detail-row">
          <span class="detail-label">Challenges:</span>
          <span class="detail-value">${formatArrayAsHtmlList(args.currentChallenges)}</span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">👥 Target Audience</div>
        <div class="detail-row">
          <span class="detail-label">Who:</span>
          <span class="detail-value">${args.targetAudience}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value"><span class="highlight">${args.audienceLocation}</span></span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📄 Content & Features Required</div>
        <div class="detail-row">
          <span class="detail-label">Content Types:</span>
          <span class="detail-value">${formatArrayAsHtmlList(args.contentTypes)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Features:</span>
          <span class="detail-value">${formatArrayAsHtmlList(args.desiredFeatures)}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">🎨 Style Preferences</div>
        <div class="detail-row">
          <span class="detail-label">Style:</span>
          <span class="detail-value"><span class="highlight">${args.stylePreference}</span></span>
        </div>
        ${args.exampleSites && args.exampleSites.length > 0 ? `
        <div class="detail-row">
          <span class="detail-label">Example Sites:</span>
          <span class="detail-value">${formatArrayAsHtmlList(args.exampleSites)}</span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">⏰ Timeline & Budget</div>
        <div class="detail-row">
          <span class="detail-label">Urgency:</span>
          <span class="detail-value"><span class="highlight">${args.urgency}</span></span>
        </div>
        ${args.budgetRange ? `
        <div class="detail-row">
          <span class="detail-label">Budget Range:</span>
          <span class="detail-value"><strong>${args.budgetRange}</strong></span>
        </div>` : '<div class="detail-row"><span class="detail-label">Budget Range:</span><span class="detail-value"><em>Not specified</em></span></div>'}
      </div>

      ${args.additionalNotes ? `
      <div class="section">
        <div class="section-title">📝 Additional Notes</div>
        <p style="margin: 0; white-space: pre-wrap;">${args.additionalNotes}</p>
      </div>` : ''}

      <div class="quick-actions">
        <strong>Quick Actions:</strong><br>
        <a href="mailto:${args.email}?subject=Re: Your Website Enquiry - Ref: ${referenceNumber}">↩️ Reply to ${args.fullName}</a>
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
${args.businessName ? `Business Name: ${args.businessName}` : ''}

========================================
BUSINESS DESCRIPTION
========================================
${args.businessDescription}

========================================
GOALS
========================================
Primary Goal: ${args.primaryGoal}
${args.secondaryGoals && args.secondaryGoals.length > 0 ? `Secondary Goals:\n${formatArrayAsList(args.secondaryGoals)}` : ''}

========================================
CURRENT SITUATION
========================================
Has Website: ${args.hasExistingWebsite ? 'Yes' : 'No'}
${args.existingWebsiteUrl ? `Current URL: ${args.existingWebsiteUrl}` : ''}
${args.currentChallenges && args.currentChallenges.length > 0 ? `Challenges:\n${formatArrayAsList(args.currentChallenges)}` : ''}

========================================
TARGET AUDIENCE
========================================
Who: ${args.targetAudience}
Location: ${args.audienceLocation}

========================================
CONTENT & FEATURES REQUIRED
========================================
Content Types:
${formatArrayAsList(args.contentTypes)}

Features:
${formatArrayAsList(args.desiredFeatures)}

========================================
STYLE PREFERENCES
========================================
Style: ${args.stylePreference}
${args.exampleSites && args.exampleSites.length > 0 ? `Example Sites:\n${formatArrayAsList(args.exampleSites)}` : ''}

========================================
TIMELINE & BUDGET
========================================
Urgency: ${args.urgency}
Budget Range: ${args.budgetRange || 'Not specified'}

${args.additionalNotes ? `========================================\nADDITIONAL NOTES\n========================================\n${args.additionalNotes}` : ''}

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
