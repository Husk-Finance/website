import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import './PositionTable.scss'
import Tag from '../common/Tag'
import { GRID_LABELS } from '../../constants'
import {
  getQuotedTokenSymbol,
 formatPercent, formatDollar } from '../../utils/positionUtils'

export default function DeFiPositionTable({ positions, onSupplyClick, onBorrowClick }) {
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
                onClick={() => handleSort('protocol')}
                aria-label="Sort by protocol"
              >
                Protocol {getSortIcon('protocol')}
              </button>
            </th>
            <th>Tags</th>
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
                onClick={() => handleSort('distribution')}
                aria-label="Sort by distribution"
              >
                Distribution {getSortIcon('distribution')}
              </button>
            </th>
            <th>Next Distribution</th>
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
                onClick={() => handleSort('participationRisk')}
                aria-label="Sort by participation risk"
              >
                {GRID_LABELS.participationRisk} {getSortIcon('participationRisk')}
              </button>
            </th>
            <th className="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedPositions.map((position) => {
            const quotedToken = getQuotedTokenSymbol(position, 'supply')

            return (
              <tr key={position.id}>
                <td data-label="Protocol">
                  <strong>{position.protocol}</strong>
                </td>
                <td data-label="Tags">
                  {position.tags && position.tags.length > 0 && (
                    <div className="tags-cell">
                      {[...position.tags].reverse().map((tag) => (
                        <Tag key={tag.label} tag={tag} />
                      ))}
                    </div>
                  )}
                </td>
                <td data-label={GRID_LABELS.huskAPY}>{formatPercent(position.huskAPY)}</td>
                <td data-label={GRID_LABELS.tvl}>{formatDollar(position.tvl)}</td>
                <td data-label={GRID_LABELS.revenue24h}>{formatDollar(position.revenue24h)}</td>
                <td data-label="Distribution">{position.distribution}</td>
                <td data-label="Next Distribution">{position.nextDistribution}</td>
                <td data-label={GRID_LABELS.supplyAPY}>{formatPercent(position.supplyAPY)}</td>
                <td data-label={GRID_LABELS.participationRisk}>
                  {formatPercent(position.participationRisk)}
                </td>
                <td data-label="Actions">
                  <div className="actions-cell">
                    <button
                      type="button"
                      className="action-button supply"
                      onClick={() => onSupplyClick(position)}
                      aria-label={`Supply ${quotedToken} to ${position.protocol}`}
                    >
                      Supply {quotedToken}
                    </button>
                    <button
                      type="button"
                      className="action-button borrow"
                      onClick={() => onBorrowClick(position)}
                      aria-label={`Borrow ${quotedToken} from ${position.protocol}`}
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

DeFiPositionTable.propTypes = {
  positions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      protocol: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          bg: PropTypes.string,
          color: PropTypes.string,
        })
      ),
      huskAPY: PropTypes.string.isRequired,
      tvl: PropTypes.string.isRequired,
      revenue24h: PropTypes.string.isRequired,
      distribution: PropTypes.string.isRequired,
      nextDistribution: PropTypes.string.isRequired,
      supplyAPY: PropTypes.string.isRequired,
      participationRisk: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSupplyClick: PropTypes.func.isRequired,
  onBorrowClick: PropTypes.func.isRequired,
}
