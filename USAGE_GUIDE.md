# WhyFlow Usage Guide

## 🎯 What is WhyFlow?

WhyFlow is a **decision observability system** that helps you understand WHY your multi-step systems produce specific outcomes.

Unlike logging (which shows what happened) or tracing (which shows what functions were called), WhyFlow captures the **decision reasoning** at each step of your pipeline.

## 🚀 Quick Start

### 1. Start the Demo Dashboard

```bash
cd /path/to/whyflow
pnpm install
pnpm dev --filter example
```

Open **http://localhost:3001** in your browser.

### 2. Explore the Demo

The dashboard shows a **5-step competitor product selection pipeline**:

1. **Keyword Generation** - LLM generates search keywords from product description
2. **Candidate Search** - API retrieves 50 candidates from 2,847 results  
3. **Apply Filters** - Rules filter by price ($14.99-$59.98), rating (≥3.8★), reviews (≥100)
4. **LLM Relevance Evaluation** - AI removes accessories/parts (4 false positives eliminated)
5. **Rank and Select** - Algorithm selects HydroFlask based on review count (8,932 reviews)

### 3. Navigate the UI

**Left Sidebar:**
- Execution name and timestamp
- List of all 5 decision steps
- Click any step to view details

**Main Panel:**
- **Rationale** (top, highlighted) - WHY the decision was made
- **Input/Output** (two columns) - Data flow through the step
- **Additional Data** (cards below) - Detailed evaluations, filters, rankings

## 📊 Understanding the Data

### Example: Step 3 - Apply Filters

Click on "Apply Filters" step and you'll see:

**Rationale:**
> "Applied price, rating, and review count filters to narrow candidates from 50 to 12"

**Filters Applied:**
```json
{
  "price_range": { "min": 14.99, "max": 59.98, "rule": "0.5x - 2x of reference price" },
  "min_rating": { "value": 3.8, "rule": "Must be at least 3.8 stars" },
  "min_reviews": { "value": 100, "rule": "Must have at least 100 reviews" }
}
```

**Evaluations (showing why each product passed/failed):**
```json
{
  "asin": "B0COMP03",
  "title": "Generic Water Bottle",
  "metrics": { "price": 8.99, "rating": 3.2, "reviews": 45 },
  "filter_results": {
    "price_range": { "passed": false, "detail": "$8.99 is below minimum $14.99" },
    "min_rating": { "passed": false, "detail": "3.2 < 3.8 threshold" },
    "min_reviews": { "passed": false, "detail": "45 < 100 minimum" }
  },
  "qualified": false
}
```

**This tells you EXACTLY why "Generic Water Bottle" was eliminated.**

## 🔧 Integrating WhyFlow Into Your Code

### Install the SDK

```bash
pnpm add @whyflow/core
```

### Basic Integration

```typescript
import { Execution } from "@whyflow/core";

function myDecisionPipeline(productId: string) {
  // Create an execution to track this pipeline run
  const execution = new Execution(
    "Product Recommendation Pipeline",
    `exec_${productId}`
  );

  // Step 1: Fetch candidates
  const candidates = fetchCandidates(productId);
  execution.addStep({
    name: "Fetch Candidates",
    input: { productId },
    output: { candidatesFound: candidates.length },
    rationale: `Retrieved ${candidates.length} candidate products from database`,
  });

  // Step 2: Apply business rules
  const filtered = candidates.filter(c => c.price > 10 && c.rating >= 4.0);
  execution.addStep({
    name: "Apply Business Rules",
    input: { candidates: candidates.length },
    output: { qualified: filtered.length, rejected: candidates.length - filtered.length },
    filters_applied: {
      min_price: { value: 10, rule: "Price must be above $10" },
      min_rating: { value: 4.0, rule: "Rating must be 4.0 or higher" },
    },
    evaluations: candidates.map(c => ({
      id: c.id,
      price: c.price,
      rating: c.rating,
      passed: c.price > 10 && c.rating >= 4.0,
    })),
    rationale: `Filtered to ${filtered.length} products meeting minimum price and rating`,
  });

  // Step 3: Select best
  const selected = filtered.sort((a, b) => b.rating - a.rating)[0];
  execution.addStep({
    name: "Select Best",
    input: { candidates: filtered.length },
    output: { selected: selected.id },
    ranking_criteria: { primary: "rating", secondary: "price" },
    rationale: `Selected product ${selected.id} with highest rating (${selected.rating})`,
  });

  // Return both the result and the decision trail
  return {
    recommendation: selected,
    execution: execution.toJSON(), // ← This is the decision trail
  };
}
```

### What to Capture

**DO capture:**
- ✅ Filters applied and thresholds used
- ✅ Individual evaluations showing pass/fail
- ✅ Ranking criteria and scores
- ✅ Selection reasoning
- ✅ Number of items at each stage

**DON'T capture:**
- ❌ Internal function calls
- ❌ Database queries
- ❌ API response times
- ❌ Implementation details

**Focus on BUSINESS LOGIC, not technical implementation.**

## 🧪 Testing Your Integration

### 1. Run Your Pipeline

```typescript
const result = myDecisionPipeline("product_123");
console.log(JSON.stringify(result.execution, null, 2));
```

### 2. Verify the Output

Check that the execution JSON has:
- Clear step names
- Rationale explaining each decision
- Input/output data for each step
- Detailed data (filters, evaluations, rankings) where relevant

### 3. Ask Yourself

- Can I understand WHY the decision was made just by reading?
- If something goes wrong, can I find which step failed?
- Are the rationales clear enough for a junior engineer?

## 🐛 Debugging with WhyFlow

### Scenario: Wrong Product Selected

**Problem:** Your pipeline selected product B, but product A was the correct choice.

**Debugging steps:**

1. **Load the execution** for that specific run
2. **Start at the final step** (Selection)
   - Check the ranking criteria
   - Look at the scores for both A and B
   - Verify B actually scored higher according to the rules

3. **If B scored higher but shouldn't have:**
   - The ranking criteria might be wrong
   - Fix: Adjust the weight of different factors

4. **If A wasn't in the final candidates:**
   - Go back to the previous step (Filtering)
   - Look at the evaluations array
   - Find product A and see why it was rejected
   - Check if the filter thresholds are too strict

5. **If A wasn't in the search results:**
   - Go to the search step
   - Check the keywords generated
   - Verify the search query was correct

**The key: You can trace backwards through the decision trail to find exactly where it went wrong.**

## 📈 Advanced Usage

### Custom Step Fields

You can add any fields to a step:

```typescript
execution.addStep({
  name: "LLM Evaluation",
  input: { candidates: 50 },
  output: { relevant: 35, irrelevant: 15 },
  rationale: "LLM identified and removed 15 irrelevant items",
  
  // Custom fields specific to this step type
  prompt_template: "Is this product relevant to: {query}?",
  model: "gpt-4",
  confidence_threshold: 0.8,
  evaluations: candidates.map(c => ({
    id: c.id,
    is_relevant: c.llmScore > 0.8,
    confidence: c.llmScore,
  })),
});
```

### Storing Executions

```typescript
// In a database
await db.executions.insert({
  id: execution.executionId,
  data: execution.toJSON(),
  timestamp: new Date(),
});

// In a file
import fs from 'fs';
fs.writeFileSync(
  `executions/${execution.executionId}.json`,
  JSON.stringify(execution.toJSON(), null, 2)
);

// To an API
await fetch('/api/executions', {
  method: 'POST',
  body: JSON.stringify(execution.toJSON()),
});
```

## 🎓 Key Concepts to Remember

### 1. Decision Observability vs. Logging vs. Tracing

| Tool | Question Answered | Use Case |
|------|------------------|----------|
| **Logging** | "What happened?" | General debugging, errors |
| **Tracing** | "What functions were called and how long did they take?" | Performance debugging, service flow |
| **WhyFlow** | "Why did the system make this decision?" | Business logic debugging, decision pipelines |

### 2. What Makes a Good Decision Step?

A decision step should represent a **meaningful choice**, not a function call.

**Bad:**
```typescript
execution.addStep({
  name: "Call Database",
  rationale: "Fetched data from PostgreSQL"
});
```

**Good:**
```typescript
execution.addStep({
  name: "Filter by Availability",
  input: { products: 100 },
  output: { available: 67, outOfStock: 33 },
  rationale: "Excluded 33 out-of-stock products to show only available items",
  filters_applied: {
    stock_status: { value: "in_stock", rule: "Only show available products" }
  }
});
```

### 3. Rationale is Everything

The `rationale` should be so clear that anyone can understand the decision without looking at code.

**Bad:** "Processed items"
**Good:** "Eliminated 15 products below $20 minimum price threshold"

**Bad:** "Ranked results"
**Good:** "Ranked 35 products by review count (primary) and rating (secondary), selected top 10"

## 📚 Documentation

- **Introduction** - `/apps/docs/content/docs/introduction.mdx`
- **Core Concepts** - `/apps/docs/content/docs/core-concepts.mdx`
- **Getting Started** - `/apps/docs/content/docs/getting-started.mdx`
- **Data Model** - `/apps/docs/content/docs/data-model.mdx`
- **Dashboard Guide** - `/apps/docs/content/docs/dashboard.mdx`

Run the docs site:
```bash
pnpm dev --filter docs
```

## ✅ Success Checklist

You're using WhyFlow correctly if:

- [ ] Each step has a clear, business-focused name
- [ ] Rationales explain WHY, not WHAT
- [ ] You can debug issues by reading the execution JSON
- [ ] Filter/evaluation details show pass/fail for individual items
- [ ] Rankings show score breakdowns
- [ ] A non-technical person can understand the decision flow

## 💡 Pro Tips

1. **Start with 3-5 steps** - Don't try to capture everything at once
2. **Focus on the critical path** - Where do bugs usually happen?
3. **Make rationales actionable** - "35 items failed X filter" not "filtering complete"
4. **Capture numbers** - How many in, how many out, how many passed/failed
5. **Think like a debugger** - What would you want to see when something breaks?

## 🆘 Common Issues

### "My execution is too big"

- You're capturing too much data in `input`/`output`
- Move detailed evaluations to custom fields or metadata
- Limit array sizes (e.g., top 10 instead of all 1000)

### "Steps aren't granular enough"

- Break compound steps into multiple steps
- Example: "Filter and Rank" → "Apply Filters" + "Rank Results"

### "I don't know what to put in rationale"

Ask yourself: "If this step produced the wrong result, what would I need to know to fix it?"
That's your rationale.

## 🚀 Next Steps

1. ✅ Explore the demo dashboard (http://localhost:3001)
2. ✅ Read through all 5 steps and their data
3. ✅ Try to find where "Generic Water Bottle" was eliminated
4. ✅ Understand why HydroFlask was selected
5. ✅ Integrate `@whyflow/core` into your own pipeline
6. ✅ Build a simple dashboard or logging system for your executions

**You're ready to bring decision observability to your systems!**
