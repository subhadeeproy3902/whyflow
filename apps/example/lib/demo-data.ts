import { Execution, type DecisionExecution } from "@whyflow/core";

export function generateCompetitorSelectionExecution(): DecisionExecution {
  const execution = new Execution(
    "Competitor Product Selection",
    "exec_demo_001"
  );

  execution.addStep({
    name: "Keyword Generation",
    input: {
      product_title: "Stainless Steel Water Bottle 32oz Insulated",
      category: "Sports & Outdoors",
    },
    output: {
      keywords: [
        "stainless steel water bottle insulated",
        "vacuum insulated bottle 32oz",
      ],
      model: "gpt-4",
    },
    rationale:
      "Extracted key product attributes: material (stainless steel), capacity (32oz), feature (insulated)",
    metadata: {
      step_type: "llm_generation",
    },
  });

  execution.addStep({
    name: "Candidate Search",
    input: {
      keyword: "stainless steel water bottle insulated",
      limit: 50,
    },
    output: {
      total_results: 2847,
      candidates_fetched: 50,
      candidates: [
        {
          asin: "B0COMP01",
          title: "HydroFlask 32oz Wide Mouth",
          price: 44.99,
          rating: 4.5,
          reviews: 8932,
        },
        {
          asin: "B0COMP02",
          title: "Yeti Rambler 26oz",
          price: 34.99,
          rating: 4.4,
          reviews: 5621,
        },
        {
          asin: "B0COMP03",
          title: "Generic Water Bottle",
          price: 8.99,
          rating: 3.2,
          reviews: 45,
        },
        {
          asin: "B0COMP04",
          title: "Bottle Cleaning Brush Set",
          price: 12.99,
          rating: 4.6,
          reviews: 3421,
        },
        {
          asin: "B0COMP05",
          title: "Replacement Lid for HydroFlask",
          price: 9.99,
          rating: 4.1,
          reviews: 892,
        },
        {
          asin: "B0COMP06",
          title: "Water Bottle Carrier Bag with Strap",
          price: 15.99,
          rating: 4.3,
          reviews: 654,
        },
        {
          asin: "B0COMP07",
          title: "Stanley Adventure Quencher 30oz",
          price: 35.0,
          rating: 4.3,
          reviews: 4102,
        },
        {
          asin: "B0COMP08",
          title: "Contigo AutoSeal Travel Mug",
          price: 22.99,
          rating: 4.2,
          reviews: 3245,
        },
      ],
    },
    rationale: "Fetched top 50 results by relevance; 2847 total matches found",
    metadata: {
      step_type: "api_search",
      search_provider: "mock_amazon_api",
    },
  });

  execution.addStep({
    name: "Apply Filters",
    input: {
      candidates_count: 50,
      reference_product: {
        asin: "B0XYZ123",
        title: "ProBrand Steel Bottle 32oz Insulated",
        price: 29.99,
        rating: 4.2,
        reviews: 1247,
      },
    },
    filters_applied: {
      price_range: {
        min: 14.99,
        max: 59.98,
        rule: "0.5x - 2x of reference price",
      },
      min_rating: { value: 3.8, rule: "Must be at least 3.8 stars" },
      min_reviews: { value: 100, rule: "Must have at least 100 reviews" },
    },
    evaluations: [
      {
        asin: "B0COMP01",
        title: "HydroFlask 32oz Wide Mouth",
        metrics: { price: 44.99, rating: 4.5, reviews: 8932 },
        filter_results: {
          price_range: {
            passed: true,
            detail: "$44.99 is within $14.99-$59.98",
          },
          min_rating: { passed: true, detail: "4.5 >= 3.8" },
          min_reviews: { passed: true, detail: "8932 >= 100" },
        },
        qualified: true,
      },
      {
        asin: "B0COMP02",
        title: "Yeti Rambler 26oz",
        metrics: { price: 34.99, rating: 4.4, reviews: 5621 },
        filter_results: {
          price_range: {
            passed: true,
            detail: "$34.99 is within $14.99-$59.98",
          },
          min_rating: { passed: true, detail: "4.4 >= 3.8" },
          min_reviews: { passed: true, detail: "5621 >= 100" },
        },
        qualified: true,
      },
      {
        asin: "B0COMP03",
        title: "Generic Water Bottle",
        metrics: { price: 8.99, rating: 3.2, reviews: 45 },
        filter_results: {
          price_range: {
            passed: false,
            detail: "$8.99 is below minimum $14.99",
          },
          min_rating: { passed: false, detail: "3.2 < 3.8 threshold" },
          min_reviews: { passed: false, detail: "45 < 100 minimum" },
        },
        qualified: false,
      },
      {
        asin: "B0COMP04",
        title: "Bottle Cleaning Brush Set",
        metrics: { price: 12.99, rating: 4.6, reviews: 3421 },
        filter_results: {
          price_range: {
            passed: false,
            detail: "$12.99 is below minimum $14.99",
          },
          min_rating: { passed: true, detail: "4.6 >= 3.8" },
          min_reviews: { passed: true, detail: "3421 >= 100" },
        },
        qualified: false,
      },
    ],
    output: {
      total_evaluated: 50,
      passed: 12,
      failed: 38,
      qualified_products: [
        {
          asin: "B0COMP01",
          title: "HydroFlask 32oz Wide Mouth",
          price: 44.99,
          rating: 4.5,
          reviews: 8932,
        },
        {
          asin: "B0COMP02",
          title: "Yeti Rambler 26oz",
          price: 34.99,
          rating: 4.4,
          reviews: 5621,
        },
        {
          asin: "B0COMP07",
          title: "Stanley Adventure Quencher 30oz",
          price: 35.0,
          rating: 4.3,
          reviews: 4102,
        },
        {
          asin: "B0COMP08",
          title: "Contigo AutoSeal Travel Mug",
          price: 22.99,
          rating: 4.2,
          reviews: 3245,
        },
      ],
    },
    rationale:
      "Applied price, rating, and review count filters to narrow candidates from 50 to 12",
    metadata: {
      step_type: "filter",
    },
  });

  execution.addStep({
    name: "LLM Relevance Evaluation",
    input: {
      candidates_count: 12,
      reference_product: {
        asin: "B0XYZ123",
        title: "ProBrand Steel Bottle 32oz Insulated",
        category: "Sports & Outdoors > Water Bottles",
      },
      model: "gpt-4",
    },
    prompt_template:
      "Given the reference product '{title}', determine if each candidate is a true competitor (same product type) or a false positive (accessory, replacement part, bundle, etc.)",
    evaluations: [
      {
        asin: "B0COMP01",
        title: "HydroFlask 32oz Wide Mouth",
        is_competitor: true,
        confidence: 0.95,
      },
      {
        asin: "B0COMP02",
        title: "Yeti Rambler 26oz",
        is_competitor: true,
        confidence: 0.92,
      },
      {
        asin: "B0COMP05",
        title: "Replacement Lid for HydroFlask",
        is_competitor: false,
        confidence: 0.98,
      },
      {
        asin: "B0COMP06",
        title: "Water Bottle Carrier Bag with Strap",
        is_competitor: false,
        confidence: 0.97,
      },
      {
        asin: "B0COMP07",
        title: "Stanley Adventure Quencher 30oz",
        is_competitor: true,
        confidence: 0.89,
      },
      {
        asin: "B0COMP08",
        title: "Contigo AutoSeal Travel Mug",
        is_competitor: true,
        confidence: 0.85,
      },
    ],
    output: {
      total_evaluated: 12,
      confirmed_competitors: 8,
      false_positives_removed: 4,
      qualified_competitors: [
        {
          asin: "B0COMP01",
          title: "HydroFlask 32oz Wide Mouth",
          is_competitor: true,
          confidence: 0.95,
        },
        {
          asin: "B0COMP02",
          title: "Yeti Rambler 26oz",
          is_competitor: true,
          confidence: 0.92,
        },
        {
          asin: "B0COMP07",
          title: "Stanley Adventure Quencher 30oz",
          is_competitor: true,
          confidence: 0.89,
        },
        {
          asin: "B0COMP08",
          title: "Contigo AutoSeal Travel Mug",
          is_competitor: true,
          confidence: 0.85,
        },
      ],
    },
    rationale:
      "LLM identified and removed 4 false positives (accessories and replacement parts)",
    metadata: {
      step_type: "llm_evaluation",
    },
  });

  execution.addStep({
    name: "Rank and Select",
    input: {
      candidates_count: 8,
      reference_product: {
        asin: "B0XYZ123",
        title: "ProBrand Steel Bottle 32oz Insulated",
        price: 29.99,
        rating: 4.2,
        reviews: 1247,
      },
    },
    ranking_criteria: {
      primary: "review_count",
      secondary: "rating",
      tertiary: "price_proximity",
    },
    ranked_candidates: [
      {
        rank: 1,
        asin: "B0COMP01",
        title: "HydroFlask 32oz Wide Mouth",
        metrics: { price: 44.99, rating: 4.5, reviews: 8932 },
        score_breakdown: {
          review_count_score: 1.0,
          rating_score: 0.9,
          price_proximity_score: 0.7,
        },
        total_score: 0.92,
      },
      {
        rank: 2,
        asin: "B0COMP02",
        title: "Yeti Rambler 26oz",
        metrics: { price: 34.99, rating: 4.4, reviews: 5621 },
        score_breakdown: {
          review_count_score: 0.63,
          rating_score: 0.85,
          price_proximity_score: 0.85,
        },
        total_score: 0.74,
      },
      {
        rank: 3,
        asin: "B0COMP07",
        title: "Stanley Adventure Quencher",
        metrics: { price: 35.0, rating: 4.3, reviews: 4102 },
        score_breakdown: {
          review_count_score: 0.46,
          rating_score: 0.8,
          price_proximity_score: 0.84,
        },
        total_score: 0.65,
      },
    ],
    output: {
      selected_competitor: {
        asin: "B0COMP01",
        title: "HydroFlask 32oz Wide Mouth",
        price: 44.99,
        rating: 4.5,
        reviews: 8932,
      },
    },
    rationale:
      "Highest overall score (0.92) - top review count (8,932) with strong rating (4.5★)",
    metadata: {
      step_type: "ranking",
      selection_reason:
        "Selected based on highest total score combining review count, rating, and price proximity",
    },
  });

  return execution.toJSON();
}
