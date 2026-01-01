import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import './MainLayout.scss'

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Header />
            <main className="content">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default MainLayout
