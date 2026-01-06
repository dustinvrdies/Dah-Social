/**
 * Scam detection heuristics for DAH Social
 */

export function analyzePostRisk(content: string): "low" | "medium" | "high" {
  const text = content.toLowerCase();
  
  const highRiskKeywords = [
    "guaranteed", "investment", "whatsapp", "telegram", 
    "crypto", "bitcoin", "dm me for details", "get rich"
  ];
  
  const matches = highRiskKeywords.filter(keyword => text.includes(keyword));
  
  if (matches.length >= 3) return "high";
  if (matches.length >= 1) return "medium";
  return "low";
}

export function validateListing(price: number, category: string): boolean {
  // Flag suspicious pricing (e.g. $1 for high-end electronics)
  if (category === "electronics" && price < 50) return false;
  return true;
}
