/**
 * Nexora AI — Premium SaaS Landing Page Scripts
 * Architecture: Pure Vanilla JavaScript (ES6+), Modular Design, No Frameworks
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. DOM Elements & State Management
  // ---------------------------------------------------------------------------
  const DOM = {
    header: document.getElementById('header'),
    mobileToggle: document.getElementById('mobileToggle'),
    mobileNav: document.getElementById('mobileNav'),
    mobileLinks: document.querySelectorAll('.mobile-nav-links a'),
    navLinks: document.querySelectorAll('.nav-links a'),
    sections: document.querySelectorAll('section[id]'),
    backToTop: document.getElementById('backToTop'),
    yearSpan: document.getElementById('currentYear'),

    // FAQ Elements
    faqItems: document.querySelectorAll('.faq-item'),

    // Pricing Elements
    billingSwitch: document.getElementById('billingSwitch'),
    priceMonthlyLabel: document.getElementById('priceMonthlyLabel'),
    priceYearlyLabel: document.getElementById('priceYearlyLabel'),
    planPrices: document.querySelectorAll('.plan-price'),
    planPeriods: document.querySelectorAll('.plan-period'),

    // AI Assistant Demo Elements
    demoTextarea: document.getElementById('demoPromptInput'),
    demoCharCount: document.getElementById('demoCharCount'),
    demoClearBtn: document.getElementById('demoClearBtn'),
    demoGenerateBtn: document.getElementById('demoGenerateBtn'),
    demoChipsList: document.getElementById('demoChipsList'),
    demoChipsLabel: document.getElementById('demoChipsLabel'),
    demoModeTabs: document.querySelectorAll('.mode-tab-btn'),
    demoOutput: document.getElementById('demoOutputText'),
    demoLoading: document.getElementById('demoLoadingIndicator'),
    demoCopyBtn: document.getElementById('demoCopyBtn'),
    demoLatencyTag: document.getElementById('demoLatencyTag'),

    // Modals
    authModal: document.getElementById('authModal'),
    salesModal: document.getElementById('salesModal'),
    modalCloses: document.querySelectorAll('.modal-close-btn'),
    loginBtns: document.querySelectorAll('[data-action="login"]'),
    signupBtns: document.querySelectorAll('[data-action="signup"]'),
    contactSalesBtns: document.querySelectorAll('[data-action="sales"]'),
    loginForm: document.getElementById('loginForm'),
    salesForm: document.getElementById('salesForm'),
    toastContainer: document.getElementById('toastContainer')
  };

  // State
  const state = {
    isAnnual: false,
    isGenerating: false,
    currentDemoTimeout: null,
    currentMode: 'writer'
  };

  // ---------------------------------------------------------------------------
  // 2. Initialize
  // ---------------------------------------------------------------------------
  function init() {
    setupCopyrightYear();
    setupNavbarScroll();
    setupMobileMenu();
    setupSmoothScrollAndActiveNav();
    setupScrollReveal();
    setupBackToTop();
    setupFaqAccordion();
    setupPricingToggle();
    setupAiDemo();
    setupModals();
    setupToastSystem();
  }

  // ---------------------------------------------------------------------------
  // 3. Header & Navigation Functions
  // ---------------------------------------------------------------------------
  function setupCopyrightYear() {
    if (DOM.yearSpan) {
      DOM.yearSpan.textContent = new Date().getFullYear();
    }
  }

  function setupNavbarScroll() {
    if (!DOM.header) return;

    const handleScroll = () => {
      if (window.scrollY > 40) {
        DOM.header.classList.add('scrolled');
      } else {
        DOM.header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function setupMobileMenu() {
    if (!DOM.mobileToggle || !DOM.mobileNav) return;

    const toggleMenu = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !DOM.mobileNav.classList.contains('open');
      if (isOpen) {
        DOM.mobileNav.classList.add('open');
        DOM.mobileToggle.setAttribute('aria-expanded', 'true');
        DOM.mobileToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      } else {
        DOM.mobileNav.classList.remove('open');
        DOM.mobileToggle.setAttribute('aria-expanded', 'false');
        DOM.mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    };

    DOM.mobileToggle.addEventListener('click', () => toggleMenu());

    // Close mobile menu on link click
    DOM.mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (DOM.mobileNav.classList.contains('open') &&
          !DOM.mobileNav.contains(e.target) &&
          !DOM.mobileToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.mobileNav.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  function setupSmoothScrollAndActiveNav() {
    // Active Nav Highlight using IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (!id) return;

          DOM.navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          DOM.mobileLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    DOM.sections.forEach(section => sectionObserver.observe(section));
  }

  function setupBackToTop() {
    if (!DOM.backToTop) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        DOM.backToTop.classList.add('visible');
      } else {
        DOM.backToTop.classList.remove('visible');
      }
    }, { passive: true });

    DOM.backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Scroll Reveal Animations
  // ---------------------------------------------------------------------------
  function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach(el => el.classList.add('active'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ---------------------------------------------------------------------------
  // 5. FAQ Accordion (Accessible & Smooth Single Open)
  // ---------------------------------------------------------------------------
  function setupFaqAccordion() {
    if (!DOM.faqItems.length) return;

    DOM.faqItems.forEach((item, index) => {
      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');

      if (!trigger || !content) return;

      const toggleItem = (expand) => {
        const isCurrentlyActive = item.classList.contains('active');
        const shouldOpen = typeof expand === 'boolean' ? expand : !isCurrentlyActive;

        // Close all other items first
        DOM.faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.faq-trigger');
            const otherContent = otherItem.querySelector('.faq-content');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherContent) otherContent.style.maxHeight = '0px';
          }
        });

        if (shouldOpen) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = '0px';
        }
      };

      trigger.addEventListener('click', () => toggleItem());

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleItem();
        }
      });

      // Expand the first item by default on load for great UX
      if (index === 0) {
        toggleItem(true);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Pricing Toggle (Monthly / Annual Discount)
  // ---------------------------------------------------------------------------
  function setupPricingToggle() {
    if (!DOM.billingSwitch) return;

    const pricingData = {
      starter: { monthly: 0, annual: 0 },
      pro: { monthly: 19, annual: 15 },
      business: { monthly: 49, annual: 39 }
    };

    const updatePricingDisplay = () => {
      const isAnnual = state.isAnnual;
      DOM.billingSwitch.setAttribute('aria-checked', isAnnual ? 'true' : 'false');

      if (DOM.priceMonthlyLabel && DOM.priceYearlyLabel) {
        if (isAnnual) {
          DOM.priceMonthlyLabel.classList.remove('active');
          DOM.priceYearlyLabel.classList.add('active');
        } else {
          DOM.priceMonthlyLabel.classList.add('active');
          DOM.priceYearlyLabel.classList.remove('active');
        }
      }

      DOM.planPrices.forEach(priceEl => {
        const plan = priceEl.getAttribute('data-plan');
        if (!plan || !pricingData[plan]) return;

        const targetPrice = isAnnual ? pricingData[plan].annual : pricingData[plan].monthly;
        
        // Gentle price count transition
        priceEl.style.opacity = '0';
        priceEl.style.transform = 'translateY(-6px)';
        
        setTimeout(() => {
          priceEl.textContent = `$${targetPrice}`;
          priceEl.style.opacity = '1';
          priceEl.style.transform = 'translateY(0)';
        }, 150);
      });

      DOM.planPeriods.forEach(periodEl => {
        periodEl.textContent = isAnnual ? '/month, billed annually' : '/month';
      });
    };

    DOM.billingSwitch.addEventListener('click', () => {
      state.isAnnual = !state.isAnnual;
      updatePricingDisplay();
    });

    DOM.billingSwitch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        state.isAnnual = !state.isAnnual;
        updatePricingDisplay();
      }
    });

    if (DOM.priceMonthlyLabel) {
      DOM.priceMonthlyLabel.addEventListener('click', () => {
        if (state.isAnnual) {
          state.isAnnual = false;
          updatePricingDisplay();
        }
      });
    }

    if (DOM.priceYearlyLabel) {
      DOM.priceYearlyLabel.addEventListener('click', () => {
        if (!state.isAnnual) {
          state.isAnnual = true;
          updatePricingDisplay();
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 7. Interactive AI Assistant Simulation Demo (4 Core Feature Modes)
  // ---------------------------------------------------------------------------
  function setupAiDemo() {
    if (!DOM.demoTextarea || !DOM.demoGenerateBtn || !DOM.demoOutput) return;

    // Presets & simulation data for each of the 4 requested features
    const modeConfigs = {
      writer: {
        title: "AI Content Writer (Articles aur emails likhe)",
        chipsLabel: "Quick Prompts for AI Content Writer (Articles & Emails):",
        placeholder: "Tell Nexora what article to write or describe the email you want to generate...",
        latencyPrefix: "Writer Engine · 0.42s",
        chips: [
          {
            id: "w1",
            icon: "fa-solid fa-envelope",
            text: "Draft a high-converting cold email pitching our B2B SaaS",
            prompt: "Draft a high-converting cold email pitching our B2B SaaS to a Chief Technology Officer",
            response: `✦ Subject: Streamlining your team's automated workflows with Nexora AI

Hi [First Name],

I noticed your engineering team has been scaling rapid product iterations at [Company]. As engineering orgs grow, senior developers often lose up to 12 hours a week manually configuring webhook integrations, triaging routine incidents, and formatting status reports.

Nexora AI automates this entire operational pipeline with fine-tuned neural models—reducing routine task latency by 68% without modifying existing codebase architectures.

Teams like Kinetix and Hyperion recently replaced their fragmented internal scripts with Nexora and recovered 14+ hours of uninterrupted sprint focus per engineer.

Would you be open to a 7-minute walk-through this Thursday to see how Nexora can automate repetitive engineering tickets at [Company]?

Best regards,
Alex Rivera
Lead Solutions Architect, Nexora AI`
          },
          {
            id: "w2",
            icon: "fa-solid fa-newspaper",
            text: 'Write a 3-paragraph article intro: "Why AI Automation is Essential in 2026"',
            prompt: 'Write a compelling 3-paragraph article introduction on: "Why AI Automation is Essential for Modern Organizations in 2026"',
            response: `✦ Article Draft: Why AI Automation is Essential for Modern Organizations in 2026

The definition of high-performing enterprise velocity has fundamentally shifted. Just two years ago, artificial intelligence in the workplace was largely treated as an auxiliary novelty—a clever conversational prompt for generating rough drafts or summarizing isolated meeting transcripts. Today, leading technology organizations view autonomous AI orchestration not as an optional accessory, but as the foundational nervous system of modern productivity.

In high-velocity business environments, the greatest threat to competitive advantage is no longer a lack of capital or talent; it is the compounding drag of manual friction. High-salaried engineers, creative strategists, and operations directors still spend nearly a third of their workweeks shuttling data between incompatible dashboards, manually triaging customer requests, and generating repetitive reports.

By implementing unified, autonomous task execution pipelines, modern organizations are permanently decoupling business output from mechanical human overhead. The teams that thrive in 2026 are not working more hours—they are deploying intelligent AI layers like Nexora to automate the repetitive work and protect their focus for genuine innovation.`
          },
          {
            id: "w3",
            icon: "fa-solid fa-paper-plane",
            text: "Write a professional follow-up email after a client pitch call",
            prompt: "Write a professional follow-up email after an executive product demonstration meeting",
            response: `✦ Subject: Great connecting today — Nexora AI Demo Summary & Next Steps

Hi Sarah,

Thank you for taking the time to explore Nexora AI with our team earlier today. It was inspiring to learn more about [Company]'s plans to scale cross-border operational workflows this upcoming quarter.

As discussed during our session, here is a concise recap of how Nexora directly addresses your core objectives:
• Automated Support Triage: Auto-categorize and route P0 customer tickets in under 400ms.
• Deep Document Synthesis: Ingest multi-page vendor invoices and export clean structured JSON.
• Team Security & Compliance: SOC2 Type II isolation with zero public LLM model retention.

Next Step:
I've provisioned a complimentary 14-day Pro workspace for your team here: https://nexora.ai/workspace/company-sandbox

Let me know if next Tuesday at 2:00 PM EST works for a brief 15-minute checkpoint with your engineering leads to review your first test pipeline.

Warm regards,
Alex Rivera`
          }
        ]
      },

      summarizer: {
        title: "AI Summarizer (Lambi writing ko short kare)",
        chipsLabel: "Quick Prompts for AI Summarizer (Condense Long Writing):",
        placeholder: "Paste or describe any long article, report, or transcript you want condensed...",
        latencyPrefix: "Summarizer Core · 0.38s",
        chips: [
          {
            id: "s1",
            icon: "fa-solid fa-file-invoice",
            text: "Summarize a 10-page quarterly financial report into 3 key takeaways",
            prompt: "Summarize a 10-page quarterly financial report into 3 key high-level takeaways",
            response: `✦ Executive Summary: Q3 Financial Performance Report (Condensation Rate: 84%)

1. Strong Revenue Expansion Driven by Enterprise Tier (+38% YoY):
   • Annual Recurring Revenue reached $18.4M, surpassing quarterly guidance by $1.2M.
   • High-volume automated customer accounts drove 72% of net expansion revenue.

2. Operational Margin Improvements via Automation (+420 bps):
   • Cloud infrastructure and manual processing costs fell by 14% due to automated token routing.
   • Operating cash flow reached a record $4.1M with gross margin expanding to 81.2%.

3. Strategic Focus for Q4:
   • Allocate $3M in capital expenditure toward European edge infrastructure.
   • Target expansion in mid-market engineering operations teams.`
          },
          {
            id: "s2",
            icon: "fa-solid fa-bolt",
            text: "Shorten a 2,000-word research article on renewable energy storage",
            prompt: "Condense a 2,000-word academic whitepaper on solid-state battery energy storage into 4 concise bullets",
            response: `✦ High-Signal Synthesis: Next-Gen Solid-State Energy Storage (2,000 words → 160 words)

• Volumetric Density Surge: New silicon-composite electrolytes demonstrate 480 Wh/kg energy density—representing a 65% increase over conventional commercial lithium-ion cells.
• Thermal Stability & Fire Suppression: Solid-state ceramic separators eliminate catastrophic runaway risk up to 210°C, drastically lowering cooling system overhead.
• Accelerated Cycle Longevity: Laboratory cohorts retained 91.4% capacity after 1,500 continuous rapid-charge cycles (10C rate equivalent).
• Commercialization Horizon: Pilot fab production slated for Q1 2027, with automotive and aerospace grid storage prototypes leading early adoption.`
          },
          {
            id: "s3",
            icon: "fa-solid fa-users",
            text: "Condense long customer interview transcripts into action points",
            prompt: "Condense 6 hours of customer discovery call transcripts into clear friction points and action items",
            response: `✦ Customer Discovery Synthesis (N = 14 Interviews Condensation):

Top User Pain Points Identified:
• Onboarding Bottleneck: 9 out of 14 users felt API token provisioning took too many configuration steps.
• Notification Fatigue: Teams requested customizable Slack digest frequency rather than instant alerts for minor tasks.

Immediate Engineering Action Items:
1. Deploy 1-click token setup wizard with pre-authenticated templates (Target: Sprint 42).
2. Add "Hourly Digest" toggle to Slack and Discord webhook integrations.
3. Publish interactive video tutorial covering custom multi-step branch workflows.`
          }
        ]
      },

      assistant: {
        title: "AI Assistant (User ke sawalon ke jawab de)",
        chipsLabel: "Quick Prompts for AI Assistant (Instant Q&A & Solutions):",
        placeholder: "Ask Nexora AI any technical question, architecture problem, or operational query...",
        latencyPrefix: "Assistant v2 · 0.29s",
        chips: [
          {
            id: "a1",
            icon: "fa-solid fa-shield-halved",
            text: "How do I secure my API endpoints against DDoS attacks and brute force?",
            prompt: "How do I secure my web API endpoints against DDoS attacks and credential brute force?",
            response: `✦ Nexora AI Assistant Response: API Security Hardening Architecture

To fortify public endpoints against distributed denial-of-service (DDoS) and automated brute-force attacks:

1. Edge-Layer Reverse Proxy & Rate Limiting:
   • Place Cloudflare or AWS CloudFront in front of origin servers.
   • Enforce token-bucket rate limiting (e.g., 60 requests/minute per authenticated client ID; 15/minute for public auth routes).

2. Exponential Backoff & Account Lockout:
   • For authentication routes (/api/login), implement progressive delay (500ms → 2s → 8s) after 3 consecutive failed attempts.
   • Temporary IP greylisting after 5 failed authentication cycles.

3. Cryptographic Token Validation:
   • Validate signed JWTs with short expirations (15 mins) and refresh tokens stored in HttpOnly, SameSite=Strict cookies.
   • Verify HMAC signatures on all incoming external webhooks to prevent replay spoofing.

4. Infrastructure Auto-Scaling:
   • Configure container auto-scaling based on CPU utilization > 65% or queue latency > 80ms.`
          },
          {
            id: "a2",
            icon: "fa-solid fa-database",
            text: "Explain the difference between SQL and NoSQL in simple terms",
            prompt: "Explain the architectural difference between SQL and NoSQL databases in simple, practical terms",
            response: `✦ Nexora AI Assistant Response: SQL vs. NoSQL Explained Simply

Think of SQL vs. NoSQL like organizing data in an Excel Spreadsheet vs. a Folder of Digital Documents:

1. SQL (Relational Databases — PostgreSQL, MySQL):
   • Structure: Rigid tables with predefined columns and rows (Schemas).
   • Superpower: ACID transactions and complex relationships (e.g., "Find all users who purchased Product X last Tuesday and have an active subscription").
   • Best For: Financial transactions, ERPs, relational user account data.

2. NoSQL (Non-Relational — MongoDB, Redis, DynamoDB):
   • Structure: Flexible JSON documents, key-value stores, or wide-column graphs.
   • Superpower: Horizontal scale and high-speed write throughput with schema flexibility.
   • Best For: Real-time IoT event streams, fast caching, social media feeds, unstructured logs.

Architectural Rule of Thumb:
Start with PostgreSQL for relational integrity. Introduce Redis/NoSQL as a specialized cache or event store when write throughput demands horizontal scaling.`
          },
          {
            id: "a3",
            icon: "fa-solid fa-chart-line",
            text: "What are the best practices for scaling team productivity with AI?",
            prompt: "What are the top 4 proven strategies for successfully scaling team productivity with AI in 2026?",
            response: `✦ Nexora AI Assistant Response: 4 Pillars of Enterprise AI Productivity

1. Automate the Mechanical, Keep Humans on the Judgment:
   Do not ask AI to make strategic leadership decisions. Use AI to draft first passes, format code snippets, validate schemas, and generate status summaries.

2. Standardize Verified Prompt & Automation Blueprints:
   Create a centralized internal repository of tested prompt workflows. Eliminate the scenario where 50 employees reinvent the prompt for meeting notes every week.

3. Enforce Continuous Integration Feedback Loops:
   Pair automated outputs with validation checkpoints. For instance, Nexora's pipelines automatically check generated JSON against strict TypeScript type definitions before database ingestion.

4. Measure Tangible Output Velocity:
   Track real metrics: ticket cycle time, code review turnaround, and inbound customer response time—rather than abstract "AI usage" metrics.`
          }
        ]
      },

      automation: {
        title: "Task Automation (Repetitive tasks ko automate kare)",
        chipsLabel: "Quick Prompts for Task Automation (No-Code Workflows):",
        placeholder: "Describe any repetitive multi-step task you want Nexora to automate autonomously...",
        latencyPrefix: "Workflow Engine · 0.35s",
        chips: [
          {
            id: "t1",
            icon: "fa-solid fa-headset",
            text: "Automate support ticket triage and Slack channel alerts",
            prompt: "Design an automated pipeline to ingest incoming support tickets, categorize urgency, and alert engineering on Slack",
            response: `✦ Task Automation Pipeline Blueprint: Support Ticket Autotriage

Trigger:
  Incoming webhook from Intercom / Zendesk / Support Email.

Stage 1: Intent & Priority Analysis (Execution Time: 85ms)
  • Parse customer ticket message through Nexora's classification neural model.
  • Determine sentiment score (-1.0 to +1.0) and system impact severity (P0 - P3).

Stage 2: Conditional Routing:
  • IF Severity = P0 (Production Outage / Data Hazard):
    - Dispatch immediate emergency broadcast to #war-room Slack channel.
    - Trigger PagerDuty on-call escalation incident.
    - Post automated acknowledgement to customer: "Engineering is actively investigating."
  • IF Severity = P2/P3 (General Inquiry / Documentation):
    - Retrieve matching solution from Knowledge Base.
    - Draft verified suggested reply directly into the agent's draft box.

Outcome:
  P0 escalation time reduced from 28 minutes to 4 seconds.`
          },
          {
            id: "t2",
            icon: "fa-solid fa-cloud-arrow-up",
            text: "Auto-sync CRM leads to Google Sheets and notify sales rep",
            prompt: "Set up an autonomous workflow that captures inbound demo form submissions, syncs them to CRM and Google Sheets, and sends a personalized alert to the sales rep",
            response: `✦ Task Automation Blueprint: High-Intent Lead Sync & Rep Notification

Trigger:
  Visitor completes "Request Demo" form on Nexora landing page.

Pipeline Workflow:
1. Data Enrichment & Validation:
   • Validate email domain (filter out disposable domains).
   • Look up company ARR and headcount via Clearbit / Apollo API connector.
2. Dual-System Sync:
   • Create new Lead record in HubSpot / Salesforce CRM.
   • Append row to executive tracking Google Sheet ("Q4 Enterprise Pipeline").
3. Smart Rep Assignment & Notification:
   • Round-robin assign lead to available Account Executive based on timezone.
   • Send customized Slack direct message to assigned rep with enriched prospect dossier and 1-click calendar invite link.

Performance Impact:
  First-response touchpoint dropped from 4 hours to under 3 minutes.`
          },
          {
            id: "t3",
            icon: "fa-solid fa-clock-rotate-left",
            text: "Set up daily repetitive data extraction and email report trigger",
            prompt: "Automate daily morning extraction of server performance logs and email executive summary to VP of Engineering at 8:00 AM",
            response: `✦ Task Automation Blueprint: Daily 8:00 AM Infrastructure Digest

Schedule Trigger:
  Recurring Cron: 00 08 * * 1-5 (Every weekday at 08:00 AM UTC).

Automated Sequence:
1. Data Pull: Query CloudWatch / Datadog telemetry for trailing 24-hour metrics (P99 latency, error rates, CPU peak).
2. AI Anomaly Synthesis: Summarize any threshold spikes > 2.5% and cross-reference with deploy logs.
3. HTML Report Compilation: Generate a clean, single-page PDF report with gradient trend charts.
4. Email Delivery: Dispatch email digest to engineering-leads@company.com with subject: "[Digest] System Health: 99.98% Uptime | No Critical Incidents".

Manual Effort Eliminated:
  Saves 45 minutes of manual log-checking every morning.`
          }
        ]
      }
    };

    // Generic dynamic responder for freeform user input tailored to active mode
    const generateCustomResponse = (userPrompt, mode) => {
      const cleanPrompt = userPrompt.trim();

      if (mode === 'writer') {
        return `✦ AI Content Writer Output: Generated Content Artifact

Target Topic: "${cleanPrompt}"
Calibrated Tone: Professional, Persuasive, Brand-Aligned

[Generated Document / Email Draft]

Subject: Strategic update regarding ${cleanPrompt.slice(0, 30)}...

Dear Partner,

I am writing to share key progress on our latest operational milestones. We have completed the foundational architecture for "${cleanPrompt}" and are currently opening early access for select high-velocity teams.

Key Deliverables:
1. Seamless Execution: Designed to integrate directly into existing workflows without disruption.
2. High Signal, Zero Noise: Focused strictly on driving measurable business outcomes and team speed.
3. Enterprise Security: Fully compliant with current data privacy protocols.

Please let me know if you would like to schedule a brief 10-minute briefing next week to review implementation details.

Warm regards,
Nexora Content Engine`;
      }

      if (mode === 'summarizer') {
        return `✦ AI Summarizer Output: High-Signal Executive Reduction

Input Length: ${cleanPrompt.length} characters
Condensation Rate: 76% Reduction | Clarity Score: 99.4%

Core Executive Takeaways:
1. Primary Objective:
   • The core premise centers on: "${cleanPrompt.slice(0, 80)}..."
2. Strategic Implication:
   • Accelerates decision velocity by stripping out extraneous background verbiage.
   • Isolates actionable milestones and resource requirements.
3. Recommended Action Item:
   • Proceed with phased deployment while monitoring downstream integration dependencies.`;
      }

      if (mode === 'assistant') {
        return `✦ Nexora AI Assistant Response

Question Received: "${cleanPrompt}"
Confidence Score: 99.8% | Source: Verified Architectural Knowledge Base

Direct Answer & Guidance:
To address this effectively, consider the following three-stage recommendation:

1. Immediate Solution:
   Analyze baseline constraints and ensure all prerequisites are validated before initiating changes.

2. Step-by-Step Implementation:
   • Step A: Ingest input parameters and enforce strict schema boundary validation.
   • Step B: Apply optimized neural reasoning routines to execute the core logic.
   • Step C: Verify end-to-end telemetry and ensure rollback safeguards are in place.

3. Best Practice Tip:
   Keep workflows modular so individual steps can be updated or retried without impacting the entire pipeline.`;
      }

      // Default: Automation
      return `✦ Task Automation Pipeline Blueprint

Objective: "${cleanPrompt}"
Pipeline Status: Validated & Ready to Deploy

Autonomous Execution Plan:
[Trigger]: Event listener captures incoming action payload.
[Step 1 - Data Validation]: Clean, sanitize, and verify fields against schema.
[Step 2 - Neural Routing]: Nexora AI routes parameters through fine-tuned processing models.
[Step 3 - Cross-Platform Execution]:
  • Update primary database records.
  • Sync downstream webhooks (Slack, CRM, Linear).
  • Log sub-second execution telemetry to audit ledger.

Estimated Manual Time Saved: 4.2 hours per week.`;
    };

    // Render chips for current mode
    function renderChipsForMode(mode) {
      const config = modeConfigs[mode];
      if (!config || !DOM.demoChipsList) return;

      if (DOM.demoChipsLabel) {
        DOM.demoChipsLabel.textContent = config.chipsLabel;
      }

      DOM.demoTextarea.placeholder = config.placeholder;
      if (DOM.demoLatencyTag) {
        DOM.demoLatencyTag.textContent = config.latencyPrefix;
      }

      DOM.demoChipsList.innerHTML = '';

      config.chips.forEach(chip => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chip-btn';
        btn.setAttribute('data-chip-id', chip.id);
        btn.innerHTML = `<i class="${chip.icon}"></i> <span>${chip.text}</span>`;

        btn.addEventListener('click', () => {
          DOM.demoTextarea.value = chip.prompt;
          if (DOM.demoCharCount) {
            DOM.demoCharCount.textContent = `${chip.prompt.length} / 500 chars`;
          }
          triggerGeneration(chip.response);
        });

        DOM.demoChipsList.appendChild(btn);
      });
    }

    // Tab switching event listeners
    DOM.demoModeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const selectedMode = tab.getAttribute('data-mode');
        if (!selectedMode || selectedMode === state.currentMode) return;

        state.currentMode = selectedMode;

        DOM.demoModeTabs.forEach(t => {
          const isActive = t === tab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        renderChipsForMode(selectedMode);
      });
    });

    // Update character count
    DOM.demoTextarea.addEventListener('input', () => {
      const len = DOM.demoTextarea.value.length;
      if (DOM.demoCharCount) {
        DOM.demoCharCount.textContent = `${len} / 500 chars`;
      }
    });

    // Clear input
    if (DOM.demoClearBtn) {
      DOM.demoClearBtn.addEventListener('click', () => {
        DOM.demoTextarea.value = '';
        if (DOM.demoCharCount) DOM.demoCharCount.textContent = '0 / 500 chars';
        DOM.demoTextarea.focus();
      });
    }

    // Generate button click
    DOM.demoGenerateBtn.addEventListener('click', () => {
      const input = DOM.demoTextarea.value.trim();
      if (!input) {
        showToast('Please type a prompt or click a quick prompt chip above.', 'info');
        DOM.demoTextarea.focus();
        return;
      }

      // Check if input matches one of current mode's preset chips
      const currentConfig = modeConfigs[state.currentMode];
      let matchedResponse = null;

      if (currentConfig) {
        for (const c of currentConfig.chips) {
          if (c.prompt.toLowerCase() === input.toLowerCase() || c.text.toLowerCase() === input.toLowerCase()) {
            matchedResponse = c.response;
            break;
          }
        }
      }

      if (!matchedResponse) {
        matchedResponse = generateCustomResponse(input, state.currentMode);
      }

      triggerGeneration(matchedResponse);
    });

    // Trigger Generation Simulation with Typewriter Effect
    function triggerGeneration(textToStream) {
      if (state.isGenerating) return;
      state.isGenerating = true;

      if (state.currentDemoTimeout) {
        clearTimeout(state.currentDemoTimeout);
      }

      DOM.demoGenerateBtn.disabled = true;
      DOM.demoGenerateBtn.style.opacity = '0.6';
      DOM.demoLoading.classList.add('active');
      DOM.demoOutput.textContent = '';
      if (DOM.demoLatencyTag) DOM.demoLatencyTag.textContent = 'Processing neural stream...';

      const simulatedLatency = Math.floor(Math.random() * 250) + 400; // 400 - 650ms

      setTimeout(() => {
        DOM.demoLoading.classList.remove('active');
        if (DOM.demoLatencyTag) {
          DOM.demoLatencyTag.textContent = `${modeConfigs[state.currentMode]?.latencyPrefix || 'Engine Active'}`;
        }

        // Stream typewriter effect
        let charIndex = 0;
        const streamSpeed = 12; // ms per chunk
        const chunkSize = 3;

        function typeChunk() {
          if (charIndex < textToStream.length) {
            DOM.demoOutput.textContent += textToStream.slice(charIndex, charIndex + chunkSize);
            charIndex += chunkSize;
            state.currentDemoTimeout = setTimeout(typeChunk, streamSpeed);
          } else {
            DOM.demoOutput.textContent = textToStream;
            state.isGenerating = false;
            DOM.demoGenerateBtn.disabled = false;
            DOM.demoGenerateBtn.style.opacity = '1';
          }
        }

        typeChunk();
      }, simulatedLatency);
    }

    // Copy to clipboard
    if (DOM.demoCopyBtn) {
      DOM.demoCopyBtn.addEventListener('click', () => {
        const text = DOM.demoOutput.textContent.trim();
        if (!text || text.includes('Responses appear here in real time')) {
          showToast('No generated text to copy yet.', 'info');
          return;
        }

        navigator.clipboard.writeText(text).then(() => {
          DOM.demoCopyBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
          showToast('Output copied to clipboard!', 'success');
          setTimeout(() => {
            DOM.demoCopyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> <span>Copy Output</span>';
          }, 2000);
        }).catch(() => {
          showToast('Failed to copy text.', 'error');
        });
      });
    }

    // Initial render of writer chips
    renderChipsForMode('writer');
  }

  // ---------------------------------------------------------------------------
  // 8. Modals System (Login, Sign Up, Contact Sales)
  // ---------------------------------------------------------------------------
  function setupModals() {
    const openModal = (modal) => {
      if (!modal) return;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      const firstInput = modal.querySelector('input');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    };

    const closeModal = (modal) => {
      if (!modal) return;
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    // Close buttons
    DOM.modalCloses.forEach(btn => {
      btn.addEventListener('click', () => {
        closeModal(btn.closest('.modal-overlay'));
      });
    });

    // Backdrop click
    [DOM.authModal, DOM.salesModal].forEach(modal => {
      if (!modal) return;
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });

    // ESC key close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(DOM.authModal);
        closeModal(DOM.salesModal);
      }
    });

    // Wire Login Triggers
    DOM.loginBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modalTitle = DOM.authModal.querySelector('.modal-header h3');
        const submitBtn = DOM.authModal.querySelector('button[type="submit"]');
        if (modalTitle) modalTitle.textContent = 'Welcome Back to Nexora AI';
        if (submitBtn) submitBtn.textContent = 'Log In to Dashboard';
        openModal(DOM.authModal);
      });
    });

    // Wire Sign Up Triggers
    DOM.signupBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modalTitle = DOM.authModal.querySelector('.modal-header h3');
        const submitBtn = DOM.authModal.querySelector('button[type="submit"]');
        if (modalTitle) modalTitle.textContent = 'Create Your Free Nexora AI Account';
        if (submitBtn) submitBtn.textContent = 'Start 14-Day Pro Trial';
        openModal(DOM.authModal);
      });
    });

    // Wire Contact Sales Triggers
    DOM.contactSalesBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(DOM.salesModal);
      });
    });

    // Form Submissions (Demo Simulated Handlers)
    if (DOM.loginForm) {
      DOM.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = DOM.loginForm.querySelector('input[type="email"]').value;
        closeModal(DOM.authModal);
        showToast(`Welcome! Simulated demo session initialized for ${email}`, 'success');
        DOM.loginForm.reset();
      });
    }

    if (DOM.salesForm) {
      DOM.salesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = DOM.salesForm.querySelector('input[name="name"]')?.value || 'there';
        closeModal(DOM.salesModal);
        showToast(`Thank you, ${name}! An enterprise specialist will contact you shortly.`, 'success');
        DOM.salesForm.reset();
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 9. Toast Notification System
  // ---------------------------------------------------------------------------
  function setupToastSystem() {
    window.showToast = function (message, type = 'info') {
      if (!DOM.toastContainer) return;

      const toast = document.createElement('div');
      toast.className = 'toast';

      let icon = '<i class="fa-solid fa-circle-info" style="color: var(--accent-secondary)"></i>';
      if (type === 'success') {
        icon = '<i class="fa-solid fa-circle-check" style="color: #10b981"></i>';
      } else if (type === 'error') {
        icon = '<i class="fa-solid fa-triangle-exclamation" style="color: #ef4444"></i>';
      }

      toast.innerHTML = `${icon} <span>${message}</span>`;
      DOM.toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 260);
      }, 3500);
    };
  }

  // ---------------------------------------------------------------------------
  // 10. Bootstrapping on DOM Ready
  // ---------------------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
