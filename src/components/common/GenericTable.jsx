import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import './GenericTable.scss'

export default function GenericTable({
  data, columns, className = '',
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data

    const sorted = [...data].sort((a, b) => {
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
  }, [data, sortConfig])

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
    <div className={`position-table-container ${className}`}>
      <table className="position-table" role="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key || col.header} className={col.className}>
                {col.sortable ? (
                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSort(col.key)}
                    aria-label={`Sort by ${col.header}`}
                  >
                    {col.header}
                    {' '}
                    {getSortIcon(col.key)}
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((col) => (
                <td key={`${row.id || index}-${col.key || col.header}`} className={col.cellClassName}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

GenericTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    header: PropTypes.string.isRequired,
    render: PropTypes.func,
    sortable: PropTypes.bool,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
  })).isRequired,
  className: PropTypes.string,
}
