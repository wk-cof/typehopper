import os
import openai

def main():
    openai.api_key = os.environ['OPENAI_API_KEY']

    with open('diff.txt', 'r') as f:
        diff_content = f.read()

    # Truncate the diff if it's too long (adjust max_chars as needed)
    max_chars = 5000
    if len(diff_content) > max_chars:
        diff_content = diff_content[:max_chars]
        diff_content += '\n[Diff truncated due to length]'

    messages = [
        {"role": "user", "content": f"Please review the following code changes and provide constructive feedback:\n\n{diff_content}"}
    ]

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        temperature=0.2,
    )

    review = response.choices[0].message.content

    with open('review.txt', 'w') as f:
        f.write(review)

if __name__ == '__main__':
    main()
