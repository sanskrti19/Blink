export const categorizeBookmark = (url, title = "") => {
  const combined = (url + " " + title).toLowerCase();

  if (/linkedin|notion|zoom|slack|microsoft|jira|confluence/.test(combined)) return "Work";
  if (/udemy|coursera|khanacademy|edx|wikipedia|learn|tutorial/.test(combined)) return "Education";
  if (/youtube|netflix|spotify|primevideo|hulu|hotstar/.test(combined)) return "Movies / Entertainment";
  if (/github|gitlab|stack|dev\.to|vercel|react/.test(combined)) return "Development";
  if (/twitter|x\.com|instagram|facebook|reddit|pinterest/.test(combined)) return "Social";
  if (/amazon|ebay|flipkart|shopify/.test(combined)) return "Shopping";

  return "Uncategorized";
};
