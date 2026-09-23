import assert from "node:assert/strict";
import test from "node:test";
import { searchableWords, selectGaryArticles, type GaryArticle } from "./gary-retrieval.ts";

const articles: GaryArticle[] = [
  { date: "2025-01", issueUrl: "one", pdfUrl: "one", searchText: "A practical guide to leadership, delegation, and building a strong team." },
  { date: "2026-01", issueUrl: "two", pdfUrl: "two", searchText: "How to define a value proposition and earn customer trust through consistency." },
  { date: "2024-01", issueUrl: "three", pdfUrl: "three", searchText: "Small daily goals and a growth mindset can turn ideas into action." }
];

test("searchableWords removes filler words and duplicates", () => {
  const words = searchableWords("What should Gary do about the team and team?");
  assert.equal(words.filter((word) => word === "team").length, 1);
  assert.ok(!words.includes("what"));
  assert.ok(!words.includes("gary"));
});

test("selectGaryArticles ranks relevant writing ahead of newer unrelated writing", () => {
  const selected = selectGaryArticles(articles, "How can I delegate to my team?", [], 2);
  assert.equal(selected[0].date, "2025-01");
  assert.match(selected[0].excerpt, /delegation/i);
});

test("selectGaryArticles carries recent conversation context into retrieval", () => {
  const selected = selectGaryArticles(articles, "What should I do next?", ["I am working on my value proposition"], 1);
  assert.equal(selected[0].date, "2026-01");
});

test("searchableWords expands common business situations into Gary concepts", () => {
  const words = searchableWords("My idea is stuck because I am waiting for perfect");
  assert.ok(words.includes("mindset"));
  assert.ok(words.includes("action"));
  assert.ok(words.includes("customer"));
});
