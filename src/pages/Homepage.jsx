import { useState } from 'react'
import './Homepage.scss'
import logoGradient from '../assets/logo-gradient.svg'
import uniswapIcon from '../assets/uniswap-icon.svg'

const positionData = [
  {
    id: 1,
    pair: 'XAUT/USDC',
    version: 'v3',
    fee: '0.3%',
    huskAPY: '80.65%',
    tvl: '$15.77k',
    revenue24h: '$850',
    supplyAPY: '25%',
    liquidationLow: '4,000 USDC',
    liquidationHigh: '5,000 USDC',
    borrowRisk: '0.24'
  },
  {
    id: 2,
    pair: 'BTC/USDC',
    version: 'v4',
    fee: '0.3%',
    huskAPY: '56.65%',
    tvl: '$15.77k',
    revenue24h: '$850',
    supplyAPY: '13.44%',
    liquidationLow: '112.8k USDC',
    liquidationHigh: '115.8k USDC',
    borrowRisk: '0.67'
  },
  {
    id: 3,
    pair: 'ETH/USDC',
    version: 'v3',
    fee: '0.3%',
    huskAPY: '80.65%',
    tvl: '$15.77k',
    revenue24h: '$850',
    supplyAPY: '25%',
    liquidationLow: '4,000 USDC',
    liquidationHigh: '5,000 USDC',
    borrowRisk: '0.24'
  },
  {
    id: 4,
    pair: 'XAUT/USDC',
    version: 'v3',
    fee: '0.3%',
    huskAPY: '80.65%',
    tvl: '$15.77k',
    revenue24h: '$850',
    supplyAPY: '25%',
    liquidationLow: '4,000 USDC',
    liquidationHigh: '5,000 USDC',
    borrowRisk: '0.24'
  },
  {
    id: 5,
    pair: 'XAUT/USDC',
    version: 'v3',
    fee: '0.3%',
    huskAPY: '80.65%',
    tvl: '$15.77k',
    revenue24h: '$850',
    supplyAPY: '25%',
    liquidationLow: '4,000 USDC',
    liquidationHigh: '5,000 USDC',
    borrowRisk: '0.24'
  },
  {
    id: 6,
    pair: 'XAUT/USDC',
    version: 'v3',
    fee: '0.3%',
    huskAPY: '80.65%',
    tvl: '$15.77k',
    revenue24h: '$850',
    supplyAPY: '25%',
    liquidationLow: '4,000 USDC',
    liquidationHigh: '5,000 USDC',
    borrowRisk: '0.24'
  }
]

function DexPositionCard({ position }) {
  return (
    <div className="dex-position-card">
      <div className="card-background">
        <img src={uniswapIcon} alt="Uniswap" className="uniswap-icon" />
      </div>

      <div className="card-header">
        <div className="pair-info">
          <div className="pair-name">{position.pair}</div>
          <div className="pair-meta">{position.version} {position.fee}</div>
        </div>
        <div className="apy-info">
          <div className="apy-label">Husk APY</div>
          <div className="apy-value">{position.huskAPY}</div>
        </div>
      </div>

      <div className="card-grid">
        <div className="grid-item">
          <div className="grid-label">TVL</div>
          <div className="grid-value">{position.tvl}</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">24h rev.</div>
          <div className="grid-value">{position.revenue24h}</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">Liqd. Low Price</div>
          <div className="grid-value">{position.liquidationLow}</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">Liqd. High Price</div>
          <div className="grid-value">{position.liquidationHigh}</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">Supply APY</div>
          <div className="grid-value">{position.supplyAPY}</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">Borrow Risk</div>
          <div className="grid-value">{position.borrowRisk}</div>
        </div>
        <div className="button-item">
          <button className="action-button">Supply USDC</button>
        </div>
        <div className="button-item">
          <button className="action-button borrow-button">Borrow USDC</button>
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <img src={logoGradient} alt="Husk Finance" className="logo" />
          <span className="logo-text">Husk Finance</span>
        </div>

        <nav className="nav-links">
          <a href="#docs">Docs</a>
          <a href="#explore">Explore</a>
          <a href="#create">Create Husk</a>
        </nav>

        <button className="connect-button">Connect</button>
      </div>
    </header>
  )
}

export default function Homepage() {
  return (
    <div className="homepage">
      <Header />

      <section className="hero-section">
        <h1>Welcome to decentralized positive-sum game of crypto.</h1>
        <p>Your journey of non-extractive profitable business starts here.</p>
      </section>

      <section className="positions-section">
        <h2>DEX Position Market</h2>
        <div className="positions-grid">
          {positionData.map((position) => (
            <DexPositionCard key={position.id} position={position} />
          ))}
        </div>
      </section>
    </div>
  )
}
