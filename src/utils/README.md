# Position Utilities

This module provides utility functions for managing and processing position data in the Husk Finance application.

## Features

### 1. Automatic Sorting by Creation Time

Both DEX and DeFi positions are automatically sorted by creation time in descending order (newest first).

### 2. Automatic "NEW" Tag for DeFi Positions

DeFi positions created within the last 7 days automatically receive a "NEW" tag with the following styling:
- Background: `#a6c724` (lime green)
- Text Color: `#000000` (black)

The NEW tag is:
- **Automatically added** if the position is less than 7 days old
- **Automatically removed** if the position is older than 7 days
- **Positioned first** in the tags array (leftmost position)

## Functions

### `sortByCreationTime(positions)`

Sorts an array of positions by their `createdAt` timestamp in descending order.

**Parameters:**
- `positions` (Array): Array of position objects with `createdAt` field

**Returns:**
- Array: Sorted positions (newest first)

**Example:**
```javascript
import { sortByCreationTime } from '../utils/positionUtils'

const sorted = sortByCreationTime(positions)
```

---

### `autoTagNewPositions(positions)`

Automatically adds or removes "NEW" tags based on creation time (7-day threshold).

**Parameters:**
- `positions` (Array): Array of DeFi position objects

**Returns:**
- Array: Positions with updated tags

**Logic:**
- Positions < 7 days old → NEW tag added (if not present)
- Positions ≥ 7 days old → NEW tag removed (if present)

**Example:**
```javascript
import { autoTagNewPositions } from '../utils/positionUtils'

const tagged = autoTagNewPositions(defiPositions)
```

---

### `processDeFiPositions(positions)`

Convenience function that combines auto-tagging and sorting for DeFi positions.

**Parameters:**
- `positions` (Array): Array of DeFi position objects

**Returns:**
- Array: Auto-tagged and sorted positions

**Example:**
```javascript
import { processDeFiPositions } from '../utils/positionUtils'

const processed = processDeFiPositions(mockDeFiPositions)
```

---

### `processDexPositions(positions)`

Convenience function that sorts DEX positions by creation time.

**Parameters:**
- `positions` (Array): Array of DEX position objects

**Returns:**
- Array: Sorted positions

**Example:**
```javascript
import { processDexPositions } from '../utils/positionUtils'

const processed = processDexPositions(mockPositions)
```

## Data Format

Both DEX and DeFi positions should include a `createdAt` field as a Unix timestamp (milliseconds):

```javascript
{
  id: 101,
  protocol: 'Aethir Gaming Pool',
  createdAt: 1729245600000, // Unix timestamp in milliseconds
  tags: [
    { label: 'RWA', bg: '#2485c7', color: '#000000' }
  ],
  // ... other fields
}
```

## Usage in Components

The `Homepage` component automatically processes positions before rendering:

```javascript
import { processDexPositions, processDeFiPositions } from '../utils/positionUtils'

export default function Homepage() {
  const sortedDexPositions = processDexPositions(mockPositions)
  const sortedDeFiPositions = processDeFiPositions(mockDeFiPositions)
  
  // Render sorted and tagged positions
}
```

## Notes

- The 7-day threshold is calculated from the current timestamp
- All date comparisons use Unix timestamps (milliseconds)
- Positions without a `createdAt` field default to 0 (epoch)
- The utility functions do not mutate the original data; they return new arrays
