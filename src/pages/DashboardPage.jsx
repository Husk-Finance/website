import './DashboardPage.scss'

import { useState } from 'react'

import ViewToggle from '../components/common/ViewToggle'
import { DexPositionCard } from '../components/positions'
import DexPositionTable from '../components/positions/DexPositionTable'
import { mockPositions } from '../data/mockPositions'

const DashboardPage = () => {
    const [view, setView] = useState('grid')

    // Mock data for dashboard stats
    const stats = {
        totalBalance: '$12,450.00',
        totalAPR: '14.5%',
    }

    // Use a subset of mock positions to simulate "My Positions"
    const myPositions = mockPositions.slice(0, 3)

    return (
        <div className="dashboard-page">
            <section className="hero-section">
                <h1>Dashboard</h1>
            </section>

            <section className="stats-section">
                <div className="stat-card">
                    <h3>Total Balance</h3>
                    <p className="value">{stats.totalBalance}</p>
                </div>
                <div className="stat-card">
                    <h3>Total APY</h3>
                    <p className="value">{stats.totalAPR}</p>
                </div>
            </section>

            <section className="positions-section">
                <div className="section-header">
                    <h2>My Positions</h2>
                    <ViewToggle view={view} onViewChange={setView} />
                </div>

                {view === 'grid' ? (
                    <div className="positions-grid">
                        {myPositions.map((position) => (
                            <DexPositionCard
                                key={position.id}
                                position={position}
                                // Mock handlers for now
                                onSupplyClick={() => { }}
                                onProvideClick={() => { }}
                            />
                        ))}
                    </div>
                ) : (
                    <DexPositionTable
                        positions={myPositions}
                        onSupplyClick={() => { }}
                        onProvideClick={() => { }}
                    />
                )}
            </section>
        </div>
    )
}

export default DashboardPage
