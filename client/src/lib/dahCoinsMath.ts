export function calculateDahCoins(age: number, base: number) {
  const b = Math.max(0, Math.floor(base));
  return age >= 13 && age < 18 
    ? { available: b, lockedForCollege: b } 
    : { available: b, lockedForCollege: 0 };
}
