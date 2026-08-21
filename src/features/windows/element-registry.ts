const elements = new Map<string, HTMLElement>();

export const registerWindowElement = (
  id: string,
  element: HTMLElement | null,
): void => {
  if (element === null) elements.delete(id);
  else elements.set(id, element);
};

export const getWindowElement = (id: string): HTMLElement | undefined =>
  elements.get(id);

export const registeredCount = (): number => elements.size;

export const clearWindowElements = (): void => {
  elements.clear();
};

export function writeRect(
  id: string,
  rect: { x: number; y: number; width: number; height: number },
): boolean {
  const element = elements.get(id);
  if (element === undefined) return false;

  element.style.translate = `${rect.x}px ${rect.y}px`;
  element.style.width = `${rect.width}px`;
  element.style.height = `${rect.height}px`;

  return true;
}

export function focusWindowElement(id: string): boolean {
  const element = elements.get(id);
  if (element === undefined) return false;
  element.focus();
  return true;
}
