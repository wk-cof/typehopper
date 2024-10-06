// code-review.js

import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';

async function main() {
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }));

  let diffContent = fs.readFileSync('diff.txt', 'utf8');
  let diffContent = null; // revert me

  // Truncate the diff if it's too long (adjust maxTokens as needed)
  const maxTokens = 4000; // Adjust based on model's token limit
  const maxChars = maxTokens * 4; // Approximate conversion to characters
  if (diffContent.length > maxChars) {
    diffContent = diffContent.substring(0, maxChars) + '\n[Diff truncated due to length]';
  }

  const messages = [
    { role: "user", content: `Please review the following code changes and provide constructive feedback:\n\n${diffContent}` }
  ];

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: messages,
      temperature: 0.2,
    });

    const review = response.data.choices[0].message.content;

    fs.writeFileSync('review.txt', review);
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    fs.writeFileSync('review.txt', 'An error occurred while generating the code review.');
  }
}

main();
