// code-review.js

import fs from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  let diffContent = fs.readFileSync('diff.txt', 'utf8');

  // Truncate the diff if it's too long (adjust maxTokens as needed)
  const maxTokens = 4000; // Adjust based on model's token limit
  const maxChars = maxTokens * 4; // Approximate conversion to characters
  if (diffContent.length > maxChars) {
    diffContent = diffContent.substring(0, maxChars) + '\n[Diff truncated due to length]';
  }

  const messages = [
    {
      role: "user",
      content: `Please review the following code changes and provide constructive feedback:\n\n${diffContent}`
    }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.2,
    });

    const review = response.choices[0].message.content;

    fs.writeFileSync('review.txt', review);
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    fs.writeFileSync('review.txt', 'An error occurred while generating the code review.');
    process.exit(1); // Exit with error code
  }
}

main();
