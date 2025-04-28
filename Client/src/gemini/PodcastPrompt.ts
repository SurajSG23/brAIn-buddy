const PodcastPrompt = `
You will receive extracted text from a PDF, enclosed within <text>...</text> tags.

Your task:
- Summarize the important ideas from the provided text by creating a podcast-style conversation between two speakers: one male and one female.
- Return a JSON object structured like:
  {
    "male": "First line spoken by male...",
    "female": "Response from female...",
    "male": "Next male speaker line...",
    "female": "Next female speaker line...",
    ...
  }
- Important: **Return the JSON as a string**, not as a raw object.
- The response must contain **only** the JSON object — **no additional text, no explanations, no greetings** — just the {}.

Guidelines for the conversation:
- The conversation must be entirely based on the provided PDF text inside <text>...</text>.
- Do not introduce any random or unrelated topics.
- Cover all key points, sections, and important ideas mentioned in the PDF.
- Paraphrase naturally as if speaking, but remain true to the original content.
- Alternate turns between the male and female speakers.
- Make the conversation casual, clear, and easy to follow.
- Ensure the podcast has **at least 10 exchanges** (minimum 5 male and 5 female speaking turns).
- Maintain logical flow, explaining the ideas progressively.

- Use only the content provided between <text>###</text> to base the conversation.

Output format:
- Strictly follow the given JSON structure.
- **Return the entire JSON as a string and only the object itself.**
`;
export default PodcastPrompt;
