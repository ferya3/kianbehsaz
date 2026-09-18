/**
 * Break a headline into display lines.
 *
 * Two things CSS line wrapping cannot do, and that matter at display size:
 *
 *  - **Balance.** A greedy wrap fills the first line and leaves the last one
 *    short, which reads as a mistake rather than as a decision.
 *  - **Particles.** Persian and Arabic have words that belong to a neighbour.
 *    "را" marks the object of the word *before* it, so a line may not begin
 *    with it; "که", "به", "در" lean on the word *after* them, so a line may
 *    not end with one.
 *
 * Applying those as sequential fixes makes them fight — nudging a break off a
 * particle unbalances the lines, and rebalancing puts it back. So every
 * possible set of break points is scored instead, and the best one wins. A
 * headline is a handful of words, so the search is a few dozen combinations.
 *
 * The lines also have to be discrete strings rather than wrapped text, because
 * each one is revealed behind its own mask.
 */

/**
 * Must not END a line: these lean on the word that follows.
 *
 * English conjunctions ("that", "and") are deliberately absent — unlike an
 * article or a preposition, they sit fine at the end of a display line, and
 * banning them costs more in balance than it buys in polish.
 */
const PROCLITICS = new Set([
  'به',
  'از',
  'با',
  'در',
  'که',
  'و',
  'یا',
  'تا',
  'بر',
  'این',
  'آن',
  'هر',
  'می',
  'على',
  'إلى',
  'من',
  'في',
  'عن',
  'the',
  'a',
  'an',
  'of',
  'to',
  'in',
  'on',
  'for',
])

/** Must not START a line: these lean on the word before them. */
const ENCLITICS = new Set(['را'])

/** Above this, the search is not worth it and a greedy wrap is fine. */
const MAX_SEARCH_WORDS = 14

function greedy(words: string[], maxChars: number): string[] {
  const lines: string[][] = [[]]

  for (const word of words) {
    const current = lines[lines.length - 1]!
    if (current.length && [...current, word].join(' ').length > maxChars) {
      lines.push([word])
    } else {
      current.push(word)
    }
  }

  return lines.map((line) => line.join(' '))
}

export function splitDisplayLines(text: string, maxChars = 18): string[] {
  const trimmed = text.trim()
  const words = trimmed.split(/\s+/).filter(Boolean)
  if (words.length <= 1) return words

  const lineCount = Math.max(1, Math.ceil(trimmed.length / maxChars))
  if (lineCount === 1) return [trimmed]
  if (words.length > MAX_SEARCH_WORDS || lineCount >= words.length) {
    return greedy(words, maxChars)
  }

  const target = trimmed.length / lineCount
  // A particle landing on a break is worse than any amount of imbalance the
  // alternatives can introduce, so the penalty outweighs the length budget.
  const PARTICLE_PENALTY = maxChars

  let best: { score: number; lines: string[] } | null = null

  /** Walk every way of cutting the word list into `lineCount` pieces. */
  const walk = (start: number, remaining: number, chosen: number[]) => {
    if (remaining === 1) {
      const cuts = [0, ...chosen, words.length]
      const lines = cuts
        .slice(0, -1)
        .map((from, index) => words.slice(from, cuts[index + 1]))

      let score = 0
      for (const [index, line] of lines.entries()) {
        score += Math.abs(line.join(' ').length - target)

        const last = line[line.length - 1]!
        const first = line[0]!
        if (index < lines.length - 1 && PROCLITICS.has(last.toLowerCase())) {
          score += PARTICLE_PENALTY
        }
        if (index > 0 && ENCLITICS.has(first)) {
          score += PARTICLE_PENALTY
        }
      }

      if (!best || score < best.score) {
        best = { score, lines: lines.map((line) => line.join(' ')) }
      }
      return
    }

    // Leave at least one word for each remaining line.
    for (let cut = start + 1; cut <= words.length - remaining + 1; cut += 1) {
      walk(cut, remaining - 1, [...chosen, cut])
    }
  }

  walk(0, lineCount, [])

  return best ? (best as { lines: string[] }).lines : greedy(words, maxChars)
}
