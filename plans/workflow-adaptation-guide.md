# n8n Workflow Adaptation Guide

## How to Customize Existing Workflows for Your Needs

This guide provides step-by-step instructions for adapting existing n8n workflow templates to match your specific requirements.

---

## General Adaptation Process

### Step 1: Identify the Base Workflow
1. Find a workflow that matches your core use case
2. Review the workflow structure and nodes
3. Understand the data flow and transformations
4. Check integration requirements

### Step 2: Analyze Differences
Compare the template with your requirements:
- **Integrations**: Which services differ?
- **Data Structure**: What fields need to change?
- **Logic**: What conditions need adjustment?
- **Triggers**: Does the trigger type match?
- **Actions**: What additional actions are needed?

### Step 3: Plan Modifications
Create a modification checklist:
- [ ] Nodes to keep unchanged
- [ ] Nodes to modify (configuration only)
- [ ] Nodes to replace (different service)
- [ ] Nodes to add (new functionality)
- [ ] Nodes to remove (unnecessary features)

### Step 4: Implement Changes
Make changes incrementally:
1. Start with trigger configuration
2. Update data transformations
3. Modify action nodes
4. Add new nodes as needed
5. Remove unnecessary nodes

### Step 5: Test and Validate
- Test with sample data
- Verify all integrations work
- Check error handling
- Validate output format
- Test edge cases

---

## Common Adaptation Scenarios

## Scenario 1: Changing Integrations

### Example: Typeform → Google Forms
**Original**: Typeform Trigger → Google Sheets
**Adapted**: Google Forms Trigger → Google Sheets

**Steps**:
1. **Replace Trigger Node**
   - Remove: Typeform Trigger
   - Add: Google Forms Trigger
   - Configure: Select form and response type

2. **Update Field Mapping**
   - Map Google Forms fields to match original Typeform fields
   - Adjust field names in subsequent nodes
   - Update any field-specific logic

3. **Test Data Flow**
   - Submit test form response
   - Verify data reaches Google Sheets correctly
   - Check field mapping accuracy

**Configuration Changes**:
```javascript
// Original Typeform field reference
{{ $json.answers[0].text }}

// Adapted Google Forms field reference
{{ $json.responses['Question 1'] }}
```

### Example: Mailchimp → SendGrid
**Original**: Form → Mailchimp
**Adapted**: Form → SendGrid

**Steps**:
1. **Replace Email Service Node**
   - Remove: Mailchimp node
   - Add: SendGrid node
   - Configure: API key and sender details

2. **Adjust Email Template**
   - Convert Mailchimp template to SendGrid format
   - Update dynamic content syntax
   - Configure email settings

3. **Update List Management**
   - Replace list subscription with contact management
   - Adjust segmentation logic if needed

**Configuration Changes**:
```javascript
// Mailchimp list subscription
{
  "email_address": "{{ $json.email }}",
  "status": "subscribed",
  "merge_fields": {
    "FNAME": "{{ $json.firstName }}"
  }
}

// SendGrid contact addition
{
  "contacts": [{
    "email": "{{ $json.email }}",
    "first_name": "{{ $json.firstName }}"
  }]
}
```

---

## Scenario 2: Adding Conditional Logic

### Example: Add Lead Scoring
**Original**: Form → CRM
**Adapted**: Form → Score → Conditional Route → CRM

**Steps**:
1. **Add Function Node for Scoring**
   ```javascript
   let score = 0;
   
   // Score based on company size
   if ($json.companySize === 'Enterprise') score += 30;
   else if ($json.companySize === 'Mid-Market') score += 20;
   else score += 10;
   
   // Score based on budget
   if ($json.budget > 50000) score += 30;
   else if ($json.budget > 10000) score += 20;
   else score += 10;
   
   // Score based on timeline
   if ($json.timeline === 'Immediate') score += 40;
   else if ($json.timeline === '1-3 months') score += 20;
   
   return {
     ...items[0].json,
     leadScore: score,
     leadQuality: score >= 70 ? 'Hot' : score >= 50 ? 'Warm' : 'Cold'
   };
   ```

2. **Add IF Node for Routing**
   - Condition 1: `{{ $json.leadQuality === 'Hot' }}`
   - Condition 2: `{{ $json.leadQuality === 'Warm' }}`
   - Default: Cold leads

3. **Add Different Actions per Route**
   - Hot: Immediate sales notification + CRM + High priority
   - Warm: CRM + Email nurture sequence
   - Cold: CRM + Long-term nurture

**Node Structure**:
```
Form Trigger → Score Function → IF Node → Hot Route → Sales Alert
                                        → Warm Route → Nurture Email
                                        → Cold Route → Long Nurture
```

---

## Scenario 3: Adding Data Enrichment

### Example: Enrich Contact Data
**Original**: Form → CRM
**Adapted**: Form → Clearbit Enrichment → CRM

**Steps**:
1. **Add HTTP Request Node (Clearbit API)**
   ```javascript
   {
     "method": "GET",
     "url": "https://person.clearbit.com/v2/combined/find",
     "qs": {
       "email": "{{ $json.email }}"
     },
     "headers": {
       "Authorization": "Bearer YOUR_API_KEY"
     }
   }
   ```

2. **Add Function Node to Merge Data**
   ```javascript
   const formData = items[0].json;
   const enrichedData = items[1].json;
   
   return {
     ...formData,
     company: enrichedData.company?.name,
     companySize: enrichedData.company?.metrics?.employees,
     industry: enrichedData.company?.category?.industry,
     location: enrichedData.person?.location,
     linkedIn: enrichedData.person?.linkedin?.handle,
     enriched: true
   };
   ```

3. **Update CRM Node with Enriched Fields**
   - Add new field mappings
   - Include enrichment status
   - Handle missing data gracefully

**Error Handling**:
```javascript
// Add IF node to check enrichment success
{{ $json.enriched === true }}

// True path: Use enriched data
// False path: Use original data only
```

---

## Scenario 4: Changing Trigger Types

### Example: Webhook → Schedule
**Original**: Webhook Trigger → Process → Action
**Adapted**: Schedule Trigger → Fetch → Process → Action

**Steps**:
1. **Replace Trigger**
   - Remove: Webhook Trigger
   - Add: Schedule Trigger (Cron)
   - Configure: Set schedule (e.g., every hour)

2. **Add Data Fetching Node**
   - Add: HTTP Request or Database node
   - Configure: Fetch new/updated records
   - Filter: Only process items since last run

3. **Add State Management**
   ```javascript
   // Store last run timestamp
   const lastRun = $node["Schedule Trigger"].json.lastRun;
   
   // Filter items
   return items.filter(item => {
     return new Date(item.json.createdAt) > new Date(lastRun);
   });
   ```

4. **Update Processing Logic**
   - Handle multiple items instead of single webhook payload
   - Add loop or batch processing if needed

**Node Structure**:
```
Schedule Trigger → Fetch Data → Filter New Items → Process → Action
```

---

## Scenario 5: Adding Multi-Channel Distribution

### Example: Single Channel → Multi-Channel
**Original**: Event → Slack Notification
**Adapted**: Event → Priority Check → Multi-Channel Notify

**Steps**:
1. **Add Priority Assessment**
   ```javascript
   let priority = 'low';
   
   if ($json.severity === 'critical') priority = 'high';
   else if ($json.severity === 'warning') priority = 'medium';
   
   return {
     ...$json,
     priority: priority,
     channels: priority === 'high' 
       ? ['slack', 'email', 'sms'] 
       : priority === 'medium'
       ? ['slack', 'email']
       : ['slack']
   };
   ```

2. **Add IF Node for Channel Routing**
   - Check which channels to use
   - Route to appropriate nodes

3. **Add Channel-Specific Nodes**
   - Slack: Keep existing node
   - Email: Add email node
   - SMS: Add Twilio node

4. **Format Messages per Channel**
   ```javascript
   // Slack - Rich formatting
   {
     "text": "{{ $json.title }}",
     "blocks": [...]
   }
   
   // Email - HTML template
   {
     "subject": "{{ $json.title }}",
     "html": "<html>...</html>"
   }
   
   // SMS - Plain text, concise
   {
     "body": "{{ $json.title }}: {{ $json.summary }}"
   }
   ```

---

## Scenario 6: Adding Error Handling

### Example: Basic Workflow → Robust Workflow
**Original**: Trigger → Action
**Adapted**: Trigger → Try/Catch → Action → Error Handler

**Steps**:
1. **Wrap Critical Nodes in Error Handling**
   - Enable "Continue On Fail" on nodes
   - Add IF node to check for errors

2. **Add Error Detection**
   ```javascript
   // Check if previous node failed
   const hasFailed = $node["API Call"].json.error !== undefined;
   
   return {
     success: !hasFailed,
     error: hasFailed ? $node["API Call"].json.error : null,
     data: !hasFailed ? $node["API Call"].json : null
   };
   ```

3. **Add Error Notification**
   - Send alert to monitoring channel
   - Log error details
   - Optionally retry

4. **Add Retry Logic**
   ```javascript
   const maxRetries = 3;
   const currentRetry = $json.retryCount || 0;
   
   if (currentRetry < maxRetries) {
     return {
       ...$json,
       retryCount: currentRetry + 1,
       shouldRetry: true
     };
   }
   
   return {
     ...$json,
     shouldRetry: false,
     finalError: true
   };
   ```

**Node Structure**:
```
Trigger → Action (Continue On Fail) → Check Success → Success Path
                                                    → Error Path → Retry Logic
                                                                 → Error Alert
```

---

## Scenario 7: Adding Data Transformation

### Example: Direct Pass-Through → Data Transformation
**Original**: Source → Destination
**Adapted**: Source → Transform → Validate → Destination

**Steps**:
1. **Add Function Node for Transformation**
   ```javascript
   return items.map(item => {
     return {
       // Rename fields
       firstName: item.json.first_name,
       lastName: item.json.last_name,
       
       // Combine fields
       fullName: `${item.json.first_name} ${item.json.last_name}`,
       
       // Format fields
       email: item.json.email.toLowerCase().trim(),
       phone: item.json.phone.replace(/[^0-9]/g, ''),
       
       // Calculate fields
       age: new Date().getFullYear() - new Date(item.json.birthdate).getFullYear(),
       
       // Add metadata
       processedAt: new Date().toISOString(),
       source: 'n8n-workflow'
     };
   });
   ```

2. **Add Validation Node**
   ```javascript
   return items.filter(item => {
     // Validate required fields
     if (!item.json.email || !item.json.firstName) return false;
     
     // Validate email format
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(item.json.email)) return false;
     
     // Validate phone format
     if (item.json.phone && item.json.phone.length < 10) return false;
     
     return true;
   });
   ```

3. **Add Error Collection for Invalid Items**
   - Split valid and invalid items
   - Log invalid items
   - Optionally notify about validation failures

---

## Scenario 8: Adding Batch Processing

### Example: Single Item → Batch Processing
**Original**: Trigger → Process One → Action
**Adapted**: Schedule → Fetch Many → Batch Process → Bulk Action

**Steps**:
1. **Change to Batch Trigger**
   - Use Schedule instead of individual triggers
   - Fetch multiple items at once

2. **Add Batch Processing Logic**
   ```javascript
   const batchSize = 100;
   const batches = [];
   
   for (let i = 0; i < items.length; i += batchSize) {
     batches.push(items.slice(i, i + batchSize));
   }
   
   return batches.map((batch, index) => ({
     json: {
       batchNumber: index + 1,
       totalBatches: batches.length,
       items: batch.map(item => item.json)
     }
   }));
   ```

3. **Add Loop Node**
   - Process each batch sequentially
   - Add delay between batches if needed

4. **Update Action Node for Bulk Operations**
   - Use bulk API endpoints
   - Handle batch responses
   - Collect results

**Rate Limiting**:
```javascript
// Add wait between batches
const delayMs = 1000; // 1 second
await new Promise(resolve => setTimeout(resolve, delayMs));
```

---

## Scenario 9: Adding Deduplication

### Example: Direct Processing → Deduplicated Processing
**Original**: Trigger → Action
**Adapted**: Trigger → Check Duplicates → Action (if new)

**Steps**:
1. **Add Database/Cache Check**
   ```javascript
   // Query database for existing record
   const existingRecord = await $node["Database"].getAll({
     where: {
       email: $json.email
     }
   });
   
   return {
     ...$json,
     isDuplicate: existingRecord.length > 0,
     existingId: existingRecord[0]?.id
   };
   ```

2. **Add IF Node for Duplicate Check**
   - Condition: `{{ $json.isDuplicate === false }}`
   - True: Process new record
   - False: Update existing or skip

3. **Add Update Logic for Duplicates**
   ```javascript
   if ($json.isDuplicate) {
     // Update existing record
     return {
       operation: 'update',
       id: $json.existingId,
       data: $json
     };
   } else {
     // Create new record
     return {
       operation: 'create',
       data: $json
     };
   }
   ```

---

## Scenario 10: Adding Monitoring and Logging

### Example: Basic Workflow → Monitored Workflow
**Original**: Trigger → Action
**Adapted**: Trigger → Log Start → Action → Log Result → Metrics

**Steps**:
1. **Add Logging Nodes**
   ```javascript
   // Log workflow start
   console.log('Workflow started:', {
     workflowId: $workflow.id,
     executionId: $execution.id,
     timestamp: new Date().toISOString(),
     input: $json
   });
   ```

2. **Add Metrics Collection**
   ```javascript
   const startTime = Date.now();
   
   // ... process data ...
   
   const endTime = Date.now();
   const duration = endTime - startTime;
   
   return {
     ...$json,
     metrics: {
       duration: duration,
       itemsProcessed: items.length,
       success: true
     }
   };
   ```

3. **Add Monitoring Dashboard Update**
   - Send metrics to monitoring service
   - Update dashboard
   - Track success/failure rates

4. **Add Alerting for Failures**
   ```javascript
   if ($json.metrics.success === false) {
     // Send alert
     await $node["Slack"].send({
       text: `Workflow failed: ${$json.error}`
     });
   }
   ```

---

## Best Practices for Workflow Adaptation

### 1. Start Small
- Make one change at a time
- Test after each modification
- Don't try to adapt everything at once

### 2. Preserve Core Logic
- Keep the fundamental workflow pattern
- Only change what's necessary
- Document why changes were made

### 3. Use Descriptive Node Names
- Rename nodes to reflect their purpose
- Add notes to complex nodes
- Document custom code

### 4. Handle Errors Gracefully
- Enable "Continue On Fail" where appropriate
- Add error notifications
- Implement retry logic

### 5. Test Thoroughly
- Test with real data
- Test edge cases
- Test error scenarios
- Verify all integrations

### 6. Document Changes
- Keep a changelog
- Document configuration values
- Note any dependencies

### 7. Version Control
- Export workflow JSON regularly
- Keep backups before major changes
- Use descriptive version names

### 8. Optimize Performance
- Minimize API calls
- Use batch operations when possible
- Add caching where appropriate
- Consider rate limits

### 9. Security Considerations
- Use credentials properly
- Don't hardcode sensitive data
- Validate input data
- Sanitize output data

### 10. Maintainability
- Keep workflows simple
- Break complex workflows into sub-workflows
- Use consistent naming conventions
- Add comments and documentation

---

## Quick Reference: Common Node Replacements

### Trigger Nodes
- **Webhook → Schedule**: Add data fetching node
- **Schedule → Webhook**: Remove fetching, expect push data
- **Email → Form**: Change data structure mapping
- **Form → API**: Add authentication and formatting

### Action Nodes
- **Slack → Email**: Adjust message formatting
- **Email → SMS**: Shorten message content
- **Database → Spreadsheet**: Adjust data structure
- **API → Database**: Add data transformation

### Processing Nodes
- **Function → Code**: Adjust syntax (JavaScript → Python)
- **IF → Switch**: Convert binary to multi-way logic
- **Merge → Join**: Adjust merge strategy
- **Split → Item Lists**: Change batch handling

---

## Troubleshooting Common Adaptation Issues

### Issue: Data Structure Mismatch
**Solution**: Add Function node to transform data structure
```javascript
// Transform from source format to destination format
return {
  destinationField1: $json.sourceField1,
  destinationField2: $json.sourceField2,
  // ... map all fields
};
```

### Issue: Authentication Failure
**Solution**: Update credentials and authentication method
- Check API key/token validity
- Verify authentication type (OAuth, API Key, Basic)
- Update credential configuration

### Issue: Rate Limiting
**Solution**: Add delays and batch processing
```javascript
// Add delay between requests
await new Promise(resolve => setTimeout(resolve, 1000));
```

### Issue: Missing Fields
**Solution**: Add default values and validation
```javascript
return {
  ...$json,
  optionalField: $json.optionalField || 'default value'
};
```

### Issue: Workflow Too Complex
**Solution**: Break into sub-workflows
- Create separate workflows for distinct functions
- Use Execute Workflow node to call sub-workflows
- Pass data between workflows via webhook or database

---

## Adaptation Checklist

Before deploying adapted workflow:

- [ ] All integrations configured and tested
- [ ] Credentials properly set up
- [ ] Data transformations validated
- [ ] Error handling implemented
- [ ] Logging and monitoring added
- [ ] Test data processed successfully
- [ ] Edge cases handled
- [ ] Documentation updated
- [ ] Backup of original workflow saved
- [ ] Team notified of changes

---

## Getting Help

When stuck on adaptation:

1. **Check n8n Documentation**: Official docs for node-specific help
2. **Community Forum**: Search for similar use cases
3. **Workflow Templates**: Look for similar adapted workflows
4. **Node Examples**: Review example configurations
5. **Test in Isolation**: Test problematic nodes separately

---

## Next Steps After Adaptation

1. **Monitor Performance**: Track execution times and success rates
2. **Gather Feedback**: Get user input on workflow effectiveness
3. **Iterate**: Make improvements based on real-world usage
4. **Document Learnings**: Share insights with team
5. **Optimize**: Refine workflow for better performance
