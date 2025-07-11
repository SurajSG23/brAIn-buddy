const PodcastPrompt = `
You will receive extracted text from a PDF, enclosed within <text>...</text> tags.

Your task:
- Summarize the important points from the provided text in the form of a **podcast-style conversation** between two speakers: a male and a female.
- Return the result as a **JSON array of objects**.
- Each object in the array must follow this structure:
  {
    "speaker": "male" or "female",
    "text": "What the speaker says."
  }

- Important: **Return the entire JSON array as a string.**
- Your response should contain **only the JSON stringified array**, nothing else — no greetings, comments, or explanations.

Guidelines for the conversation:
- Alternate turns between the male and female speakers.
- The conversation must be casual, natural, and based **only** on the content between <text>...</text>.
- Paraphrase clearly but do not add new information or go outside the content.
- Cover all key topics, features, and ideas mentioned in the text.
- Include at least **10 exchanges** (minimum 5 from each speaker).
- Ensure the flow makes sense and progresses logically, like a real podcast.

Example output:
[
  { "speaker": "male", "text": "First male line..." },
  { "speaker": "female", "text": "First female line..." },
  ...
]

Input PDF content will be inside <text></text>.

Only use the text between the tags. Do not reference the tags or the fact that it's a PDF. 
Do not say things like “based on the PDF” — just deliver the conversation.

<text>###</text>
`;

export default PodcastPrompt;
