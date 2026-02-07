# n8n Workflow Recommendation System - Usage Guide

## How to Use This System

This guide explains how to interact with the workflow recommendation system to get the best workflow suggestions for your needs.

---

## Quick Start

### Step 1: Describe Your Workflow Need
Provide a clear description of what you want to automate. Include:
- **What triggers the workflow** (e.g., form submission, schedule, webhook)
- **What services/tools are involved** (e.g., Google Sheets, Slack, CRM)
- **What should happen** (e.g., send notification, update database, create record)
- **Expected outcome** (e.g., data synced, team notified, report generated)

### Step 2: Review Recommendations
The system will provide:
- **Primary recommendation**: Best matching workflow template
- **Alternative options**: 2-3 other relevant workflows
- **Match score**: How well each template fits your needs
- **Required integrations**: Services you'll need to connect

### Step 3: Get Adaptation Guidance
For each recommendation, you'll receive:
- **What to keep**: Core structure to preserve
- **What to modify**: Specific changes needed
- **What to add**: Additional nodes or features
- **What to remove**: Unnecessary components
- **Step-by-step instructions**: How to customize

### Step 4: Refine Through Questions
Ask follow-up questions to:
- Clarify implementation details
- Explore alternative approaches
- Add additional features
- Troubleshoot issues
- Optimize performance

---

## Example Interactions

### Example 1: Simple Form to Notification

**User Request**:
> "I need to get notified in Slack when someone submits a Typeform"

**System Response**:

**Primary Recommendation**: Typeform to Slack Notification (ID: `marketing-typeform-email-001`)
- **Match Score**: 90%
- **Why This Fits**: Direct Typeform trigger with Slack notification
- **Workflow Pattern**: Trigger → Transform → Notify
- **Required Integrations**: Typeform, Slack

**Workflow Structure**:
```
Typeform Trigger → Format Message → Slack Notification
```

**Adaptation Needed**:
- **Keep**: Typeform trigger, Slack notification structure
- **Modify**: 
  - Slack channel configuration
  - Message format to include form fields you want
- **Add**: None (workflow is complete for basic use)
- **Remove**: Google Sheets node (if you don't need storage)

**Configuration Steps**:
1. Connect Typeform account and select your form
2. Configure Slack webhook or OAuth connection
3. Select Slack channel for notifications
4. Customize message format with form fields
5. Test with a sample submission

**Follow-up Questions You Might Ask**:
- "Can I also save responses to Google Sheets?"
- "How do I format the Slack message?"
- "Can I filter which responses trigger notifications?"

---

### Example 2: Data Synchronization

**User Request**:
> "I want to sync Airtable records to Google Sheets every hour and get notified if there are errors"

**System Response**:

**Primary Recommendation**: Airtable to Google Sheets Sync (ID: `sync-airtable-gsheets-001`)
- **Match Score**: 85%
- **Why This Fits**: Scheduled sync between Airtable and Google Sheets
- **Workflow Pattern**: Schedule → Fetch → Transform → Store
- **Required Integrations**: Airtable, Google Sheets, Slack (for notifications)

**Workflow Structure**:
```
Schedule Trigger (Hourly) → Airtable Fetch → Transform Data → Google Sheets Update → Error Check → Slack Alert
```

**Adaptation Needed**:
- **Keep**: Core sync logic, schedule trigger
- **Modify**: 
  - Schedule to hourly (if not already)
  - Field mappings between Airtable and Sheets
- **Add**: 
  - Error handling node
  - Slack notification for errors
  - Success counter/logging
- **Remove**: None

**Configuration Steps**:
1. Set up Schedule Trigger for hourly execution (Cron: `0 * * * *`)
2. Connect Airtable and select base/table
3. Add field mapping to match your Airtable structure
4. Connect Google Sheets and select spreadsheet/sheet
5. Add IF node to check for errors
6. Configure Slack notification for error path
7. Test with manual execution first

**Code for Error Handling**:
```javascript
// Check if sync was successful
const hasErrors = $node["Google Sheets"].json.error !== undefined;

return {
  success: !hasErrors,
  recordsProcessed: items.length,
  timestamp: new Date().toISOString(),
  error: hasErrors ? $node["Google Sheets"].json.error : null
};
```

**Alternative Recommendations**:
1. **Database to CRM Sync** (ID: `sync-db-crm-001`) - If you need bi-directional sync
2. **Multi-Source Data Aggregation** (ID: `analytics-data-aggregation-001`) - If syncing from multiple sources

---

### Example 3: Complex Multi-Step Workflow

**User Request**:
> "When a customer fills out our contact form, I want to:
> 1. Add them to our CRM
> 2. Enrich their data with company information
> 3. Score them as a lead
> 4. Send different notifications based on their score
> 5. Add high-value leads to a special Slack channel"

**System Response**:

**Primary Recommendation**: Website Form to CRM with Scoring (ID: `crm-form-scoring-001`)
- **Match Score**: 80%
- **Why This Fits**: Form capture with lead scoring and routing
- **Workflow Pattern**: Event → Score → Conditional Route → Store → Notify
- **Required Integrations**: Form Service, Clearbit (enrichment), CRM, Slack, Email

**Workflow Structure**:
```
Form Webhook → Enrich Data → Score Lead → Route by Score → CRM Update → Multi-Channel Notify
```

**Adaptation Needed**:
- **Keep**: Core scoring and routing logic
- **Modify**: 
  - Scoring criteria to match your business rules
  - CRM field mappings
  - Notification channels and messages
- **Add**: 
  - Clearbit enrichment node (before scoring)
  - Additional Slack channel for high-value leads
  - Email notification for sales team
- **Remove**: None

**Detailed Implementation**:

**Step 1: Form Webhook Setup**
```javascript
// Webhook receives form data
{
  "name": "John Doe",
  "email": "john@company.com",
  "company": "Acme Corp",
  "phone": "+1234567890",
  "message": "Interested in enterprise plan"
}
```

**Step 2: Data Enrichment (Clearbit)**
```javascript
// HTTP Request to Clearbit API
{
  "method": "GET",
  "url": "https://person.clearbit.com/v2/combined/find",
  "qs": {
    "email": "{{ $json.email }}"
  },
  "headers": {
    "Authorization": "Bearer YOUR_CLEARBIT_KEY"
  }
}

// Merge enriched data
const formData = $node["Webhook"].json;
const enrichedData = $node["Clearbit"].json;

return {
  ...formData,
  companySize: enrichedData.company?.metrics?.employees,
  industry: enrichedData.company?.category?.industry,
  revenue: enrichedData.company?.metrics?.estimatedAnnualRevenue,
  location: enrichedData.person?.location,
  enriched: true
};
```

**Step 3: Lead Scoring**
```javascript
let score = 0;

// Company size scoring
if ($json.companySize > 1000) score += 30;
else if ($json.companySize > 100) score += 20;
else if ($json.companySize > 10) score += 10;

// Industry scoring
const highValueIndustries = ['Technology', 'Finance', 'Healthcare'];
if (highValueIndustries.includes($json.industry)) score += 20;

// Revenue scoring
if ($json.revenue > 10000000) score += 30;
else if ($json.revenue > 1000000) score += 20;

// Message intent scoring
const urgentKeywords = ['urgent', 'asap', 'immediately', 'enterprise'];
const messageHasUrgency = urgentKeywords.some(keyword => 
  $json.message.toLowerCase().includes(keyword)
);
if (messageHasUrgency) score += 20;

// Determine lead quality
let quality = 'Cold';
if (score >= 70) quality = 'Hot';
else if (score >= 40) quality = 'Warm';

return {
  ...$json,
  leadScore: score,
  leadQuality: quality,
  scoredAt: new Date().toISOString()
};
```

**Step 4: Conditional Routing**
```javascript
// IF Node conditions
// Route 1: Hot Leads (score >= 70)
{{ $json.leadQuality === 'Hot' }}

// Route 2: Warm Leads (score >= 40 && score < 70)
{{ $json.leadQuality === 'Warm' }}

// Route 3: Cold Leads (score < 40)
{{ $json.leadQuality === 'Cold' }}
```

**Step 5: CRM Update (All Routes)**
```javascript
// HubSpot/Salesforce contact creation
{
  "properties": {
    "email": "{{ $json.email }}",
    "firstname": "{{ $json.name.split(' ')[0] }}",
    "lastname": "{{ $json.name.split(' ')[1] }}",
    "company": "{{ $json.company }}",
    "phone": "{{ $json.phone }}",
    "lead_score": "{{ $json.leadScore }}",
    "lead_quality": "{{ $json.leadQuality }}",
    "company_size": "{{ $json.companySize }}",
    "industry": "{{ $json.industry }}"
  }
}
```

**Step 6: Multi-Channel Notifications**

**Hot Leads**:
```javascript
// Slack - Special high-value channel
{
  "channel": "#hot-leads",
  "text": "🔥 Hot Lead Alert!",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*New Hot Lead* (Score: {{ $json.leadScore }})\n*Name:* {{ $json.name }}\n*Company:* {{ $json.company }} ({{ $json.companySize }} employees)\n*Industry:* {{ $json.industry }}\n*Email:* {{ $json.email }}"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "View in CRM" },
          "url": "{{ $json.crmUrl }}"
        }
      ]
    }
  ]
}

// Email - Immediate sales team notification
{
  "to": "sales-team@company.com",
  "subject": "🔥 Hot Lead: {{ $json.company }}",
  "html": "<h2>Immediate Action Required</h2><p>High-value lead...</p>"
}

// SMS - On-call sales rep
{
  "to": "+1234567890",
  "body": "Hot lead: {{ $json.name }} from {{ $json.company }}. Score: {{ $json.leadScore }}"
}
```

**Warm Leads**:
```javascript
// Slack - General leads channel
{
  "channel": "#leads",
  "text": "New Warm Lead: {{ $json.name }} from {{ $json.company }}"
}

// Email - Daily digest (stored for batch sending)
// Store in database for later aggregation
```

**Cold Leads**:
```javascript
// Slack - Low priority channel
{
  "channel": "#leads-low-priority",
  "text": "New lead: {{ $json.name }}"
}

// Add to nurture campaign
// No immediate notification
```

**Alternative Approaches**:
1. **Hybrid Approach**: Combine with "LinkedIn Lead Capture" for social prospecting
2. **Enhanced Version**: Add "Email Campaign Response Tracking" for follow-up automation
3. **Simplified Version**: Remove enrichment if budget is limited, use form data only

**Follow-up Questions You Might Ask**:
- "How do I adjust the scoring criteria?"
- "Can I add more notification channels?"
- "What if Clearbit enrichment fails?"
- "How do I test this without sending real notifications?"
- "Can I add a manual review step for hot leads?"

---

## Question Types and How to Ask

### 1. Implementation Questions
**Good**: "How do I configure the Slack webhook for this workflow?"
**Better**: "I'm using Slack OAuth instead of webhooks. How should I modify the Slack node configuration?"

### 2. Customization Questions
**Good**: "Can I add email notifications?"
**Better**: "I want to add email notifications only for high-priority items. Where should I add the IF node and email node in the workflow?"

### 3. Troubleshooting Questions
**Good**: "The workflow isn't working"
**Better**: "The Airtable node is returning an authentication error. I've checked my API key. What else could be wrong?"

### 4. Optimization Questions
**Good**: "How can I make this faster?"
**Better**: "This workflow processes 1000 records and takes 10 minutes. Can I use batch processing to speed it up?"

### 5. Alternative Approach Questions
**Good**: "Is there another way to do this?"
**Better**: "Instead of polling every hour, can I use webhooks to trigger this workflow in real-time?"

---

## Common Follow-up Question Patterns

### After Initial Recommendation

**"Can I also..."**
- Add additional actions
- Integrate more services
- Store data in multiple places
- Send notifications to more channels

**"What if..."**
- Error scenarios
- Edge cases
- Service unavailability
- Data format issues

**"How do I..."**
- Configure specific nodes
- Handle authentication
- Transform data formats
- Test the workflow

**"Instead of [X], can I use [Y]?"**
- Alternative services
- Different trigger types
- Other data sources
- Different notification methods

### During Implementation

**"I'm getting an error..."**
- Provide error message
- Describe what you've tried
- Share relevant configuration

**"The data format is different..."**
- Show example input data
- Show expected output format
- Ask about transformation approach

**"Can you show me the code for..."**
- Specific transformations
- Custom logic
- Data validation
- Error handling

### After Implementation

**"How can I improve..."**
- Performance optimization
- Error handling
- Monitoring
- Scalability

**"Can I extend this to..."**
- Additional use cases
- More complex scenarios
- Integration with other workflows

---

## Tips for Best Results

### 1. Be Specific About Services
❌ "I want to sync data between two systems"
✅ "I want to sync contacts from HubSpot to Google Sheets"

### 2. Describe the Trigger Clearly
❌ "When something happens"
✅ "When a new row is added to Google Sheets" or "Every day at 9 AM"

### 3. Mention Data Flow
❌ "I need to process data"
✅ "I need to fetch data from API A, transform it, and send to API B"

### 4. Include Business Context
❌ "I need a workflow"
✅ "I need to automate our lead qualification process to reduce manual work"

### 5. Specify Constraints
- Budget limitations (free vs. paid services)
- Technical constraints (no-code only, or coding OK)
- Performance requirements (real-time vs. batch)
- Compliance requirements (data privacy, security)

---

## Iterative Refinement Process

### Round 1: Initial Request
**You**: "I need to sync Typeform responses to Airtable"

**System**: Provides basic Typeform → Airtable workflow

### Round 2: Add Features
**You**: "Can I also send a Slack notification?"

**System**: Shows where to add Slack node and configuration

### Round 3: Add Conditions
**You**: "Only notify for responses where the user selected 'Enterprise' plan"

**System**: Adds IF node with condition and routing

### Round 4: Add Error Handling
**You**: "What if Airtable is down?"

**System**: Adds error handling, retry logic, and fallback storage

### Round 5: Optimize
**You**: "This runs every minute. Can I make it real-time?"

**System**: Suggests switching from polling to Typeform webhook trigger

---

## Workflow Request Templates

### Template 1: Form Processing
```
I need to process [FORM TYPE] submissions by:
1. Capturing data from [FORM SERVICE]
2. [OPTIONAL: Enriching/validating data]
3. Storing in [DESTINATION]
4. Notifying [TEAM/PERSON] via [CHANNEL]
5. [OPTIONAL: Additional actions]
```

### Template 2: Data Synchronization
```
I need to sync data between [SOURCE] and [DESTINATION]:
- Trigger: [Schedule/Event/Webhook]
- Frequency: [Real-time/Hourly/Daily]
- Direction: [One-way/Bi-directional]
- Data: [What data to sync]
- Conditions: [Any filters or conditions]
```

### Template 3: Monitoring & Alerts
```
I need to monitor [SYSTEM/METRIC] and:
- Check: [What to monitor]
- Frequency: [How often]
- Threshold: [When to alert]
- Alert channels: [Where to notify]
- Actions: [What to do when threshold is met]
```

### Template 4: Content Distribution
```
I need to distribute [CONTENT TYPE] to:
- Source: [Where content comes from]
- Destinations: [Where to publish]
- Schedule: [When to publish]
- Transformations: [Any format changes needed]
- Tracking: [How to track performance]
```

### Template 5: Customer Journey
```
I need to automate [CUSTOMER ACTION] by:
- Trigger: [What starts the journey]
- Steps: [List each step in the journey]
- Conditions: [Any branching logic]
- Endpoints: [Where the journey ends]
- Notifications: [Who gets notified when]
```

---

## Advanced Usage

### Combining Multiple Workflows
**Request**: "I want to combine the lead scoring workflow with the email campaign tracking"

**Approach**:
1. Identify common data points
2. Determine workflow execution order
3. Plan data passing between workflows
4. Consider using sub-workflows

### Building Complex Logic
**Request**: "I need complex conditional logic with multiple criteria"

**Approach**:
1. Break down logic into decision tree
2. Use nested IF nodes or Switch nodes
3. Consider using Function nodes for complex logic
4. Document decision criteria

### Scaling Workflows
**Request**: "This workflow needs to handle 10,000 items per day"

**Approach**:
1. Implement batch processing
2. Add rate limiting
3. Use queue systems if needed
4. Consider workflow splitting

---

## Getting the Most Value

### 1. Start Simple
Begin with basic workflow, then iterate to add features

### 2. Test Incrementally
Test each modification before adding more complexity

### 3. Document as You Go
Keep notes on customizations and why you made them

### 4. Ask for Alternatives
Request multiple approaches to find the best fit

### 5. Learn Patterns
Understand common patterns to apply to future workflows

### 6. Share Feedback
Let the system know what worked and what didn't

---

## Common Pitfalls to Avoid

### 1. Too Vague
❌ "I need automation"
✅ "I need to automate invoice processing from email to QuickBooks"

### 2. Too Complex Initially
❌ Asking for 10 features in first request
✅ Start with core functionality, add features iteratively

### 3. Missing Context
❌ "The workflow failed"
✅ "The workflow failed at the Google Sheets node with error: 'Invalid credentials'"

### 4. Not Testing
❌ Implementing full workflow without testing
✅ Test each section before moving to next

### 5. Ignoring Errors
❌ Assuming everything will work perfectly
✅ Plan for error scenarios and add handling

---

## Next Steps

After getting your workflow recommendation:

1. **Review the recommendation** - Understand the suggested workflow
2. **Check integrations** - Ensure you have access to required services
3. **Plan customizations** - Note what needs to be adapted
4. **Set up credentials** - Configure authentication for all services
5. **Build incrementally** - Implement one section at a time
6. **Test thoroughly** - Verify each component works
7. **Deploy gradually** - Start with test data, then production
8. **Monitor performance** - Track execution and success rates
9. **Iterate and improve** - Refine based on real-world usage
10. **Document your workflow** - Keep notes for future reference

---

## Support Resources

- **n8n Documentation**: https://docs.n8n.io
- **n8n Community Forum**: https://community.n8n.io
- **Workflow Templates**: https://n8n.io/workflows
- **Node Documentation**: Check each node's help panel in n8n
- **Video Tutorials**: n8n YouTube channel

---

## Feedback

Help improve this system by providing feedback on:
- Recommendation accuracy
- Adaptation guide clarity
- Missing workflow patterns
- Documentation quality
- Feature requests

Your feedback helps make the system better for everyone!
