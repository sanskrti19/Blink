const COLORS = [
  "#6366F1",  
  "#10B981",  
  "#F59E0B", 
  "#EC4899",  
  "#3B82F6", 
  "#8B5CF6",  
  "#F43F5E",  
];
 
export const getTagColor = (tagName) => {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
};

 
export const categorizeBookmark = (url, title = "") => {
  const lowerUrl = url.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (
    lowerUrl.includes("linkedin") ||
    lowerUrl.includes("notion") ||
    lowerUrl.includes("zoom") ||
    lowerUrl.includes("slack") ||
    lowerUrl.includes("microsoft") ||
    lowerUrl.includes("jira") ||
    lowerUrl.includes("confluence")
  ) return "Work";

  if (
    lowerUrl.includes("udemy") ||
    lowerUrl.includes("coursera") ||
    lowerUrl.includes("khanacademy") ||
    lowerUrl.includes("edx") ||
    lowerUrl.includes("wikipedia") ||
    lowerTitle.includes("learn") ||
    lowerTitle.includes("tutorial")
  ) return "Education";

  if (
    lowerUrl.includes("youtube") ||
    lowerUrl.includes("netflix") ||
    lowerUrl.includes("spotify") ||
    lowerUrl.includes("primevideo") ||
    lowerUrl.includes("hulu") ||
    lowerUrl.includes("hotstar")
  ) return "Movies / Entertainment";

  if (
    lowerUrl.includes("github") ||
    lowerUrl.includes("gitlab") ||
    lowerUrl.includes("stack") ||
    lowerUrl.includes("dev.to") ||
    lowerUrl.includes("vercel") ||
    lowerUrl.includes("react")
  ) return "Development";

  if (
    lowerUrl.includes("twitter") ||
    lowerUrl.includes("x.com") ||
    lowerUrl.includes("instagram") ||
    lowerUrl.includes("facebook") ||
    lowerUrl.includes("reddit") ||
    lowerUrl.includes("pinterest")
  ) return "Social";

  if (
    lowerUrl.includes("amazon") ||
    lowerUrl.includes("ebay") ||
    lowerUrl.includes("flipkart") ||
    lowerUrl.includes("shopify")
  ) return "Shopping";

  return "Uncategorized";
};
