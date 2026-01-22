# Frontend Development Guide

A guided enquiry system that helps non-technical users articulate their website needs through simple, business-focused questions.

## Project Concept

Many people need websites but don't know where to start. They're not technical, can't use AI builders like Hostinger, and don't understand what's possible. This app bridges that gap.

### The Problem

- Non-technical users don't know what they need
- Technical questions confuse and frustrate them
- They know their business, not web development
- They need guidance, not a blank form

### Our Solution

A guided, flowchart-style form that:

1. **Asks about business, not technology** - "What does your business do?" not "Do you need a CMS?"
2. **One question at a time** - Minimal, clean interface that doesn't overwhelm
3. **Uses plain English** - No jargon, no technical terms
4. **Captures intent** - Understanding what they want to achieve, not how to build it

The matching to actual solutions happens behind the scenes, later.

## How It Works

Users click "New Enquiry" and are guided through 8 simple steps:

| Step | What We Ask | Why |
|------|-------------|-----|
| 1 | Contact details | Know who they are |
| 2 | About their business | Understand what they do |
| 3 | Their goals | What should the website achieve? |
| 4 | Current situation | Do they have something already? |
| 5 | Their customers | Who will visit the site? |
| 6 | Content they have | Photos, products, services? |
| 7 | Look and feel | Professional, playful, modern? |
| 8 | Timeline | How soon do they need it? |

Each enquiry is saved with a unique ID for future reference and solution matching.

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Backend:** AWS Amplify Gen 2
- **Database:** DynamoDB
- **Hosting:** AWS Amplify Hosting

## Getting Started

### Prerequisites

- Node.js 18+
- AWS Account (for Amplify)
- AWS CLI configured

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Amplify sandbox (for backend)
npx ampx sandbox
```

### Deployment

1. Push code to GitHub
2. Connect repository to AWS Amplify Console
3. Amplify automatically builds and deploys

## Project Structure

```
├── amplify/                 # Amplify Gen 2 backend
│   ├── backend.ts          # Backend definition
│   └── data/
│       └── resource.ts     # DynamoDB schema
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   │   └── form/           # Form step components
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript definitions
│   └── App.tsx             # Main application
└── package.json
```

## Future Enhancements

- [ ] User accounts for returning visitors
- [ ] Admin dashboard to view and manage enquiries
- [ ] Solution matching algorithm
- [ ] Email notifications on new enquiries
- [ ] File uploads (logos, reference images)

## License

Private - All rights reserved
