/**
 * Utility functions for position data management
 */

/**
 * Sorts positions by creation time (newest first)
 * @param {Array} positions - Array of position objects
 * @returns {Array} Sorted array of positions
 */
export function sortByCreationTime(positions) {
  return [...positions].sort((a, b) => {
    const dateA = a.createdAt ? a.createdAt : 0
    const dateB = b.createdAt ? b.createdAt : 0
    return dateB - dateA // Descending order (newest first)
  })
}

/**
 * Automatically adds "NEW" tag to DeFi positions created within the last 7 days
 * @param {Array} positions - Array of DeFi position objects
 * @returns {Array} Positions with updated tags
 */
export function autoTagNewPositions(positions) {
  const now = Date.now()
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
  const sevenDaysAgo = now - sevenDaysInMs

  return positions.map(position => {
    const createdAt = position.createdAt || 0
    const isNew = createdAt >= sevenDaysAgo
    
    // Clone the position to avoid mutation
    const updatedPosition = { ...position }
    
    // Initialize tags if not present
    if (!updatedPosition.tags) {
      updatedPosition.tags = []
    } else {
      // Clone tags array to avoid mutation
      updatedPosition.tags = [...updatedPosition.tags]
    }
    
    // Check if NEW tag already exists
    const hasNewTag = updatedPosition.tags.some(tag => tag.label === 'NEW')
    
    if (isNew && !hasNewTag) {
      // Add NEW tag at the beginning
      updatedPosition.tags.unshift({
        label: 'NEW',
        bg: '#a6c724',
        color: '#000000'
      })
    } else if (!isNew && hasNewTag) {
      // Remove NEW tag if position is older than 7 days
      updatedPosition.tags = updatedPosition.tags.filter(tag => tag.label !== 'NEW')
    }
    
    return updatedPosition
  })
}

/**
 * Processes DeFi positions: auto-tags and sorts by creation time
 * @param {Array} positions - Array of DeFi position objects
 * @returns {Array} Processed positions
 */
export function processDeFiPositions(positions) {
  const tagged = autoTagNewPositions(positions)
  return sortByCreationTime(tagged)
}

/**
 * Processes DEX positions: sorts by creation time
 * @param {Array} positions - Array of DEX position objects
 * @returns {Array} Processed positions
 */
export function processDexPositions(positions) {
  return sortByCreationTime(positions)
}
