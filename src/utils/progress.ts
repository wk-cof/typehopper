const STORAGE_KEY = 'typehopper.highestUnlockedLevel';

function isStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getHighestUnlockedLevel(): number {
  if (!isStorageAvailable()) {
    return 0;
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) {
      return 0;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : Math.min(parsed, Number.MAX_SAFE_INTEGER);
  } catch (error) {
    console.warn('Unable to read level progress from storage', error);
    return 0;
  }
}

export function setHighestUnlockedLevel(levelIndex: number): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, `${Math.max(levelIndex, 0)}`);
  } catch (error) {
    console.warn('Unable to store level progress', error);
  }
}
