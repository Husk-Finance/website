import PropTypes from 'prop-types'
import './ViewToggle.scss'

export default function ViewToggle({ view, onViewChange }) {
  return (
    <div className="view-toggle" role="group" aria-label="View mode selection">
      <button
        type="button"
        className={`toggle-button ${view === 'grid' ? 'active' : ''}`}
        onClick={() => onViewChange('grid')}
        aria-pressed={view === 'grid'}
        aria-label="Grid view"
        title="Grid view"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <rect x="2" y="2" width="7" height="7" rx="1" />
          <rect x="11" y="2" width="7" height="7" rx="1" />
          <rect x="2" y="11" width="7" height="7" rx="1" />
          <rect x="11" y="11" width="7" height="7" rx="1" />
        </svg>
      </button>
      <button
        type="button"
        className={`toggle-button ${view === 'table' ? 'active' : ''}`}
        onClick={() => onViewChange('table')}
        aria-pressed={view === 'table'}
        aria-label="Table view"
        title="Table view"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <rect x="2" y="3" width="16" height="2" rx="1" />
          <rect x="2" y="8" width="16" height="2" rx="1" />
          <rect x="2" y="13" width="16" height="2" rx="1" />
        </svg>
      </button>
    </div>
  )
}

ViewToggle.propTypes = {
  view: PropTypes.oneOf(['grid', 'table']).isRequired,
  onViewChange: PropTypes.func.isRequired,
}
