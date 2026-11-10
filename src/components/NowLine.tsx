// The "Now" line shown on both the homepage and About. One source so the
// two can't drift apart; update the date whenever the text changes.
export function NowLine() {
  return (
    <p className="text-sm text-muted leading-relaxed">
      <span className="text-ink font-medium">Now — </span>
      Forward deployed / backend engineering at Xylo AI Studios and the
      ProofShape capstone. My VLM edge-deployment preprint is on Zenodo; the
      TruPhoto paper is written, preprint in progress. Available from the first
      week of January 2027.{" "}
      <span className="text-xs text-muted">(Last updated Nov 2026)</span>
    </p>
  );
}
