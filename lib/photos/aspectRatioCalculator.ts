const stringToSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0;
  }
  return hash;
};

class Xorshift {
  private _state: number;

  constructor(seed: number = 1) {
    this._state = seed;
  }

  next(): number {
    this._state ^= this._state << 13;
    this._state ^= this._state >> 17;
    this._state ^= this._state << 5;
    return (this._state >>> 0) / Math.pow(2, 32);
  }
}

export function computeRandomMultiplier(url: string) {
  const rng = new Xorshift(stringToSeed(url));
  return 0.8 + rng.next() * 0.4;
}
