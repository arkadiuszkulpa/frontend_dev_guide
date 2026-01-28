# Tech Stack Decisions

## Overview

This document maps **Website Complexity** + **Involvement Level** to actual technology choices and third-party integrations.

---

## Decision Matrix

```
                        │  DO IT FOR ME          │  TEACH ME BASICS       │  GUIDE ME THROUGH
────────────────────────┼────────────────────────┼────────────────────────┼────────────────────────
SIMPLE & STATIC         │  Amplify App           │  Hostinger AI Builder  │  Hostinger AI Builder
                        │  (I manage)            │  (Their account)       │  (Their account)
────────────────────────┼────────────────────────┼────────────────────────┼────────────────────────
SOME MOVING PARTS       │  Amplify App           │  WordPress             │  WordPress
                        │  (I manage)            │  (Their hosting)       │  (Their hosting)
────────────────────────┼────────────────────────┼────────────────────────┼────────────────────────
FULL-FEATURED           │  Amplify + Integrations│  Shopify / Platform    │  Shopify / Platform
                        │  (I manage)            │  (Their account)       │  (Their account)
```

---

## Tier 1: Simple & Static

### "Do it for me" → AWS Amplify

**Why Amplify:**
- Fast to build with AI assistance (this form app = half a day)
- No CMS needed for static content
- Low hosting costs (~$0-5/month for simple sites)
- Full control, easy updates when client requests changes
- Professional, fast, secure

**Stack:**
- React + Vite + Tailwind
- AWS Amplify hosting
- Optional: Amplify Data for contact forms
- Domain: Transfer to Route53 or point DNS

**Client gets:**
- Fast, modern website
- Contact form that emails them
- I make all updates on request

---

### "Teach me basics" / "Guide me" → Hostinger AI Builder

**Why Hostinger:**
- Drag-and-drop UI they can actually use
- AI helps them write content, create images
- All-in-one: hosting + domain + email + builder
- ~£3-10/month depending on plan
- No code knowledge needed

**Stack:**
- Hostinger Website Builder (AI-powered)
- Hostinger hosting + email
- Domain through Hostinger or transfer

**Client gets:**
- Website they can edit themselves
- Visual editor with AI assistance
- Built-in email accounts
- I do initial setup + training session

---

## Tier 2: Some Moving Parts

### "Do it for me" → AWS Amplify + Headless CMS (optional)

**Why Amplify:**
- Same benefits as Tier 1
- Can add blog/content with DynamoDB
- Or integrate headless CMS if content volume is high

**Stack:**
- React + Vite + Tailwind
- AWS Amplify hosting + data
- Optional: Contentful / Sanity for heavy content needs
- Optional: Mailchimp integration for newsletters

**Client gets:**
- Dynamic site I maintain
- Blog/news I can update quickly
- Newsletter signup that feeds to their Mailchimp

---

### "Teach me basics" / "Guide me" → WordPress

**Why WordPress:**
- Industry standard for content management
- Thousands of themes, plugins
- They can add blog posts, update pages
- Huge ecosystem, easy to find help
- ~£5-20/month hosting

**Stack:**
- WordPress + quality theme (Astra, GeneratePress)
- Managed WordPress hosting (Hostinger, SiteGround)
- Essential plugins: Yoast, WPForms, UpdraftPlus
- Optional: Elementor/Gutenberg for visual editing

**Client gets:**
- Full CMS they control
- Can add blog posts, pages
- Training on admin panel
- I do initial build + theme setup

---

## Tier 3: Full-Featured

### "Do it for me" → Amplify + Third-Party Integrations

**Why not build everything custom:**
- E-commerce, payments, inventory = solved problems
- Compliance, security, PCI = handled by platforms
- Integration is faster than building

**Stack options by feature:**

| Feature | Integration | Notes |
|---------|-------------|-------|
| **Online Shop** | Shopify Lite / Snipcart | Embed buy buttons, Shopify handles everything |
| **Payments** | Stripe / PayPal | Direct integration, they handle PCI compliance |
| **Bookings** | Calendly / Cal.com | Embed widget, syncs with their calendar |
| **Members Area** | Memberstack / Auth0 | Handles auth, paywalls, member content |
| **Email Automations** | Mailchimp / ConvertKit | Triggered emails, sequences |
| **Live Chat** | Intercom / Crisp | Widget embed |
| **CRM** | HubSpot Free / Pipedrive | API integration for lead capture |
| **Reviews** | Trustpilot / Reviews.io | Widget embed + API |

**Client gets:**
- Custom frontend (fast, branded)
- Professional integrations
- I manage the code, they manage platforms
- Clear separation of concerns

---

### "Teach me basics" / "Guide me" → Platform-First Approach

**Why platforms:**
- All-in-one solutions they can manage
- Built-in support, documentation
- No code updates needed
- Scales with their business

**Platform options by primary need:**

| Primary Need | Platform | Cost/month | Notes |
|--------------|----------|------------|-------|
| **E-commerce** | Shopify | £25-300 | Best for products, inventory |
| **E-commerce (budget)** | WooCommerce | £10-50 (hosting) | More complex but cheaper |
| **Bookings/Services** | Squarespace | £15-40 | Great for service businesses |
| **Courses/Content** | Kajabi / Teachable | £50-200 | All-in-one course platforms |
| **Memberships** | Patreon / Memberful | £0-50 + % | For creators, communities |
| **Restaurants** | Square Online | £0-60 | Orders, menu, payments |

**Client gets:**
- Platform they control
- I do initial setup + customisation
- Training session
- They handle day-to-day

---

## Integration Cheat Sheet

### Payments
| Option | Best For | Fees |
|--------|----------|------|
| Stripe | Custom integrations | 1.4-2.9% + 20p |
| PayPal | Familiar to customers | 2.9% + 30p |
| Square | In-person + online | 1.9% online |
| Shopify Payments | Shopify stores | 1.5-2% |

### Bookings
| Option | Best For | Cost |
|--------|----------|------|
| Calendly | Simple scheduling | Free - £12/mo |
| Cal.com | Open source, custom | Free - £15/mo |
| Acuity | Complex scheduling | £15-50/mo |
| Square Appointments | Service + payments | Free - £50/mo |

### Email Marketing
| Option | Best For | Cost |
|--------|----------|------|
| Mailchimp | Beginners | Free - £15+/mo |
| ConvertKit | Creators | Free - £15+/mo |
| Brevo (Sendinblue) | Transactional | Free - £15+/mo |

### E-commerce (embeddable)
| Option | Best For | Cost |
|--------|----------|------|
| Shopify Lite | Add shop to any site | £5/mo + fees |
| Snipcart | Developer-friendly | 2% or £20/mo |
| Gumroad | Digital products | 10% |
| Lemonsqueezy | SaaS, digital | 5% + fees |

---

## AI Features - Tech Approach

| AI Feature | Implementation |
|------------|----------------|
| **Chatbot (Q&A)** | Custom (Claude API) or Intercom/Crisp AI |
| **Sales Assistant** | Custom (Claude API + product data) |
| **Smart Contact Form** | Custom (Claude API for triage) |
| **AI Search** | Algolia AI / Custom embeddings |
| **Content Generation** | Claude API integration |
| **Recommendations** | Custom or platform-native |

**Custom AI builds** = Amplify + Claude API
- We can build chatbots, smart forms relatively easily
- Need client's FAQ/content as training data
- Ongoing API costs (~$0.01-0.10 per conversation)

---

## Pricing Implications

### What I Build vs. What I Configure

| Approach | My Work | Ongoing |
|----------|---------|---------|
| **Amplify custom** | Build from scratch | I maintain, client pays hosting (~£5-50/mo) |
| **Hostinger AI** | Setup + training | Client self-manages (~£5-10/mo) |
| **WordPress** | Build + plugins | Client manages content, I do updates |
| **Platform (Shopify etc)** | Configure + customise | Client manages, platform fees apply |
| **Integrations** | Connect services | Split: I manage code, they manage platforms |

---

## Decision Flowchart

```
START
  │
  ▼
Do they want to manage it themselves?
  │
  ├── YES ──► Are they technical?
  │              │
  │              ├── NO ──► Hostinger AI / Squarespace / Shopify
  │              │
  │              └── YES ──► WordPress / Platform of choice
  │
  └── NO ──► What's the complexity?
                │
                ├── Simple ──► Amplify (fast, cheap, I control)
                │
                ├── Dynamic ──► Amplify + optional headless CMS
                │
                └── Full ──► Amplify + integrations
                            (Stripe, Calendly, Shopify Lite, etc.)
```

---

## Open Questions

- [ ] What's my threshold for "build vs buy"? (e.g., at what point is Shopify better than custom?)
- [ ] Should I offer WordPress at all, or push clients to platforms?
- [ ] Maintenance retainer pricing for Amplify sites?
- [ ] Training session format/pricing for self-managed platforms?
- [ ] Partnership opportunities with Hostinger/Shopify/etc?
