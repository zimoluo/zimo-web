type Slot = { readonly id: string; readonly contained: boolean; order: number; painted: boolean };
export class RendererLease {
  private readonly slots = new Map<string, Slot>();
  private order = 0;
  private active: string | null = null;
  private capture = false;
  private readonly events: {
    readonly activate: (id: string | null) => void;
    readonly capture: (id: string) => void;
    readonly frame: (id: string, image: string | null) => void;
  };
  constructor(events: RendererLease["events"]) { this.events = events; }
  get current(): string | null { return this.active; }
  get size(): number { return this.slots.size; }
  mount(id: string, contained: boolean): void {
    this.slots.set(id, { id, contained, order: ++this.order, painted: false });
    this.reconcile();
  }
  focus(id: string): void {
    const slot = this.slots.get(id); if (slot === undefined || !slot.contained) return;
    slot.order = ++this.order; this.reconcile();
  }
  refresh(id: string): void {
    const slot = this.slots.get(id); if (slot === undefined) return;
    slot.painted = false; this.reconcile();
  }
  remove(id: string): void {
    this.slots.delete(id);
    if (this.active === id) { this.active = null; this.capture = false; }
    this.reconcile();
  }
  wantsFrame(id: string): boolean { return this.active === id && this.capture; }
  painted(id: string, image: string | null): void {
    if (!this.wantsFrame(id)) return;
    const slot = this.slots.get(id); if (slot === undefined) return;
    slot.painted = true; this.capture = false; this.events.frame(id, image);
    const next = this.preferred();
    if (next !== this.active) this.activate(next);
    this.reconcile();
  }
  private preferred(): string | null {
    const slots = [...this.slots.values()];
    const pending = slots.filter((slot) => !slot.painted).sort((a, b) => a.order - b.order);
    if (pending[0] !== undefined) return pending[0].id;
    return slots.sort((a, b) => Number(b.contained) - Number(a.contained) || b.order - a.order)[0]?.id ?? null;
  }
  private activate(id: string | null): void {
    this.active = id; this.capture = id !== null && this.slots.get(id)?.painted === false;
    this.events.activate(id);
    if (id !== null && this.capture) this.events.capture(id);
  }
  private reconcile(): void {
    const next = this.preferred();
    if (this.active === null) { this.activate(next); return; }
    if (this.capture || next !== this.active || this.slots.get(this.active)?.painted === false) { this.capture = true; this.events.capture(this.active); }
  }
}
