import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import './PositionTable.scss'
import { GRID_LABELS } from '../../constants'
import {
  getQuotedTokenSymbol,
  formatPercent,
  formatDollar,
  formatTokenAmount,
  getTokenDecimals,
} from '../../utils/positionUtils'

export default function DexPositionTable({ positions, onSupplyClick, onBorrowClick }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedPositions = useMemo(() => {
    if (!sortConfig.key) return positions

    const sorted = [...positions].sort((a, b) => {
      let aVal = a[sortConfig.key]
      let bVal = b[sortConfig.key]

      // Convert string numbers to actual numbers for proper sorting
      if (typeof aVal === 'string' && !isNaN(aVal)) {
        aVal = parseFloat(aVal)
      }
      if (typeof bVal === 'string' && !isNaN(bVal)) {
        bVal = parseFloat(bVal)
      }

      if (aVal < bVal) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })

    return sorted
  }, [positions, sortConfig])

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" opacity="0.3" aria-hidden="true">
          <path d="M6 3L8 6H4L6 3Z" />
          <path d="M6 9L4 6H8L6 9Z" />
        </svg>
      )
    }
    if (sortConfig.direction === 'asc') {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          <path d="M6 3L8 6H4L6 3Z" />
        </svg>
      )
    }
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
        <path d="M6 9L4 6H8L6 9Z" />
      </svg>
    )
  }

  return (
    <div className="position-table-container">
      <table className="position-table" role="table">
        <thead>
          <tr>
            <th>
              <button
                type="button"
                className="sort-button"
                onClick={() => handleSort('pair')}
                aria-label="Sort by pair"
              >
                Pair {getSortIcon('pair')}
              </button>
            </th>
            <th>
              <button
                type="button"
                className="sort-button"
                onClick={() => handleSort('protocol')}
                aria-label="Sort by protocol"
              >
                Protocol {getSortIcon('protocol')}
              </button>
            </th>
            <th>
              <button
                type="button"
                className="sort-button"
                onClick={() => handleSort('huskAPY')}
                aria-label="Sort by Husk APY"
              >
                {GRID_LABELS.huskAPY} {getSortIcon('huskAPY')}
              </button>
            </th>
            <th>
              <button
                type="button"
                className="sort-button"
                onClick={() => handleSort('tvl')}
                aria-label="Sort by TVL"
              >
                {GRID_LABELS.tvl} {getSortIcon('tvl')}
              </button>
            </th>
            <th>
              <button
                type="button"
                className="sort-button"
                onClick={() => handleSort('revenue24h')}
                aria-label="Sort by 24h revenue"
              >
                {GRID_LABELS.revenue24h} {getSortIcon('revenue24h')}
              </button>
            </th>
            <th>
              <button
                type="button"
                className="sort-button"
                onClick={() => handleSort('liquidationLow')}
                aria-label="Sort by liquidation low price"
              >
                {GRID_LABELS.liquidationLow} {getSortIcon('liquidationLow')}
              </button>
            </th>
            <th>
              <button
                type="button"
                className="sort-button"
                onClick={() => handleSort('liquidationHigh')}
                aria-label="Sort by liquidation high price"
              >
                {GRID_LABELS.liquidationHigh} {getSortIcon('liquidationHigh')}
              </button>
            </th>
            <th>
              <button
                type="button"
                className="sort-button"
                onClick={() => handleSort('supplyAPY')}
                aria-label="Sort by supply APY"
              >
                {GRID_LABELS.supplyAPY} {getSortIcon('supplyAPY')}
              </button>
            </th>
            <th>
              <button
                type="button"
                className="sort-button"
                onClick={() => handleSort('borrowRisk')}
                aria-label="Sort by borrow risk"
              >
                {GRID_LABELS.borrowRisk} {getSortIcon('borrowRisk')}
              </button>
            </th>
            <th className="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedPositions.map((position) => {
            const quotedToken = getQuotedTokenSymbol(position, 'supply')
            const quoteDecimals = getTokenDecimals(position.liquiditySupplierAsset)

            return (
              <tr key={position.id}>
                <td data-label="Pair">
                  <div className="pair-cell">
                    <strong>{position.pair}</strong>
                    <div className="pair-meta">
                      {position.version} {formatPercent(position.fee)}
                    </div>
                  </div>
                </td>
                <td data-label="Protocol">
                  {position.protocol.charAt(0).toUpperCase() + position.protocol.slice(1)}
                </td>
                <td data-label={GRID_LABELS.huskAPY}>{formatPercent(position.huskAPY)}</td>
                <td data-label={GRID_LABELS.tvl}>{formatDollar(position.tvl)}</td>
                <td data-label={GRID_LABELS.revenue24h}>{formatDollar(position.revenue24h)}</td>
                <td data-label={GRID_LABELS.liquidationLow}>
                  {formatTokenAmount(position.liquidationLow, quoteDecimals, quotedToken)}
                </td>
                <td data-label={GRID_LABELS.liquidationHigh}>
                  {formatTokenAmount(position.liquidationHigh, quoteDecimals, quotedToken)}
                </td>
                <td data-label={GRID_LABELS.supplyAPY}>{formatPercent(position.supplyAPY)}</td>
                <td data-label={GRID_LABELS.borrowRisk}>{formatPercent(position.borrowRisk)}</td>
                <td data-label="Actions">
                  <div className="actions-cell">
                    <button
                      type="button"
                      className="action-button supply"
                      onClick={() => onSupplyClick(position)}
                      aria-label={`Supply ${quotedToken} to ${position.pair}`}
                    >
                      Supply {quotedToken}
                    </button>
                    <button
                      type="button"
                      className="action-button borrow"
                      onClick={() => onBorrowClick(position)}
                      aria-label={`Borrow ${quotedToken} from ${position.pair}`}
                    >
                      Borrow {quotedToken}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

DexPositionTable.propTypes = {
  positions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      pair: PropTypes.string.isRequired,
      protocol: PropTypes.string.isRequired,
      version: PropTypes.string.isRequired,
      fee: PropTypes.string.isRequired,
      huskAPY: PropTypes.string.isRequired,
      tvl: PropTypes.string.isRequired,
      revenue24h: PropTypes.string.isRequired,
      liquidationLow: PropTypes.string.isRequired,
      liquidationHigh: PropTypes.string.isRequired,
      supplyAPY: PropTypes.string.isRequired,
      borrowRisk: PropTypes.string.isRequired,
      liquiditySupplierAsset: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSupplyClick: PropTypes.func.isRequired,
  onBorrowClick: PropTypes.func.isRequired,
}
