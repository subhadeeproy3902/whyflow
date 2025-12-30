**(Start of Speech)**

---

**(Intro - 0:00 - 2:30)**

"Hi everyone, thanks for having me. My name is Jules, and today I want to walk you through a project I've been working on called **WhyFlow**.

The core problem this project tackles is something I'm sure we've all felt: the absolute pain of debugging complex, multi-step, and often non-deterministic systems. Think about a modern recommendation engine, a fraud detection pipeline, or any system that uses LLMs. When something goes wrong—when the system produces a weird or incorrect output—our traditional tools often fall short. We have logs that tell us *what* happened, and traces that tell us *how long* it took. But the one question they can't answer is the most important one: **WHY?**

Why was *this* product recommended? Why was *this* transaction flagged as fraudulent? Why did the LLM generate *this specific* output? Answering that 'why' today is often a painful process of reverse-engineering, guesswork, and digging through mountains of unstructured logs.

So, I set out to build a better solution. Before writing a single line of code, I spent about 2 to 3 hours just thinking, whiteboarding, and designing the core concepts. The goal wasn't to reinvent logging or tracing, but to create a new layer of observability focused specifically on **decision reasoning**. The result of that thinking is WhyFlow, an X-Ray library and dashboard for your decision-making pipelines."

---

**(The Core Idea - 2:30 - 5:30)**

"The fundamental difference between WhyFlow and traditional tracing tools like Jaeger or Zipkin is the question it answers. Tracing answers, 'What functions were called and how long did they take?' It's focused on performance and the operational flow of a system.

WhyFlow answers, **'Why did the system make this specific decision?'** It’s focused on the business logic, the inputs, the outputs, and the reasoning at each step of a workflow.

Let's use the competitor selection example from the assignment. If a bad competitor is chosen, a traditional trace might show you that five different microservices were called. That's useful, but it doesn't tell you if the problem was bad search keywords, overly strict filters, or a flawed ranking algorithm. You're still left guessing.

WhyFlow, on the other hand, is designed to capture the rich, business-level context of the decision itself. It records the candidates, the filters that were applied, the reason a specific item was filtered out, and the logic behind the final selection. It turns the 'black box' of your decision pipeline into a transparent, step-by-step narrative that any developer, or even a product manager, can understand. This is the core idea: to elevate observability from the machine level to the logic level."

---

**(SDK Deep Dive - 5:30 - 11:30)**

"Now, let's dive into the code and the architecture. The entire system is built on a very simple but powerful core concept. I'll start with the SDK, specifically the data model defined in `packages/core/src/types.ts`.

There are two key interfaces: `DecisionExecution` and `DecisionStep`.

`DecisionExecution` is the top-level container. It represents a single, end-to-end run of your workflow. It has a unique ID, a name, and a timestamp—the basic metadata you need to find and identify a specific run.

The real heart of the system is the `DecisionStep`. This is the atomic unit of observability in WhyFlow. Each step has a few key fields: `name`, `input`, `output`, and `rationale`. `Input` and `output` are self-explanatory—they show what data went into a step and what came out.

But the most important field here is `rationale`. This was a very deliberate design choice. The `rationale` is a string field where the developer explicitly states the 'why' for that step. For example, 'Fetched top 50 results by relevance' or 'Extracted key product attributes using GPT-4.' By making this a first-class citizen of the data model, it forces the developer to think about and document the reasoning behind their code, right where the decision is being made.

Now, you might have noticed the `[key: string]: unknown;` in the `DecisionStep` interface. This was another critical design decision. **WHY did I do this?** Because I knew that a rigid, one-size-fits-all schema would never work. A step that filters candidates has fundamentally different data to capture than a step that generates text with an LLM. The filtering step needs to show you the filter criteria and which candidates passed or failed. The LLM step needs to show you the prompt template. By allowing arbitrary keys, the SDK becomes incredibly flexible and truly general-purpose. Developers can add any custom data that is relevant to their specific domain without me having to change the core library.

With this data model in mind, the integration API in `packages/core/src/execution.ts` was designed to be as simple as possible. It's a single `Execution` class. You instantiate it with `new Execution("My Workflow Name")`, you add steps with `execution.addStep({...})`, and you get the final data with `execution.toJSON()`.

**WHY this simple class-based approach?** My goal was to make integration frictionless. It's lightweight, has zero dependencies, and the developer API is intuitive. There's no complex setup or configuration. You can drop it into any part of your codebase and start capturing decision context in minutes. This simplicity was paramount."

---

**(Demo Walkthrough - 11:30 - 17:30)**

"Okay, so that's the theory. Let's see it in practice. Here's the demo application. It's a simple Next.js app that visualizes a WhyFlow execution for the 'Competitor Product Selection' use case.

When I click 'Run Interactive Demo,' the frontend hits an API route that uses the WhyFlow SDK to generate execution data and then renders it.

On the left, we have the high-level workflow view. You can see the five distinct steps of our pipeline: Keyword Generation, Candidate Search, Apply Filters, LLM Relevance Evaluation, and finally, Rank and Select. This view is crucial for quickly getting an overview of the entire process and jumping to a specific step.

Now, let's look at the details on the right. I'll select the first step, **'Keyword Generation.'** We can see the input—the product title and category. We see the output—the keywords generated by our mock LLM. And we see the rationale: 'Extracted key product attributes.' It's simple, but it's crystal clear what happened.

Let's jump to the most interesting step: **'Apply Filters.'** This is where WhyFlow really shines. In the details, we're not just seeing the input and output counts. We see the *exact* filter rules that were applied: the price range, the minimum rating, and the minimum review count.

And here’s the most powerful part: the `evaluations` data. For each and every candidate product, we have a detailed breakdown of which filters it passed or failed, and why. I can see immediately that the 'Generic Water Bottle' failed because its price of $8.99 was below the minimum, its rating was too low, and it didn't have enough reviews. The 'Bottle Cleaning Brush Set' failed on price but passed on rating and reviews. This is the kind of granular detail that completely eliminates guesswork during debugging. It tells you the 'why' at the micro-level for every single data point.

I'll quickly step through the rest. **'LLM Relevance Evaluation'** is similar—it shows how a mock LLM was used to weed out accessories, and we can see the `is_competitor` flag for each item. Finally, **'Rank and Select'** shows the ranking criteria, the scored and ranked list of candidates, and a clear rationale for why the 'HydroFlask' was chosen as the final competitor.

This entire UI is dynamically generated from the JSON output of the SDK. The combination of the high-level workflow graph and the detailed, reason-oriented data in each step provides a complete, easy-to-digest story of the decision-making process."

---

**(Trade-offs & Future Improvements - 17:30 - 19:30)**

"Of course, this is a take-home project, and I had to make some trade-offs. Given more time, there are a few things I'd improve.

First, **Data Persistence**. Right now, the execution data is generated on-demand and exists only in the browser's state. In a real-world system, the SDK would need a configurable 'transport' layer to send this JSON data to a persistent backend—maybe an Elasticsearch cluster or a Postgres database. This would enable historical analysis, searching across thousands of executions, and building aggregate metrics.

Second, **Dashboard Features**. The current dashboard is great for viewing a single trace. The next step would be to build a homepage for searching and filtering past executions. I'd also love to add a 'diff' view, where you could compare two executions side-by-side to understand why a code change led to a different outcome.

Finally, **SDK Typing**. I opted for `unknown` in the data structures to maximize flexibility. For larger teams, I might introduce a more advanced implementation using generics, like `DecisionStep<TInput, TOutput>`, to provide better static type-checking and improve the developer experience during integration. It's a trade-off between flexibility and type safety."

---

**(Conclusion - 19:30 - 20:00)**

"So, to wrap up, WhyFlow is my answer to the growing challenge of debugging complex, logic-driven systems. By focusing on capturing the 'why'—not just the 'what'—it provides a level of transparency that traditional tools lack. It turns debugging from a frustrating exercise in guesswork into a straightforward process of reading a clear, contextual story of how a decision was made.

Thank you for your time. I'm happy to answer any questions you might have."

---
**(End of Speech)**