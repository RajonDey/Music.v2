import type { PracticeKind, Session, SessionAnchorType } from "@music/types";

/** Infer anchor when `anchor_type` is null (pre-migration or legacy rows). */
export function resolveSessionAnchor(session: Session): SessionAnchorType {
  if (session.anchor_type) return session.anchor_type;
  if (session.song_id) return "song";
  return "freestyle";
}

export function isRiyaz(session: Session): boolean {
  return session.practice_kind === "riyaz";
}

export function isPracticeSession(session: Session): boolean {
  return session.practice_kind !== "riyaz";
}

export function normalizePracticeKind(value: string | null | undefined): PracticeKind {
  return value === "riyaz" ? "riyaz" : "session";
}
