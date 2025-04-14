// friendMatrix.js

// Matrix to track the appreciation level of each user
const friendAppreciationMatrix = {
  // "userId": level (0 = disliked, 1 = neutral, 2 = liked, 3 = favorite)
};

// Get the current appreciation level for a user
function getAppreciationLevel(userId) {
  return friendAppreciationMatrix[userId] ?? 1; // Default to neutral (level 1)
}

// Set the appreciation level for a user (0 = disliked, 3 = favorite)
function setAppreciationLevel(userId, level) {
  friendAppreciationMatrix[userId] = Math.max(0, Math.min(3, parseInt(level)));
}

// Delay response based on appreciation level (in milliseconds)
function getResponseDelay(userId) {
  const level = getAppreciationLevel(userId);
  switch (level) {
    case 0: return 10000; // 10s delay for disliked
    case 1: return 4000;  // 4s delay for neutral
    case 2: return 1500;  // 1.5s delay for liked
    case 3: return 0;     // immediate response for favorite
    default: return 3000;
  }
}

export { getAppreciationLevel, setAppreciationLevel, getResponseDelay };