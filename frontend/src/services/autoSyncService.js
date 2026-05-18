import { syncLeetcodeData } from "./leetcodeApi";

let syncIntervalId = null;
let lastSyncTime = 0;
const MIN_SYNC_INTERVAL = 5 * 60 * 1000; // Minimum 5 minutes between syncs

/**
 * Trigger immediate sync for given username with cooldown
 * Won't sync if last sync was less than 5 minutes ago
 */
export const triggerSync = async (leetcodeUsername) => {
  if (!leetcodeUsername) {
    return false;
  }

  const now = Date.now();
  if (now - lastSyncTime < MIN_SYNC_INTERVAL) {
    return false;
  }

  try {
    lastSyncTime = now;
    await syncLeetcodeData({ leetcodeUsername });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Start periodic background sync
 * @param {string} leetcodeUsername - LeetCode username to sync
 * @param {number} intervalMs - Interval in milliseconds (default: 6 hours)
 */
export const startPeriodicSync = (
  leetcodeUsername,
  intervalMs = 6 * 60 * 60 * 1000,
) => {
  if (syncIntervalId) {
    return;
  }

  if (!leetcodeUsername) {
    return;
  }

  syncIntervalId = setInterval(() => {
    triggerSync(leetcodeUsername);
  }, intervalMs);
};

/**
 * Stop periodic background sync
 */
export const stopPeriodicSync = () => {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
    syncIntervalId = null;
  }
};

/**
 * Check if periodic sync is active
 */
export const isSyncRunning = () => {
  return syncIntervalId !== null;
};
