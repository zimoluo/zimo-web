let activePopups: any[] = [];

export const addActivePopup = (popupInstance: any): void => {
  activePopups.push(popupInstance);
};

export const removeActivePopup = (popupInstance: any): void => {
  const index = activePopups.indexOf(popupInstance);
  if (index !== -1) {
    activePopups.splice(index, 1);
  }
};

export const isActivePopup = (popupInstance: any): boolean => {
  return (
    activePopups.length > 0 &&
    activePopups[activePopups.length - 1] === popupInstance
  );
};

export const clearActivePopups = (): void => {
  activePopups = [];
};
