import PropTypes from 'prop-types'
import GenericTable from '../common/GenericTable'
import { GRID_LABELS } from '../../constants'
import {
  getQuotedTokenSymbol,
  formatPercent,
  formatDollar,
  formatTokenAmount,
  getTokenDecimals,
} from '../../utils/positionUtils'

export default function DexPositionTable({ positions, onSupplyClick, onBorrowClick }) {
  const columns = [
    {
      key: 'pair',
      header: 'Pair',
      sortable: true,
      render: (row) => (
        <div>
          <strong>{row.pair}</strong>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
            {row.version}
            {' '}
            {formatPercent(row.fee)}
          </div>
        </div>
      ),
    },
    {
      key: 'protocol',
      header: 'Protocol',
      sortable: true,
      render: (row) => (
        <span style={{ textTransform: 'capitalize' }}>{row.protocol}</span>
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
      key: 'liquidationLow',
      header: GRID_LABELS.liquidationLow,
      render: (row) => {
        const quotedToken = getQuotedTokenSymbol(row, 'supply')
        const quoteDecimals = getTokenDecimals(row.liquiditySupplierAsset)
        return formatTokenAmount(row.liquidationLow, quoteDecimals, quotedToken)
      },
    },
    {
      key: 'liquidationHigh',
      header: GRID_LABELS.liquidationHigh,
      render: (row) => {
        const quotedToken = getQuotedTokenSymbol(row, 'supply')
        const quoteDecimals = getTokenDecimals(row.liquiditySupplierAsset)
        return formatTokenAmount(row.liquidationHigh, quoteDecimals, quotedToken)
      },
    },
    {
      key: 'supplyAPY',
      header: GRID_LABELS.supplyAPY,
      sortable: true,
      render: (row) => formatPercent(row.supplyAPY),
    },
    {
      key: 'borrowRisk',
      header: GRID_LABELS.borrowRisk,
      sortable: true,
      render: (row) => formatPercent(row.borrowRisk),
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
              Supply
              {' '}
              {quotedToken}
            </button>
            <button type="button" className="borrow-button" onClick={() => onBorrowClick(row)}>
              Borrow
              {' '}
              {quotedToken}
            </button>
          </div>
        )
      },
    },
  ]

  return <GenericTable data={positions} columns={columns} />
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
