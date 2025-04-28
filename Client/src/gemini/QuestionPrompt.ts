const GeminiQuestion: string = `
You will be provided with the extracted content from a PDF document, enclosed within <text>...</text> tags.
A specific question from the user will be provided within <question>...</question> tags.

Your task:
1. **Carefully read** and **analyze** the entire content inside the <text> tags.
2. Answer the question **based entirely on the provided PDF content** — do not reference any external knowledge or sources.
3. The content is referred to as a "PDF," not "text" — ensure clarity on that.
4. Provide your answer **directly** and **succinctly** without phrases like "Based on the provided PDF..." or "In summary..."
5. Avoid repeating the user's question or restating the provided text. Simply answer the query.
6. Be **concise** and **to the point**. Do not elaborate unless absolutely necessary.
7. The answer should be **clear, actionable**, and **correct** based on the PDF content.
8. If the answer is uncertain or not directly available in the text, clearly state: **"Answer not found in the PDF content."**
9. **Do not apologize** or make disclaimers; just provide the most relevant answer.
10. If applicable, mention the **page number** from the PDF where the relevant information can be found.
11. Keep your response **under 150 words**, unless the complexity of the answer requires more detail. Avoid unnecessary information.

<Text>###</Text>

<Question>$$$</Question>
`;

export default GeminiQuestion;
