import PropTypes from 'prop-types'

import { GRID_LABELS } from '../../constants'
import {
  formatDollar,
  formatPercent,
  formatTokenAmount,
  getQuotedTokenSymbol,
  getTokenDecimals,
} from '../../utils/positionUtils'
import { TableActionButtons } from './TableComponents'
import GenericTable from '../common/GenericTable'

export default function DexPositionTable({ positions, onSupplyClick, onProvideClick }) {
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
      key: 'supplyAPY',
      header: GRID_LABELS.supplyAPY,
      sortable: true,
      render: (row) => formatPercent(row.supplyAPY),
    },
    {
      key: 'provideAPY',
      header: GRID_LABELS.provideAPY,
      sortable: true,
      render: (row) => formatPercent(row.provideAPY),
    },
    {
      key: 'actions',
      header: '',
      className: 'actions-column',
      cellClassName: 'actions-cell',
      render: (row) => (
        <TableActionButtons
          position={row}
          onSupplyClick={onSupplyClick}
          onProvideClick={onProvideClick}
        />
      ),
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
      supplyAPY: PropTypes.string.isRequired,
      provideAPY: PropTypes.string.isRequired,
      liquiditySupplierAsset: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onSupplyClick: PropTypes.func.isRequired,
  onProvideClick: PropTypes.func.isRequired,
}
