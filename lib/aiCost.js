// lib/aiCost.js
const DEFAULT_PRICING = {
  "gpt-4o-mini": 0.0015,
  "gpt-3.5-turbo": 0.002
};

export function getModelPricing() {
  try {
    const raw = process.env.MODEL_PRICING;
    if (raw) return { ...DEFAULT_PRICING, ...JSON.parse(raw) };
  } catch (e) {
    console.warn("MODEL_PRICING parse failed", e.message);
  }
  return DEFAULT_PRICING;
}

export function estimateCost(usageObj, model = "gpt-4o-mini") {
  const pricing = getModelPricing();
  const pricePer1k = pricing[model] || pricing["gpt-4o-mini"];
  const tokens = usageObj ? (usageObj.total_tokens ?? ((usageObj.prompt_tokens ?? 0) + (usageObj.completion_tokens ?? 0))) : 0;
  const cost = (tokens / 1000) * pricePer1k;
  return { cost, breakdown: { pricePer1k, tokens, cost } };
}
