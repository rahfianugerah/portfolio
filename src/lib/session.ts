/**
 * The per-tab identifier the analytics endpoint dedupes visits by.
 *
 * One copy, because two callers need it: the tracker that fires on every page, and the
 * widget that reads the numbers back. The server counts a session once, so both calling
 * it is harmless — but both inventing their own id would count the same visitor twice.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem("portfolio_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("portfolio_session_id", sessionId);
  }
  return sessionId;
}
