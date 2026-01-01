import './App.scss'

import { Route, Routes } from 'react-router-dom'

import MainLayout from './components/layout/MainLayout'
import DashboardPage from './pages/DashboardPage'
import ExplorePage from './pages/ExplorePage'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/explore" element={<ExplorePage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
