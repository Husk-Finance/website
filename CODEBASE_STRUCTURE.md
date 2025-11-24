# Husk Finance - Codebase Structure

## 📁 Project Organization

This codebase is organized for team collaboration with clear separation of concerns:

```
src/
├── assets/              # Static assets (SVGs, images)
│   ├── logo-gradient.svg
│   └── uniswap-icon.svg
├── components/          # Reusable React components
│   ├── common/         # Shared components (buttons, inputs, etc.)
│   ├── layout/         # Layout components (header, footer, sidebar)
│   │   ├── Header.jsx
│   │   └── Header.scss
│   └── positions/      # Position-related components
│       ├── DexPositionCard.jsx
│       └── DexPositionCard.scss
├── constants/          # Application constants
│   └── index.js       # Centralized constants (labels, URLs, config)
├── data/              # Mock data and data utilities
│   └── mockPositions.js
├── pages/             # Page-level components
│   ├── Homepage.jsx
│   └── Homepage.scss
├── styles/            # Global styles and design system
│   ├── main.scss     # Global styles
│   └── variables.scss # Design tokens (colors, spacing, typography)
├── App.jsx            # Root application component
├── App.scss           # Root application styles
└── main.jsx           # Application entry point
```

## 🎨 Design System

### Variables (`src/styles/variables.scss`)
All design tokens are centralized in `variables.scss`:

- **Colors**: `$primary-bg`, `$text-primary`, `$border-color`, etc.
- **Spacing**: `$spacing-xs`, `$spacing-sm`, `$spacing-md`, `$spacing-lg`, `$spacing-xl`
- **Typography**: `$font-size-base`, `$font-size-lg`, `$letter-spacing-tight`
- **Gradients**: `$provide-button-gradient`, `$bg-gradient-*`
- **Breakpoints**: `$breakpoint-md` (768px), `$breakpoint-xl` (1200px)
- **Transitions**: `$transition-fast`, `$transition-normal`

### Usage Example
```scss
@use '../../styles/variables' as *;

.my-component {
  padding: $spacing-md;
  color: $text-primary;
  background: $card-bg;
}
```

## 📦 Component Structure

### Component Template
Each component follows this structure:

```jsx
import PropTypes from 'prop-types'
import './ComponentName.scss'
import { CONSTANTS } from '../../constants'

export default function ComponentName({ prop1, prop2 }) {
  return (
    <div className="component-name">
      {/* Component content */}
    </div>
  )
}

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
}
```

### Component Organization

1. **Layout Components** (`components/layout/`)
   - Shared layout elements (Header, Footer, Sidebar)
   - Should be reusable across multiple pages
   - Example: `Header.jsx`

2. **Feature Components** (`components/positions/`)
   - Domain-specific components
   - Organized by feature/domain
   - Example: `DexPositionCard.jsx`

3. **Common Components** (`components/common/`)
   - Reusable UI primitives (buttons, inputs, modals)
   - Framework for future common components

## 📊 Data Management

### Mock Data (`src/data/`)
Test data is centralized in the `data/` directory:

```javascript
// src/data/mockPositions.js
export const mockPositions = [
  { id: 1, pair: 'XAUT/USDC', ... },
  // ...
]
```

**Guidelines:**
- All mock data goes in `src/data/`
- Use descriptive names: `mockPositions`, `mockUsers`, etc.
- Document data structures with JSDoc comments
- Keep real API integration separate from mock data

## 🔧 Constants (`src/constants/index.js`)

Centralized configuration for:
- Navigation links
- Button labels
- Section titles
- Grid labels
- Layout constants
- Breakpoints

**Benefits:**
- Single source of truth
- Easy to update copy/labels
- Reduces magic strings in code
- Supports internationalization (i18n) in the future

## 🎯 Best Practices

### 1. Component Creation
```bash
# Create component directory
mkdir -p src/components/{category}/{ComponentName}

# Create component files
touch src/components/{category}/ComponentName.jsx
touch src/components/{category}/ComponentName.scss
```

### 2. Naming Conventions
- **Components**: PascalCase (`DexPositionCard.jsx`)
- **Files**: Match component name (`DexPositionCard.jsx`, `DexPositionCard.scss`)
- **CSS Classes**: kebab-case (`.dex-position-card`)
- **Constants**: SCREAMING_SNAKE_CASE (`NAV_LINKS`)
- **Variables**: camelCase (`mockPositions`)

### 3. Import Order
```jsx
// 1. External dependencies
import PropTypes from 'prop-types'

// 2. Component styles
import './ComponentName.scss'

// 3. Internal dependencies (assets, constants, data)
import logo from '../../assets/logo.svg'
import { CONSTANTS } from '../../constants'
import { mockData } from '../../data/mockData'
```

### 4. PropTypes Validation
Always add PropTypes to components that accept props:

```jsx
ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  onAction: PropTypes.func,
}
```

### 5. SCSS Organization
```scss
// Component styles
@use '../../styles/variables' as *;

.component-name {
  // Layout
  display: flex;
  padding: $spacing-md;
  
  // Visual
  background: $card-bg;
  border: 1px solid $border-color;
  
  // Nested elements
  .component-name__child {
    color: $text-primary;
  }
  
  // States
  &:hover {
    background: $card-bg-hover;
  }
  
  // Responsive
  @media (max-width: $breakpoint-md) {
    padding: $spacing-sm;
  }
}
```

## 🚀 Development Workflow

### Adding a New Component

1. **Plan the component**
   - Identify reusability (common vs. feature-specific)
   - Define props and PropTypes
   - Check if existing components can be reused

2. **Create component files**
   ```bash
   # Example: Creating a Button component
   touch src/components/common/Button.jsx
   touch src/components/common/Button.scss
   ```

3. **Implement component**
   - Write JSX structure
   - Add PropTypes validation
   - Create SCSS styles using design tokens
   - Import necessary constants

4. **Test component**
   - Visual testing in browser
   - Check responsive behavior
   - Verify PropTypes warnings

5. **Document component** (add JSDoc comments)
   ```jsx
   /**
    * Button component with gradient background
    * @param {string} label - Button text
    * @param {function} onClick - Click handler
    * @param {string} variant - 'primary' | 'secondary'
    */
   export default function Button({ label, onClick, variant = 'primary' }) {
     // ...
   }
   ```

### Adding New Constants

```javascript
// src/constants/index.js
export const NEW_SECTION = {
  title: 'Section Title',
  subtitle: 'Section Subtitle',
}
```

### Adding Mock Data

```javascript
// src/data/mockNewFeature.js
/**
 * Mock data for new feature testing
 */
export const mockNewFeature = [
  { id: 1, name: 'Item 1' },
  // ...
]
```

## 🔍 Code Review Checklist

- [ ] Component is in the correct directory
- [ ] PropTypes are defined and accurate
- [ ] Constants are used instead of hardcoded strings
- [ ] SCSS uses design tokens from `variables.scss`
- [ ] Component has a matching `.scss` file
- [ ] Imports are organized correctly
- [ ] Naming conventions are followed
- [ ] Responsive behavior is implemented
- [ ] No console errors or warnings
- [ ] Component is reusable and focused

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [SCSS Documentation](https://sass-lang.com/)
- [PropTypes Documentation](https://www.npmjs.com/package/prop-types)
- [Wagmi Documentation](https://wagmi.sh/)

## 🤝 Contributing

1. Follow the established structure
2. Use design tokens from `variables.scss`
3. Add PropTypes to all components
4. Keep components small and focused
5. Document complex logic with comments
6. Test responsive behavior
7. Update this README if adding new patterns

## 📝 Notes

- All components use modern React (functional components with hooks)
- SCSS uses modern `@use` syntax (not `@import`)
- Design system matches Figma designs
- Build is optimized with Terser for production
