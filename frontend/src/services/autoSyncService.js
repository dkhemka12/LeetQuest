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
    console.log("No LeetCode username set, skipping auto-sync");
    return false;
  }

  const now = Date.now();
  if (now - lastSyncTime < MIN_SYNC_INTERVAL) {
    console.log(
      `Sync cooldown active. Last sync: ${Math.round((now - lastSyncTime) / 1000)}s ago`,
    );
    return false;
  }

  try {
    lastSyncTime = now;
    await syncLeetcodeData({ leetcodeUsername });
    console.log(`Auto-sync completed for ${leetcodeUsername}`);
    return true;
  } catch (error) {
    console.log(`Auto-sync failed for ${leetcodeUsername}:`, error.message);
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
    console.log("Sync already running, skipping start");
    return;
  }

  if (!leetcodeUsername) {
    console.log("No LeetCode username, cannot start periodic sync");
    return;
  }

  console.log(
    `Starting periodic sync every ${intervalMs / 1000 / 60 / 60} hours`,
  );
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
    console.log("Periodic sync stopped");
  }
};

/**
 * Check if periodic sync is active
 */
export const isSyncRunning = () => {
  return syncIntervalId !== null;
};
