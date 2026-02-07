# n8n Workflow Knowledge Base

## Workflow Template Catalog

This knowledge base contains categorized n8n workflow templates from the community, structured for semantic search and recommendation.

---

## 1. Data Synchronization Workflows

### 1.1 Airtable to Google Sheets Sync
- **ID**: `sync-airtable-gsheets-001`
- **Category**: Data Synchronization
- **Description**: Automatically sync records from Airtable to Google Sheets on a schedule or when records are created/updated
- **Use Cases**: 
  - Keep spreadsheets updated with database changes
  - Share Airtable data with non-Airtable users
  - Create backup copies of Airtable data
- **Nodes**: Airtable Trigger, Google Sheets, Schedule Trigger
- **Integrations**: Airtable, Google Sheets
- **Triggers**: Schedule (Cron), Airtable Trigger
- **Complexity**: Beginner
- **Tags**: sync, airtable, google-sheets, backup, data-transfer
- **Pattern**: Schedule → Fetch → Transform → Store

### 1.2 Database to CRM Sync
- **ID**: `sync-db-crm-001`
- **Category**: Data Synchronization
- **Description**: Bi-directional sync between database and CRM system to keep customer data consistent
- **Use Cases**:
  - Sync customer records between systems
  - Update contact information across platforms
  - Maintain data consistency
- **Nodes**: PostgreSQL/MySQL, HubSpot/Salesforce, Schedule Trigger, Compare Datasets
- **Integrations**: Database (PostgreSQL/MySQL), CRM (HubSpot/Salesforce)
- **Triggers**: Schedule (Cron)
- **Complexity**: Intermediate
- **Tags**: sync, database, crm, bi-directional, customer-data
- **Pattern**: Schedule → Fetch → Compare → Update

### 1.3 Multi-Platform Contact Sync
- **ID**: `sync-contacts-multi-001`
- **Category**: Data Synchronization
- **Description**: Sync contacts across multiple platforms (Google Contacts, Outlook, CRM)
- **Use Cases**:
  - Centralize contact management
  - Keep contact lists updated everywhere
  - Prevent duplicate entries
- **Nodes**: Google Contacts, Microsoft Outlook, CRM, Merge, Deduplicate
- **Integrations**: Google Contacts, Microsoft Outlook, CRM
- **Triggers**: Schedule (Cron), Webhook
- **Complexity**: Advanced
- **Tags**: contacts, sync, multi-platform, deduplication
- **Pattern**: Schedule → Fetch Multiple → Merge → Deduplicate → Distribute

---

## 2. Marketing Automation Workflows

### 2.1 Typeform to Email Campaign
- **ID**: `marketing-typeform-email-001`
- **Category**: Marketing Automation
- **Description**: Automatically add Typeform respondents to email marketing campaigns based on their answers
- **Use Cases**:
  - Lead capture from forms
  - Segment leads based on responses
  - Trigger personalized email sequences
- **Nodes**: Typeform Trigger, IF, Mailchimp/SendGrid, Google Sheets
- **Integrations**: Typeform, Mailchimp/SendGrid, Google Sheets
- **Triggers**: Typeform Trigger (new response)
- **Complexity**: Beginner
- **Tags**: marketing, typeform, email, lead-capture, segmentation
- **Pattern**: Trigger → Conditional → Action → Store

### 2.2 Social Media Lead Generation
- **ID**: `marketing-social-leads-001`
- **Category**: Marketing Automation
- **Description**: Monitor social media for keywords, capture leads, and add to CRM with enrichment
- **Use Cases**:
  - Social listening for sales opportunities
  - Automated lead qualification
  - Social media prospecting
- **Nodes**: Twitter/LinkedIn, Clearbit/Hunter.io, CRM, Slack
- **Integrations**: Social Media APIs, Data Enrichment, CRM, Slack
- **Triggers**: Schedule (Cron), Webhook
- **Complexity**: Intermediate
- **Tags**: social-media, lead-generation, enrichment, crm
- **Pattern**: Poll → Filter → Enrich → Store → Notify

### 2.3 Abandoned Cart Recovery
- **ID**: `marketing-cart-recovery-001`
- **Category**: Marketing Automation
- **Description**: Send automated email sequences to customers who abandoned their shopping carts
- **Use Cases**:
  - Recover lost sales
  - Personalized cart reminders
  - Discount offers for abandoned carts
- **Nodes**: E-commerce Platform, Wait, Email, IF, Database
- **Integrations**: Shopify/WooCommerce, Email Service, Database
- **Triggers**: Webhook (cart abandoned event)
- **Complexity**: Intermediate
- **Tags**: e-commerce, cart-recovery, email, automation
- **Pattern**: Event → Wait → Check Status → Conditional Email

---

## 3. Customer Support Workflows

### 3.1 Email to Ticket System
- **ID**: `support-email-ticket-001`
- **Category**: Customer Support
- **Description**: Automatically create support tickets from emails and notify team in Slack
- **Use Cases**:
  - Centralize support requests
  - Auto-route tickets to teams
  - Track email-based support
- **Nodes**: Email Trigger (IMAP), Zendesk/Freshdesk, Slack, IF
- **Integrations**: Email (IMAP), Zendesk/Freshdesk, Slack
- **Triggers**: Email Trigger (IMAP)
- **Complexity**: Beginner
- **Tags**: support, email, ticketing, slack, automation
- **Pattern**: Trigger → Create → Notify

### 3.2 Customer Feedback Loop
- **ID**: `support-feedback-loop-001`
- **Category**: Customer Support
- **Description**: Collect customer feedback via survey, analyze sentiment, and route to appropriate teams
- **Use Cases**:
  - Automated feedback collection
  - Sentiment analysis
  - Priority routing for negative feedback
- **Nodes**: Survey Tool, Sentiment Analysis, IF, CRM, Slack, Email
- **Integrations**: Typeform/SurveyMonkey, Sentiment API, CRM, Slack
- **Triggers**: Survey Trigger (new response)
- **Complexity**: Intermediate
- **Tags**: feedback, survey, sentiment, routing, customer-satisfaction
- **Pattern**: Trigger → Analyze → Conditional Route → Store → Notify

### 3.3 Chatbot to Human Escalation
- **ID**: `support-chatbot-escalation-001`
- **Category**: Customer Support
- **Description**: Handle customer queries with chatbot, escalate complex issues to human agents
- **Use Cases**:
  - First-line automated support
  - Smart escalation
  - 24/7 initial response
- **Nodes**: Chatbot, IF, Ticket System, Slack, Database
- **Integrations**: Chatbot Platform, Zendesk, Slack, Database
- **Triggers**: Webhook (chat message)
- **Complexity**: Advanced
- **Tags**: chatbot, escalation, support, automation, ai
- **Pattern**: Event → Process → Conditional → Escalate/Resolve

---

## 4. Content Management Workflows

### 4.1 RSS to Social Media
- **ID**: `content-rss-social-001`
- **Category**: Content Management
- **Description**: Automatically post new RSS feed items to multiple social media platforms
- **Use Cases**:
  - Blog post distribution
  - Content syndication
  - Multi-platform posting
- **Nodes**: RSS Feed Trigger, Twitter, LinkedIn, Facebook, Buffer
- **Integrations**: RSS, Twitter, LinkedIn, Facebook, Buffer
- **Triggers**: RSS Feed Trigger (new item)
- **Complexity**: Beginner
- **Tags**: rss, social-media, content, distribution, automation
- **Pattern**: Trigger → Transform → Multi-Distribute

### 4.2 Content Publishing Pipeline
- **ID**: `content-publishing-pipeline-001`
- **Category**: Content Management
- **Description**: Manage content from draft to published across CMS, social media, and email
- **Use Cases**:
  - Coordinated content launches
  - Multi-channel publishing
  - Content calendar automation
- **Nodes**: Airtable/Notion, WordPress/CMS, Social Media, Email, Schedule
- **Integrations**: Content Calendar, CMS, Social Media, Email Service
- **Triggers**: Schedule (Cron), Webhook
- **Complexity**: Intermediate
- **Tags**: publishing, cms, content-calendar, multi-channel
- **Pattern**: Schedule → Fetch → Conditional → Multi-Publish

### 4.3 Media Processing and Distribution
- **ID**: `content-media-processing-001`
- **Category**: Content Management
- **Description**: Process uploaded media (resize, optimize, watermark) and distribute to CDN and platforms
- **Use Cases**:
  - Image optimization
  - Video processing
  - Asset distribution
- **Nodes**: Webhook, Image Processing, CDN Upload, Database, Notification
- **Integrations**: Cloudinary, AWS S3, CDN, Database
- **Triggers**: Webhook (file upload)
- **Complexity**: Advanced
- **Tags**: media, processing, cdn, optimization, distribution
- **Pattern**: Event → Process → Store → Distribute → Notify

---

## 5. E-commerce Operations Workflows

### 5.1 Order Processing Automation
- **ID**: `ecommerce-order-processing-001`
- **Category**: E-commerce Operations
- **Description**: Automate order processing from payment to fulfillment with customer notifications
- **Use Cases**:
  - End-to-end order automation
  - Customer communication
  - Inventory updates
- **Nodes**: E-commerce Platform, Payment Gateway, Fulfillment, Email, Database
- **Integrations**: Shopify/WooCommerce, Stripe, ShipStation, Email
- **Triggers**: Webhook (new order)
- **Complexity**: Intermediate
- **Tags**: e-commerce, orders, fulfillment, payment, automation
- **Pattern**: Event → Process → Fulfill → Notify → Update

### 5.2 Inventory Monitoring and Alerts
- **ID**: `ecommerce-inventory-alerts-001`
- **Category**: E-commerce Operations
- **Description**: Monitor inventory levels and send alerts when stock is low or out
- **Use Cases**:
  - Prevent stockouts
  - Automated reordering
  - Inventory tracking
- **Nodes**: E-commerce Platform, Schedule, IF, Email, Slack, Database
- **Integrations**: Shopify/WooCommerce, Email, Slack, Database
- **Triggers**: Schedule (Cron)
- **Complexity**: Beginner
- **Tags**: inventory, monitoring, alerts, e-commerce, stock
- **Pattern**: Schedule → Fetch → Compare → Conditional Alert

### 5.3 Multi-Channel Product Sync
- **ID**: `ecommerce-product-sync-001`
- **Category**: E-commerce Operations
- **Description**: Sync product information across multiple sales channels and marketplaces
- **Use Cases**:
  - Multi-marketplace selling
  - Consistent product data
  - Centralized inventory
- **Nodes**: E-commerce Platform, Amazon, eBay, Etsy, Database
- **Integrations**: Shopify, Amazon, eBay, Etsy, Database
- **Triggers**: Webhook (product update), Schedule
- **Complexity**: Advanced
- **Tags**: multi-channel, products, sync, marketplace, e-commerce
- **Pattern**: Event → Transform → Multi-Distribute → Verify

---

## 6. DevOps & Monitoring Workflows

### 6.1 GitHub to Slack Deployment Notifications
- **ID**: `devops-github-slack-001`
- **Category**: DevOps & Monitoring
- **Description**: Send Slack notifications for GitHub events (commits, PRs, deployments)
- **Use Cases**:
  - Team notifications
  - Deployment tracking
  - Code review alerts
- **Nodes**: GitHub Trigger, Slack, IF, Database
- **Integrations**: GitHub, Slack, Database
- **Triggers**: GitHub Webhook
- **Complexity**: Beginner
- **Tags**: github, slack, notifications, devops, deployment
- **Pattern**: Event → Transform → Notify

### 6.2 Server Monitoring and Incident Management
- **ID**: `devops-monitoring-incident-001`
- **Category**: DevOps & Monitoring
- **Description**: Monitor server health, create incidents for issues, and notify on-call team
- **Use Cases**:
  - Uptime monitoring
  - Automated incident creation
  - On-call notifications
- **Nodes**: HTTP Request, IF, PagerDuty/Opsgenie, Slack, Database
- **Integrations**: Monitoring Service, PagerDuty, Slack, Database
- **Triggers**: Schedule (Cron)
- **Complexity**: Intermediate
- **Tags**: monitoring, incidents, alerts, devops, uptime
- **Pattern**: Poll → Check → Conditional → Create Incident → Notify

### 6.3 Automated Backup and Verification
- **ID**: `devops-backup-verification-001`
- **Category**: DevOps & Monitoring
- **Description**: Automated database backups with verification and reporting
- **Use Cases**:
  - Scheduled backups
  - Backup verification
  - Disaster recovery
- **Nodes**: Database, AWS S3, Verification, Email, Slack
- **Integrations**: Database, AWS S3, Email, Slack
- **Triggers**: Schedule (Cron)
- **Complexity**: Intermediate
- **Tags**: backup, database, verification, disaster-recovery, automation
- **Pattern**: Schedule → Backup → Verify → Store → Report

---

## 7. Reporting & Analytics Workflows

### 7.1 Multi-Source Data Aggregation
- **ID**: `analytics-data-aggregation-001`
- **Category**: Reporting & Analytics
- **Description**: Aggregate data from multiple sources into a central reporting database
- **Use Cases**:
  - Unified reporting
  - Cross-platform analytics
  - Data warehouse population
- **Nodes**: Multiple API Nodes, Transform, Database, Schedule
- **Integrations**: Various APIs, Database, Google Sheets
- **Triggers**: Schedule (Cron)
- **Complexity**: Intermediate
- **Tags**: analytics, aggregation, reporting, data-warehouse, etl
- **Pattern**: Schedule → Fetch Multiple → Transform → Aggregate → Store

### 7.2 Scheduled Report Generation
- **ID**: `analytics-scheduled-reports-001`
- **Category**: Reporting & Analytics
- **Description**: Generate and distribute reports on a schedule via email or Slack
- **Use Cases**:
  - Daily/weekly reports
  - Automated dashboards
  - Stakeholder updates
- **Nodes**: Database/API, Transform, Chart/PDF, Email, Slack, Schedule
- **Integrations**: Database, Email, Slack, Chart Service
- **Triggers**: Schedule (Cron)
- **Complexity**: Beginner
- **Tags**: reports, scheduling, email, analytics, automation
- **Pattern**: Schedule → Fetch → Transform → Generate → Distribute

### 7.3 Real-Time Dashboard Updates
- **ID**: `analytics-realtime-dashboard-001`
- **Category**: Reporting & Analytics
- **Description**: Push real-time data updates to dashboards and visualization tools
- **Use Cases**:
  - Live dashboards
  - Real-time metrics
  - Instant data visualization
- **Nodes**: Webhook, Transform, Dashboard API, Database
- **Integrations**: Data Source, Grafana/Tableau, Database
- **Triggers**: Webhook (data event)
- **Complexity**: Advanced
- **Tags**: real-time, dashboard, visualization, analytics, streaming
- **Pattern**: Event → Transform → Push → Update

---

## 8. Lead Generation & CRM Workflows

### 8.1 LinkedIn Lead Capture
- **ID**: `crm-linkedin-leads-001`
- **Category**: Lead Generation & CRM
- **Description**: Capture LinkedIn leads, enrich with additional data, and add to CRM
- **Use Cases**:
  - LinkedIn prospecting
  - Lead enrichment
  - Sales pipeline automation
- **Nodes**: LinkedIn, Clearbit/Hunter.io, CRM, Email, Slack
- **Integrations**: LinkedIn, Data Enrichment, CRM, Email, Slack
- **Triggers**: Schedule (Cron), Webhook
- **Complexity**: Intermediate
- **Tags**: linkedin, leads, enrichment, crm, sales
- **Pattern**: Fetch → Enrich → Store → Notify

### 8.2 Website Form to CRM with Scoring
- **ID**: `crm-form-scoring-001`
- **Category**: Lead Generation & CRM
- **Description**: Capture website form submissions, score leads, and route to sales team
- **Use Cases**:
  - Lead qualification
  - Automated scoring
  - Sales routing
- **Nodes**: Webhook, Lead Scoring, IF, CRM, Email, Slack
- **Integrations**: Form Service, CRM, Email, Slack
- **Triggers**: Webhook (form submission)
- **Complexity**: Intermediate
- **Tags**: forms, lead-scoring, crm, qualification, routing
- **Pattern**: Event → Score → Conditional Route → Store → Notify

### 8.3 Email Campaign Response Tracking
- **ID**: `crm-email-tracking-001`
- **Category**: Lead Generation & CRM
- **Description**: Track email campaign responses and update CRM with engagement data
- **Use Cases**:
  - Email engagement tracking
  - Lead nurturing
  - Campaign analytics
- **Nodes**: Email Service, Webhook, CRM, Database, Analytics
- **Integrations**: Email Service, CRM, Database, Analytics
- **Triggers**: Webhook (email event)
- **Complexity**: Beginner
- **Tags**: email, tracking, crm, engagement, campaigns
- **Pattern**: Event → Parse → Update → Analyze

---

## 9. Notification Systems Workflows

### 9.1 Multi-Channel Alert System
- **ID**: `notification-multi-channel-001`
- **Category**: Notification Systems
- **Description**: Send alerts across multiple channels (Email, Slack, SMS, Push) based on priority
- **Use Cases**:
  - Critical alerts
  - Multi-channel notifications
  - Priority-based routing
- **Nodes**: Webhook, IF, Email, Slack, Twilio, Push Service
- **Integrations**: Email, Slack, Twilio, Push Notification Service
- **Triggers**: Webhook (alert event)
- **Complexity**: Intermediate
- **Tags**: notifications, alerts, multi-channel, priority, routing
- **Pattern**: Event → Prioritize → Multi-Channel Notify

### 9.2 Digest Notifications
- **ID**: `notification-digest-001`
- **Category**: Notification Systems
- **Description**: Aggregate events and send periodic digest notifications
- **Use Cases**:
  - Daily summaries
  - Reduced notification noise
  - Batch updates
- **Nodes**: Schedule, Database, Aggregate, Email, Slack
- **Integrations**: Database, Email, Slack
- **Triggers**: Schedule (Cron)
- **Complexity**: Beginner
- **Tags**: digest, notifications, aggregation, summary, batch
- **Pattern**: Schedule → Fetch → Aggregate → Format → Send

### 9.3 Smart Notification Routing
- **ID**: `notification-smart-routing-001`
- **Category**: Notification Systems
- **Description**: Route notifications to appropriate team members based on rules and availability
- **Use Cases**:
  - On-call routing
  - Team-based notifications
  - Escalation paths
- **Nodes**: Webhook, IF, Database, Email, Slack, SMS
- **Integrations**: Database, Email, Slack, SMS Service
- **Triggers**: Webhook (notification event)
- **Complexity**: Advanced
- **Tags**: routing, notifications, on-call, escalation, smart
- **Pattern**: Event → Check Rules → Route → Notify → Track

---

## 10. Document Processing Workflows

### 10.1 Invoice Processing and Extraction
- **ID**: `document-invoice-processing-001`
- **Category**: Document Processing
- **Description**: Extract data from invoices using OCR and store in accounting system
- **Use Cases**:
  - Automated invoice processing
  - Data extraction
  - Accounting automation
- **Nodes**: Email/Webhook, OCR Service, Transform, Accounting Software, Database
- **Integrations**: Email, OCR (Tesseract/Cloud Vision), QuickBooks/Xero
- **Triggers**: Email Trigger, Webhook
- **Complexity**: Advanced
- **Tags**: ocr, invoices, extraction, accounting, automation
- **Pattern**: Event → Extract → Validate → Store → Notify

### 10.2 Document Generation from Templates
- **ID**: `document-template-generation-001`
- **Category**: Document Processing
- **Description**: Generate documents (PDFs, contracts) from templates with dynamic data
- **Use Cases**:
  - Contract generation
  - Report creation
  - Document automation
- **Nodes**: Webhook, Database, Template Engine, PDF Generator, Storage
- **Integrations**: Database, Template Service, PDF Service, Cloud Storage
- **Triggers**: Webhook (request), Schedule
- **Complexity**: Intermediate
- **Tags**: documents, templates, pdf, generation, automation
- **Pattern**: Event → Fetch Data → Populate Template → Generate → Store

### 10.3 Document Approval Workflow
- **ID**: `document-approval-workflow-001`
- **Category**: Document Processing
- **Description**: Route documents for approval with notifications and tracking
- **Use Cases**:
  - Approval processes
  - Document review
  - Workflow management
- **Nodes**: Webhook, Database, Email, Slack, IF, Wait
- **Integrations**: Database, Email, Slack, Document Storage
- **Triggers**: Webhook (document submitted)
- **Complexity**: Intermediate
- **Tags**: approval, workflow, documents, review, tracking
- **Pattern**: Event → Route → Notify → Wait → Check → Update

---

## Common Integration Patterns

### Pattern: Form → CRM → Notification
**Workflows**: 1.1, 2.1, 8.2
**Structure**: Form submission → Data enrichment → CRM storage → Team notification
**Best For**: Lead capture, customer onboarding, data collection

### Pattern: Schedule → Fetch → Transform → Store
**Workflows**: 1.1, 1.2, 7.1
**Structure**: Scheduled trigger → API fetch → Data transformation → Database/Sheet storage
**Best For**: Data synchronization, reporting, backups

### Pattern: Event → Conditional → Multi-Action
**Workflows**: 2.3, 3.2, 9.1
**Structure**: Event trigger → Conditional logic → Multiple parallel actions
**Best For**: Smart routing, priority handling, multi-channel operations

### Pattern: Poll → Compare → Alert
**Workflows**: 5.2, 6.2
**Structure**: Scheduled polling → Compare with threshold → Conditional alert
**Best For**: Monitoring, tracking, threshold alerts

### Pattern: Webhook → Process → Distribute
**Workflows**: 4.1, 4.3, 7.3
**Structure**: Webhook trigger → Data processing → Multi-destination distribution
**Best For**: Real-time distribution, event broadcasting, content syndication

---

## Search Keywords Index

### By Integration
- **Airtable**: 1.1, 4.2
- **Google Sheets**: 1.1, 2.1, 7.1
- **Slack**: 2.2, 3.1, 3.2, 6.1, 6.2, 8.1, 9.1
- **Email**: 2.1, 2.3, 3.1, 6.3, 7.2, 9.1
- **CRM (HubSpot/Salesforce)**: 1.2, 2.2, 8.1, 8.2, 8.3
- **Typeform**: 2.1, 3.2
- **GitHub**: 6.1
- **Database**: 1.2, 6.3, 7.1, 9.2
- **Social Media**: 2.2, 4.1, 4.2
- **E-commerce**: 2.3, 5.1, 5.2, 5.3

### By Use Case
- **Lead Generation**: 2.1, 2.2, 8.1, 8.2
- **Data Sync**: 1.1, 1.2, 1.3, 5.3
- **Notifications**: 3.1, 6.1, 9.1, 9.2, 9.3
- **Monitoring**: 5.2, 6.2, 6.3
- **Content Distribution**: 4.1, 4.2, 4.3
- **Customer Support**: 3.1, 3.2, 3.3
- **E-commerce**: 2.3, 5.1, 5.2, 5.3
- **Reporting**: 7.1, 7.2, 7.3
- **Document Processing**: 10.1, 10.2, 10.3

### By Complexity
- **Beginner**: 1.1, 2.1, 3.1, 4.1, 5.2, 6.1, 7.2, 8.3, 9.2
- **Intermediate**: 1.2, 2.2, 2.3, 3.2, 4.2, 5.1, 6.2, 6.3, 7.1, 8.1, 8.2, 9.1, 10.2, 10.3
- **Advanced**: 1.3, 3.3, 4.3, 5.3, 7.3, 9.3, 10.1
