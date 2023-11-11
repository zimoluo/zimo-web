export function removeAllCachedUserData() {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key !== null && key.startsWith("zimoWebCachedUserData_")) {
      localStorage.removeItem(key);
    }
  }
}

export function removeCachedUserDataBySub(sub: string) {
  const localStorageKey = `zimoWebCachedUserData_${sub}`;
  localStorage.removeItem(localStorageKey);
}
