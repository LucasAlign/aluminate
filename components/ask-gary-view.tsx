"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { askGaryWithGemini } from "@/lib/ask-gary-ai";

type Source = {
  title: string;
  year?: string;
  url: string;
  topics: string[];
};

type ChatMessage = {
  id: string;
  sender: "gary" | "user";
  body: string;
  sources?: Source[];
};

const sources: Source[] = [
  {
    title: "Do You Have an Entrepreneurial MINDSET?",
    year: "2025",
    url: "https://422business.com/sites/default/files/Rt422BA_06-25-SBRA.pdf",
    topics: ["mindset", "start", "idea", "confidence", "entrepreneur"]
  },
  {
    title: "BRANDING is KING",
    year: "2025",
    url: "https://422business.com/sites/default/files/Rt422BA_05-25-SBRA.pdf",
    topics: ["brand", "branding", "marketing", "customer", "trust"]
  },
  {
    title: "Should You KNOW What You Don't KNOW?",
    year: "2021",
    url: "https://422business.com/sites/default/files/Rt422BA_Oct2021_SBRA.pdf",
    topics: ["decision", "knowledge", "problem", "procrastination", "stuck"]
  },
  {
    title: "Lead Like a GOOSE",
    year: "2020",
    url: "https://422business.com/groups/route-422-business-advisor",
    topics: ["lead", "leadership", "team", "delegate", "responsibility"]
  },
  {
    title: "A Few Take Homes After 50 Years in Business",
    year: "2019",
    url: "https://422business.com/groups/route-422-business-advisor",
    topics: ["experience", "failure", "future", "boss", "business"]
  }
];

const starterQuestions = [
  "How do I know if my idea is worth pursuing?",
  "What makes a brand trustworthy?",
  "How can I become a better leader?"
];

const welcome: ChatMessage = {
  id: "welcome",
  sender: "gary",
  body: "Hi—what's on your mind? Tell me what's happening, and we'll think it through together."
};

function thinkingNote(question: string) {
  const normalized = question.toLowerCase();
  if (/team|lead|employee|people/.test(normalized)) return "Let me think about the people side of that…";
  if (/idea|start|launch|customer/.test(normalized)) return "That's worth pressure-testing for a moment…";
  if (/stuck|decision|choose|risk/.test(normalized)) return "Let me separate the signal from the noise…";
  return "Give me a moment to think that through…";
}

function followUpPrompts(question: string) {
  const normalized = question.toLowerCase();
  if (/team|lead|employee|people/.test(normalized)) return ["What should I say to my team?", "Where should I start?"];
  if (/brand|marketing|customer/.test(normalized)) return ["How do I test that with customers?", "What should I do this week?"];
  if (/idea|start|launch/.test(normalized)) return ["Help me test the idea", "What's the biggest risk?"];
  return ["Can you give me an example?", "What's my best next step?"];
}

function createAnswer(question: string): ChatMessage {
  const normalized = question.toLowerCase();
  const ranked = sources
    .map((source) => ({ source, score: source.topics.filter((topic) => normalized.includes(topic)).length }))
    .sort((a, b) => b.score - a.score);
  const selected = ranked[0].score > 0 ? ranked.slice(0, 2).map(({ source }) => source) : [sources[0], sources[4]];

  let body = "Here's how I'd look at it: get the question out of your head and into the real world. Talk with the people affected, test one small assumption, and let what you learn shape the next move. Progress comes from informed action—not waiting for perfect certainty.";

  if (/brand|marketing|customer|trust/.test(normalized)) {
    body = "A brand is not simply a logo; it's the promise people expect you to keep. Start by getting very clear about who you serve, the problem you solve, and the experience you deliver every time. Consistency earns recognition, and recognition—paired with good work—earns trust.";
  } else if (/lead|team|delegate|employee|people/.test(normalized)) {
    body = "Leadership is shared responsibility. Set a clear direction, give people room to contribute, and make it safe for them to tell you what you may be missing. Like geese in formation, strong teams take turns carrying the load and encourage one another along the way.";
  } else if (/idea|start|mindset|entrepreneur|confidence/.test(normalized)) {
    body = "An entrepreneurial mindset begins with noticing a problem and taking responsibility for learning how to solve it. Ask better questions, speak with potential customers, and test the smallest useful version of your idea. Confidence usually follows action; it rarely arrives before it.";
  } else if (/stuck|decision|procrast|problem|know/.test(normalized)) {
    body = "First, name what you don't know. Then decide which missing fact truly changes the decision and go get that fact. Problems seldom improve through delay. Give yourself a short deadline, choose the best responsible next step, and adjust as new information arrives.";
  }

  return { id: `gary-${Date.now()}`, sender: "gary", body, sources: selected };
}

export function AskGaryView() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [responding, setResponding] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [thinkingCopy, setThinkingCopy] = useState("Give me a moment to think that through…");
  const [speaking, setSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, thinking]);

  const status = useMemo(
    () => (thinking ? "Thinking it through" : responding ? "Replying" : speaking ? "Speaking" : "Here when you need me"),
    [responding, speaking, thinking]
  );
  const lastUserQuestion = [...messages].reverse().find((message) => message.sender === "user")?.body;

  function readAnswer(body: string) {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(body);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => /guy|david|google us english/i.test(voice.name)) ?? voices.find((voice) => voice.lang.startsWith("en")) ?? null;
    utterance.rate = 0.96;
    utterance.pitch = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  async function ask(question: string) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || thinking) return;
    const priorMessages = messages;
    const responseId = `gary-${Date.now()}`;
    let streamedBody = "";
    setMessages((current) => [...current, { id: `user-${Date.now()}`, sender: "user", body: cleanQuestion }]);
    setDraft("");
    setThinkingCopy(thinkingNote(cleanQuestion));
    setThinking(true);
    setResponding(false);
    try {
      const result = await askGaryWithGemini(
        cleanQuestion,
        priorMessages
          .filter((message) => message.id !== "welcome")
          .map((message) => ({ role: message.sender === "gary" ? "model" as const : "user" as const, text: message.body })),
        (partialAnswer) => {
          streamedBody = partialAnswer;
          setThinking(false);
          setResponding(true);
          setStreamingMessageId(responseId);
          setMessages((current) => {
            const exists = current.some((message) => message.id === responseId);
            if (exists) {
              return current.map((message) => message.id === responseId ? { ...message, body: partialAnswer } : message);
            }
            return [...current, { id: responseId, sender: "gary", body: partialAnswer }];
          });
        }
      );
      if (!streamedBody) {
        setMessages((current) => [...current, { id: responseId, sender: "gary", body: result }]);
      }
      readAnswer(result);
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("Ask Gary Gemini request failed", error);
      if (!streamedBody) {
        const answer = createAnswer(cleanQuestion);
        setMessages((current) => [...current, answer]);
        readAnswer(answer.body);
      }
    } finally {
      setThinking(false);
      setResponding(false);
      setStreamingMessageId(null);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(draft);
  }

  function resetChat() {
    window.speechSynthesis?.cancel();
    setMessages([welcome]);
    setDraft("");
    setThinking(false);
    setResponding(false);
    setStreamingMessageId(null);
    setSpeaking(false);
  }

  return (
    <aside className={open ? "gary-widget open" : "gary-widget"} aria-label="Ask Gary">
      {open && <section className="glass-panel gary-widget-panel" role="dialog" aria-modal="false" aria-labelledby="gary-widget-title">
        <header className="gary-widget-head">
          <img className={thinking || responding || speaking ? "active" : ""} src="/assets/gary-seibert.png" alt="" />
          <div>
            <h3 id="gary-widget-title">Ask Gary</h3>
            <span><i className={thinking || speaking ? "active" : ""} />{status}</span>
          </div>
          <div className="gary-widget-actions">
            <button
              className={voiceEnabled ? "enabled" : ""}
              onClick={() => {
                window.speechSynthesis?.cancel();
                setSpeaking(false);
                setVoiceEnabled((enabled) => !enabled);
              }}
              aria-label={voiceEnabled ? "Turn voice responses off" : "Turn voice responses on"}
              aria-pressed={voiceEnabled}
              title={voiceEnabled ? "Voice on" : "Voice off"}
            >
              {voiceEnabled ? "◉" : "○"}
            </button>
            <button onClick={resetChat} aria-label="Start a new conversation" title="New conversation">+</button>
            <button onClick={() => setOpen(false)} aria-label="Close Ask Gary" title="Close">×</button>
          </div>
        </header>

        <div className="gary-messages" aria-live="polite">
          {messages.map((message) => (
            <article className={`gary-message ${message.sender} ${message.id === streamingMessageId ? "streaming" : ""}`} key={message.id}>
              {message.sender === "gary" && <img src="/assets/gary-seibert.png" alt="" />}
              <div>
                <span className="gary-message-name">{message.sender === "gary" ? "Gary" : "You"}</span>
                {message.body.split(/\n{2,}/).map((paragraph, index) => <p key={`${message.id}-${index}`}>{paragraph}</p>)}
              </div>
            </article>
          ))}
          {thinking && (
            <article className="gary-message gary">
              <img src="/assets/gary-seibert.png" alt="" />
              <div className="gary-thinking">
                <div className="gary-typing" aria-label="Gary is preparing an answer"><i /><i /><i /></div>
                <span>{thinkingCopy}</span>
              </div>
            </article>
          )}
          <div ref={messageEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="gary-starters" aria-label="Suggested questions">
            {starterQuestions.map((question) => (
              <button key={question} onClick={() => void ask(question)}>{question}</button>
            ))}
          </div>
        )}

        {!thinking && !responding && messages.length > 2 && lastUserQuestion && (
          <div className="gary-followups" aria-label="Continue the conversation">
            {followUpPrompts(lastUserQuestion).map((question) => (
              <button key={question} onClick={() => void ask(question)}>{question}</button>
            ))}
          </div>
        )}

        <form className="gary-composer" onSubmit={submit}>
          <label htmlFor="gary-question">What are you working through?</label>
          <div>
            <textarea
              id="gary-question"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void ask(draft);
                }
              }}
              placeholder="Gary, how should I think about..."
              rows={2}
            />
            <button type="submit" disabled={!draft.trim() || thinking} aria-label="Send question">Ask Gary <span>→</span></button>
          </div>
          <p>For legal, financial, or medical decisions, consult a qualified professional.</p>
        </form>
        <p className="gary-widget-disclosure">Digital representation of Gary Seibert.</p>
      </section>}

      <button
        className={`gary-floating-head ${speaking || responding ? "is-speaking" : ""} ${thinking ? "is-thinking" : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "Close Ask Gary" : "Open Ask Gary"}
      >
        <span className="gary-signal signal-one" />
        <span className="gary-signal signal-two" />
        <img src="/assets/gary-seibert.png" alt="" />
        <span className="gary-status-dot" />
        {!open && <strong>Ask Gary</strong>}
      </button>
    </aside>
  );
}
