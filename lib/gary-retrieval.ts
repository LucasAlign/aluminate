export type GaryArticle = {
  date: string;
  issueUrl: string;
  pdfUrl: string;
  searchText: string;
};

const STOP_WORDS = new Set([
  "about", "after", "again", "also", "and", "because", "been", "before", "being", "business", "but", "can", "could", "does",
  "feels", "from", "gary", "have", "into", "just", "keep", "more", "most", "service", "should", "some", "that", "their", "them", "then",
  "the", "there", "these", "they", "this", "through", "what", "when", "where", "which", "with", "would", "your",
  "how", "my", "until", "week"
]);

const CONCEPT_EXPANSIONS: Array<[RegExp, string[]]> = [
  [/\b(idea|start|launch|perfect|waiting|stuck)\b/i, ["entrepreneur", "mindset", "action", "customer", "test"]],
  [/\b(brand|marketing|customer|value proposition)\b/i, ["trust", "value", "promise", "differentiate"]],
  [/\b(lead|leader|team|delegate|employee)\b/i, ["leadership", "communication", "responsibility", "expectations"]],
  [/\b(price|pricing|charge|margin)\b/i, ["cost", "profit", "customer", "value"]],
  [/\b(network|referral|relationship)\b/i, ["networking", "connect", "help", "follow"]]
];

export function searchableWords(value: string) {
  const words = Array.from(
    new Set(
      value
        .toLowerCase()
        .match(/[a-z0-9]+/g)
        ?.filter((word) => word.length >= 3 && !STOP_WORDS.has(word)) ?? []
    )
  );
  for (const [pattern, additions] of CONCEPT_EXPANSIONS) {
    if (pattern.test(value)) words.push(...additions);
  }
  return Array.from(new Set(words));
}

function occurrenceCount(haystack: string, needle: string) {
  let count = 0;
  let position = 0;
  while ((position = haystack.indexOf(needle, position)) !== -1) {
    count += 1;
    position += needle.length;
  }
  return count;
}

function articleScore(article: GaryArticle, words: string[]) {
  const text = article.searchText.toLowerCase();
  return words.reduce((score, word) => {
    const term = text.includes(word) || word.length < 6 ? word : word.slice(0, -1);
    const occurrences = Math.min(occurrenceCount(text, term), 4);
    return score + occurrences + (text.slice(0, 450).includes(term) ? 3 : 0);
  }, 0);
}

function excerpt(article: GaryArticle, words: string[], maxLength: number) {
  const lower = article.searchText.toLowerCase();
  const firstMatch = words
    .map((word) => lower.indexOf(word) >= 0 ? lower.indexOf(word) : lower.indexOf(word.slice(0, -1)))
    .filter((position) => position >= 0)
    .sort((left, right) => left - right)[0] ?? 0;
  const start = Math.max(0, firstMatch - 350);
  const raw = article.searchText.slice(start, start + maxLength);
  const trimmedStart = start > 0 ? raw.slice(Math.max(0, raw.indexOf(" ") + 1)) : raw;
  return `${start > 0 ? "…" : ""}${trimmedStart.trim()}${start + maxLength < article.searchText.length ? "…" : ""}`;
}

export function selectGaryArticles(
  articles: GaryArticle[],
  question: string,
  history: string[] = [],
  limit = 6
) {
  const words = searchableWords(`${history.slice(-4).join(" ")} ${question}`);
  return articles
    .map((article) => ({ article, score: articleScore(article, words) }))
    .sort((left, right) => right.score - left.score || right.article.date.localeCompare(left.article.date))
    .slice(0, limit)
    .map(({ article, score }) => ({
      date: article.date,
      score,
      excerpt: excerpt(article, words, 2100)
    }));
}
