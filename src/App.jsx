import { useEffect } from 'react'
import Homepage from './pages/Homepage'
import './App.scss'
import { initializeOptimizations } from './utils/initOptimizations'

function App() {
  // Initialize RPC optimization system on app startup
  useEffect(() => {
    initializeOptimizations()
  }, [])

  return (
    <div className="app">
      <Homepage />
    </div>
  )
}

export default App
