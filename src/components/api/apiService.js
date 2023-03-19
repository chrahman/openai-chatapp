import { fetchSSE } from "./fetchSSE";

const currentDate = new Date().toISOString().split("T")[0];
const CHATGPT_SYSTEM_MESSAGE = `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.\nKnowledge cutoff: 2021-09-01\nCurrent date: ${currentDate}`;

// const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
export async function apiService(apiKey, prompt, callback) {
    await fetchSSE("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: CHATGPT_SYSTEM_MESSAGE,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        stream: true,
      }),
      onMessage(message) {
        console.debug("sse message received");
        if (message === "[DONE]") {
          return;
        }
        let data;
        try {
          data = JSON.parse(message);
        } catch (err) {
          console.debug("Error parsing SSE message", err);
          return;
        }
        if (data) {
            callback(data.choices[0].delta.content);
        }
      },
    });
};