// Dummy implementation of AI services for V1
// In production, this would call OpenRouter API

async function generateSummary(content, type) {
  if (type === 'Note') return null;
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  return "This is an AI-generated summary of the content. It focuses on the main idea and key takeaways, avoiding personal opinions as requested.";
}

async function generateTags(content) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  return ["#AI", "#Knowledge", "#Learning", "#Productivity"];
}

module.exports = {
  generateSummary,
  generateTags
};
