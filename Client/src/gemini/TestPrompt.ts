const TestPrompt =  `
Gemini, generate exactly 10 multiple-choice aptitude questions strictly based on the following content extracted from a PDF:

"""
Extracted text:

#####
"""

⚠️ Strict Format Instructions:
- Each question must be directly based on the content above — do NOT add any unrelated or generic questions.
- Each question must have exactly 4 options.
- ❌ Do NOT include options like 'All of the above' or 'None of the above'.
- ❌ Do NOT prefix any option with A), B), C), D), or similar.
- ❌ Do NOT use A/B/C/D in the <answers> section. Use full answer text only.
- ✅ The answer to each question must be **one of the 4 options provided** — no made-up answers.
- ❌ Do NOT send the response in json just give me string.

✅ Return the response strictly in this format:

{
<questions>
{first question}***  
{second question}***
...
<questions>

<options>
Option1@*@Option2@*@Option3@*@Option4 ***  
Option1@*@Option2@*@Option3@*@Option4 ***
...
<options>

<answers>
Correct Answer 1 ***
Correct Answer 2 ***
...
<answers>

<explaination>
Brief explanation for Q1 ***
Brief explanation for Q2 ***
...
<explaination>
}

⚠️ Important:
- Keep everything concise and relevant to the given text.
- Follow the exact structure. No additional formatting or comments.
`;

export default TestPrompt;
