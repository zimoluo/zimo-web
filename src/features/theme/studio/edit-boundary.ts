const boundaries = new Set<{ readonly owner: symbol; readonly finish: () => void }>();
let finishing = false;

export function subscribeEditBoundary(owner: symbol, finish: () => void): () => void {
  const entry = { owner, finish };
  boundaries.add(entry);
  return () => { boundaries.delete(entry); };
}

export function settleStudioControls(except?: symbol): void {
  if (finishing) return;
  finishing = true;
  try {
    for (const entry of [...boundaries]) if (entry.owner !== except) entry.finish();
  } finally { finishing = false; }
}
