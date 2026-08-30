import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from "react-router-dom";
import QuizzApp from './QuizzScreen';
import AdminApp from './adminScreen';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<QuizzApp />} />
        <Route path="/admin9234732699fdfdafda" element={<AdminApp />} />

      </Routes>
    </>
  )
}

export default App
