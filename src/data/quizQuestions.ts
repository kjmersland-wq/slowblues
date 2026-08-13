// Quiz leaderboard (client-side only, localStorage) — the question pool
// itself moved to D1 (see src/lib/quiz.server.ts, migrations/0004 and
// 0005). This file used to also hold the static question pool and the
// cycle-rotation math (getCycleNumber/getCycleQuestions/etc.), all now
// superseded by the D1-backed system and deleted from here — the
// leaderboard was never part of that migration and stays exactly as it
// was.

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  total: number;
  date: string;
  monthKey: string;
}

const LEADERBOARD_KEY = 'slowblues-quiz-leaderboard';

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToLeaderboard(entry: LeaderboardEntry): void {
  const all = getLeaderboard();
  all.push(entry);
  all.sort((a, b) => b.score - a.score);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(all.slice(0, 100)));
}

export function getMonthlyLeaderboard(monthKey: string): LeaderboardEntry[] {
  return getLeaderboard()
    .filter((e) => e.monthKey === monthKey)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

export function getAllTimeLeaderboard(): LeaderboardEntry[] {
  return getLeaderboard()
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
