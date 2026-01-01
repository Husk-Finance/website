import './DashboardPage.scss'

import { useState } from 'react'

import ViewToggle from '../components/common/ViewToggle'
import { BusinessPositionCard, DeFiPositionCard, DexPositionCard } from '../components/positions'
import DexPositionTable from '../components/positions/DexPositionTable'
import { mockBusinessPositions } from '../data/mockBusinessPositions'
import { mockDeFiPositions } from '../data/mockDeFiPositions'
import { mockPositions } from '../data/mockPositions'

const DashboardPage = () => {
    const [view, setView] = useState('grid')

    // Mock data for dashboard stats
    const stats = {
        totalBalance: '$12,450.00',
        totalAPR: '14.5%',
    }

    // Use a subset of mock positions to simulate "My Positions"
    const myDexPositions = mockPositions.slice(0, 2)
    const myDeFiPositions = mockDeFiPositions.slice(0, 2)
    const myBusinessPositions = mockBusinessPositions.slice(0, 2)

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
                    <div className="positions-grid-container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#fff' }}>DEX Positions</h3>
                            <div className="positions-grid">
                                {myDexPositions.map((position) => (
                                    <DexPositionCard
                                        key={position.id}
                                        position={position}
                                        onSupplyClick={() => { }}
                                        onProvideClick={() => { }}
                                        variant="dashboard"
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#fff' }}>DeFi Positions</h3>
                            <div className="positions-grid">
                                {myDeFiPositions.map((position) => (
                                    <DeFiPositionCard
                                        key={position.id}
                                        position={position}
                                        onSupplyClick={() => { }}
                                        onProvideClick={() => { }}
                                        variant="dashboard"
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#fff' }}>Business Positions</h3>
                            <div className="positions-grid">
                                {myBusinessPositions.map((position) => (
                                    <BusinessPositionCard
                                        key={position.id}
                                        position={position}
                                        onSupplyClick={() => { }}
                                        onProvideClick={() => { }}
                                        variant="dashboard"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="table-view-placeholder">
                        <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>Table view is only available for DEX positions currently.</p>
                        <DexPositionTable
                            positions={myDexPositions}
                            onSupplyClick={() => { }}
                            onProvideClick={() => { }}
                        />
                    </div>
                )}
            </section>
        </div>
    )
}

export default DashboardPage
