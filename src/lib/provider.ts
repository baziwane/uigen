import { anthropic } from "@ai-sdk/anthropic";

const MODEL = "claude-haiku-4-5";

export function getLanguageModel() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    console.warn(
      "No ANTHROPIC_API_KEY found. Set ANTHROPIC_API_KEY in your .env file to enable AI-powered component generation."
    );
    // Return the anthropic model anyway - the API call will fail with a clear error
    // if the key is missing, which is better than a mock that may confuse users
  }

  return anthropic(MODEL);
}
