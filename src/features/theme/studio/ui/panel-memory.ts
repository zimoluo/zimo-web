type PanelPosition = { offset: number; disclosures: Map<string, boolean> };
export function createStudioPanelMemory(root: HTMLElement) {
  const editor = root.querySelector<HTMLElement>('[data-studio-scroll="editor"]');
  const candidates = ["frame", "body", "editor"].map(name => root.querySelector<HTMLElement>(`[data-studio-scroll="${name}"]`)).filter((node): node is HTMLElement => node !== null);
  if (!editor) throw new Error("Studio editor scroll surface is missing");
  const positions = new Map<string, PanelPosition>();
  let active = "Color", previousOwner: HTMLElement | null = null;
  const owner = () => candidates.find(node => /^(auto|scroll)$/.test(getComputedStyle(node).overflowY)) ?? editor;
  const origin = (node: HTMLElement) => node === editor ? 0 : editor.getBoundingClientRect().top - node.getBoundingClientRect().top + node.scrollTop - node.clientTop;
  const position = () => { let value = positions.get(active); if (!value) { value = { offset: 0, disclosures: new Map() }; positions.set(active, value); } return value; };
  const disclosures = () => {
    const counts = new Map<string, number>();
    return [...root.querySelectorAll<HTMLDetailsElement>('[role=tabpanel] details')].map(node => {
      const title = node.querySelector(":scope > summary")?.textContent?.trim() ?? "";
      const count = counts.get(title) ?? 0; counts.set(title, count + 1);
      return { node, key: `${title}:${count}` };
    });
  };
  const recordOffset = () => { const node = owner(); position().offset = node.scrollTop - origin(node); previousOwner = node; };
  const capture = () => { recordOffset(); position().disclosures = new Map(disclosures().map(({ node, key }) => [key, node.open])); };
  const applyOffset = (offset: number | undefined) => {
    const node = owner();
    for (const candidate of candidates) if (candidate !== node) candidate.scrollTop = 0;
    node.scrollTop = offset === undefined ? 0 : Math.max(0, offset + origin(node));
    previousOwner = node;
  };
  const scroll = (event: Event) => { if (candidates.some(node => node === event.target) && event.target === owner()) recordOffset(); };
  root.addEventListener("scroll", scroll, true);
  const observer = new ResizeObserver(() => {
    const value = positions.get(active);
    if (value && previousOwner !== null) applyOffset(value.offset);
  });
  observer.observe(root);
  return {
    capture,
    show: (panel: string) => {
      active = panel;
      const value = positions.get(panel);
      if (value) for (const { node, key } of disclosures()) { const open = value.disclosures.get(key); if (open !== undefined) node.open = open; }
      applyOffset(value?.offset); recordOffset();
    },
    dispose: () => { observer.disconnect(); root.removeEventListener("scroll", scroll, true); positions.clear(); },
  };
}
