import PropTypes from 'prop-types'

import { GRID_LABELS } from '../../constants'
import { formatCompactNumber, formatPercent } from '../../utils/positionUtils'
import GenericTable from '../common/GenericTable'
import Tag from '../common/Tag'

import { TableActionButtons } from './TableComponents'

export default function BusinessPositionTable({ positions, onSupplyClick, onProvideClick }) {
  const columns = [
    {
      key: 'businessName',
      header: 'Business',
      sortable: true,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={row.businessImage}
            alt={row.businessName}
            style={{
              width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover',
            }}
          />
          <span>{row.businessName}</span>
        </div>
      ),
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
      header: 'TVL',
      sortable: true,
      render: (row) => `$${formatCompactNumber(row.tvl)}`,
    },
    {
      key: 'mcap',
      header: 'Market Cap',
      sortable: true,
      render: (row) => `$${formatCompactNumber(row.mcap)}`,
    },
    {
      key: 'revenue30d',
      header: '30d rev.',
      sortable: true,
      render: (row) => `$${formatCompactNumber(row.revenue30d)}`,
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

BusinessPositionTable.propTypes = {
  positions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    businessName: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      bg: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })),
    huskAPY: PropTypes.string.isRequired,
    tvl: PropTypes.string.isRequired,
    mcap: PropTypes.string.isRequired,
    revenue30d: PropTypes.string.isRequired,
    distribution: PropTypes.string.isRequired,
    nextDistribution: PropTypes.string.isRequired,
    supplyAPY: PropTypes.string.isRequired,
    participationRisk: PropTypes.string.isRequired,
  })).isRequired,
  onSupplyClick: PropTypes.func.isRequired,
  onProvideClick: PropTypes.func.isRequired,
}
