import PropTypes from 'prop-types'
import './CardBase.scss'

export function CardContainer({ children, className = '', onClick }) {
  const props = {
    className: `card-container ${className}`,
    onClick,
  }

  if (onClick) {
    props.role = 'button'
    props.tabIndex = 0
  }

  return (
    <div {...props}>
      {children}
    </div>
  )
}

CardContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
}

export function CardGrid({ children }) {
  return <div className="card-grid">{children}</div>
}

CardGrid.propTypes = {
  children: PropTypes.node.isRequired,
}

export function CardGridItem({ label, value }) {
  return (
    <div className="grid-item">
      <div className="grid-label">{label}</div>
      <div className="grid-value">{value}</div>
    </div>
  )
}

CardGridItem.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
}

export function CardButtons({
  onSupply, onBorrow, supplyLabel = 'Supply', borrowLabel = 'Borrow',
}) {
  return (
    <>
      <div className="button-item">
        <button
          type="button"
          className="action-button"
          onClick={(e) => {
            e.stopPropagation()
            onSupply && onSupply(e)
          }}
        >
          {supplyLabel}
        </button>
      </div>
      <div className="button-item">
        <button
          type="button"
          className="action-button borrow-button"
          onClick={(e) => {
            e.stopPropagation()
            onBorrow && onBorrow(e)
          }}
        >
          {borrowLabel}
        </button>
      </div>
    </>
  )
}

CardButtons.propTypes = {
  onSupply: PropTypes.func,
  onBorrow: PropTypes.func,
  supplyLabel: PropTypes.node,
  borrowLabel: PropTypes.node,
}
