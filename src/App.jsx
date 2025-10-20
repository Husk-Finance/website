import { useState } from 'react'
import './App.scss'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header>
        <h1>Husk Finance</h1>
        <p>React + Vite + SWC + SCSS + Wagmi</p>
      </header>
      <main>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
      </main>
    </div>
  )
}

export default App
