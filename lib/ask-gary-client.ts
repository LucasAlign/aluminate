export type GaryHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function askGary(
  question: string,
  history: GaryHistoryMessage[],
  onUpdate?: (partialAnswer: string) => void
) {
  const response = await fetch("/api/ask-gary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, history })
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error || "Ask Gary could not respond right now.");
  }
  if (!response.body) throw new Error("Ask Gary returned an empty response.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let answer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    answer += decoder.decode(value, { stream: true });
    onUpdate?.(answer);
  }
  answer += decoder.decode();
  answer = answer.trim();
  if (!answer) throw new Error("Ask Gary returned an empty response.");
  onUpdate?.(answer);
  return answer;
}

