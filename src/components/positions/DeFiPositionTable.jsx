import PropTypes from 'prop-types'
import GenericTable from '../common/GenericTable'
import Tag from '../common/Tag'
import { GRID_LABELS } from '../../constants'
import {
  getQuotedTokenSymbol, formatPercent, formatDollar,
} from '../../utils/positionUtils'

export default function DeFiPositionTable({ positions, onSupplyClick, onBorrowClick }) {
  const columns = [
    {
      key: 'protocol',
      header: 'Protocol',
      sortable: true,
      render: (row) => <strong>{row.protocol}</strong>,
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (row) => (
        <div className="tags-group-table">
          {row.tags && row.tags.map((tag) => (
            <Tag key={tag.label} tag={tag} />
          ))}
        </div>
      ),
    },
    {
      key: 'huskAPY',
      header: GRID_LABELS.huskAPY,
      sortable: true,
      render: (row) => formatPercent(row.huskAPY),
    },
    {
      key: 'tvl',
      header: GRID_LABELS.tvl,
      sortable: true,
      render: (row) => formatDollar(row.tvl),
    },
    {
      key: 'revenue24h',
      header: GRID_LABELS.revenue24h,
      sortable: true,
      render: (row) => formatDollar(row.revenue24h),
    },
    {
      key: 'distribution',
      header: 'Distribution',
      render: (row) => row.distribution,
    },
    {
      key: 'nextDistribution',
      header: 'Next Dist.',
      render: (row) => row.nextDistribution,
    },
    {
      key: 'supplyAPY',
      header: GRID_LABELS.supplyAPY,
      sortable: true,
      render: (row) => formatPercent(row.supplyAPY),
    },
    {
      key: 'participationRisk',
      header: GRID_LABELS.participationRisk,
      render: (row) => formatPercent(row.participationRisk),
    },
    {
      key: 'actions',
      header: '',
      className: 'actions-column',
      cellClassName: 'actions-cell',
      render: (row) => {
        const quotedToken = getQuotedTokenSymbol(row, 'supply')
        return (
          <div className="action-buttons">
            <button type="button" onClick={() => onSupplyClick(row)}>
              Supply {quotedToken}
            </button>
            <button type="button" className="borrow-button" onClick={() => onBorrowClick(row)}>
              Borrow {quotedToken}
            </button>
          </div>
        )
      },
    },
  ]

  return <GenericTable data={positions} columns={columns} />
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
