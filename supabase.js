import supabase from "./supabase.js";

// Default appreciation score for users not in the matrix
const DEFAULT_APPRECIATION = 5;
const MAX_APPRECIATION = 10;
const MIN_DELAY_MS = 0;
const MAX_DELAY_MS = 10000; // 10 seconds

export async function getAppreciationLevel(userId) {
  const { data, error } = await supabase
    .from("friend_matrix")
    .select("appreciation")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    console.warn(`Appreciation fetch fallback for ${userId}:`, error?.message || "No data");
    return DEFAULT_APPRECIATION;
  }

  return data.appreciation;
}

export async function getResponseDelay(userId) {
  const level = await getAppreciationLevel(userId);
  const clampedLevel = Math.max(0, Math.min(MAX_APPRECIATION, level));
  const delay = MAX_DELAY_MS - (clampedLevel * (MAX_DELAY_MS / MAX_APPRECIATION));
  return delay;
}

export async function setAppreciationLevel(userId, level) {
  const appreciation = Math.max(0, Math.min(MAX_APPRECIATION, level));
  const { data, error } = await supabase
    .from("friend_matrix")
    .upsert({ user_id: userId, appreciation });

  if (error) {
    console.error(`Failed to update appreciation for ${userId}:`, error.message);
    return false;
  }

  return true;
}