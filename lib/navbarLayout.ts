interface NavbarLayoutInput {
  width: number;
  menuExpanded: boolean;
  navbarExpanded: boolean;
}

export function calculateNavbarLayout({ width, menuExpanded, navbarExpanded }: NavbarLayoutInput) {
  const phone = width < 640;
  const padding = phone ? 10 : 16;
  const size = phone ? 48 : 52;
  const span = menuExpanded ? Math.max(0, width - 496) : width;
  const visible = !menuExpanded || span >= 640;
  const windows = width >= 768 && span >= 640;
  const right = span - padding - (menuExpanded ? 0 : size + 16);
  const windowLeft = right - 52;
  const searchRight = windows ? windowLeft - 16 : right;
  const destinationWidth = width < 360 ? 172 : phone ? 218 : 234;
  const homeRight = padding + size;
  const inline = !phone;
  const destinationLeft = inline ? homeRight + 16 : Math.max(homeRight + 12, (width - destinationWidth) / 2);
  const destinationRight = destinationLeft + destinationWidth;
  const labels = inline && searchRight - destinationRight - 16 >= 252;
  const available = searchRight - destinationRight - 16 - (labels ? 72 : 0);
  const stacked = !inline && navbarExpanded;
  const searchLeft = stacked ? padding : inline ? searchRight - Math.min(272, available) : homeRight + 12;
  const searchWidth = stacked ? width - padding * 2 : inline ? Math.min(272, available) : Math.min(400, searchRight - searchLeft);
  return {
    visible, windows, labels, span,
    mode: inline ? "inline" : stacked ? "stacked" : "substituted",
    destinationLeft, windowLeft,
    searchLeft, searchWidth: Math.max(0, searchWidth), searchTop: stacked ? size + 20 : 10,
    height: stacked ? size * 2 + 30 : size + 20,
  };
}
