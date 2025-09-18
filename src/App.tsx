// src/App.tsx
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Goals from './pages/Goals'
import Insights from './pages/Insights'
import Upgrade from './pages/Upgrade'

function Header(){
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem('pb_dark') === '1')
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  const toggle = () => { const v = !dark; setDark(v); localStorage.setItem('pb_dark', v ? '1' : '0') }

  return (
    <header className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur dark:bg-slate-900/70">
      <div className="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-pigeon-500 text-white">🕊️</span>
          Pigeon Budget
        </Link>

        {/* 中部导航 */}
        <nav className="hidden lg:flex items-center gap-5 text-sm">
          <NavLink to="/" end className={({isActive})=> isActive? 'text-pigeon-700 font-semibold':'text-gray-600 dark:text-slate-200'}>Home</NavLink>
          <NavLink to="/dashboard" className={({isActive})=> isActive? 'text-pigeon-700 font-semibold':'text-gray-600 dark:text-slate-200'}>Dashboard</NavLink>
          <NavLink to="/transactions" className={({isActive})=> isActive? 'text-pigeon-700 font-semibold':'text-gray-600 dark:text-slate-200'}>Transactions</NavLink>
          <NavLink to="/budgets" className={({isActive})=> isActive? 'text-pigeon-700 font-semibold':'text-gray-600 dark:text-slate-200'}>Budgets</NavLink>
          <NavLink to="/goals" className={({isActive})=> isActive? 'text-pigeon-700 font-semibold':'text-gray-600 dark:text-slate-200'}>Goals</NavLink>
          <NavLink to="/insights" className={({isActive})=> isActive? 'text-pigeon-700 font-semibold':'text-gray-600 dark:text-slate-200'}>Insights</NavLink>
        </nav>

        {/* 右侧：主题切换 + Open App + Upgrade（最右） */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="px-3 py-1.5 rounded-xl bg-gray-900 text-white dark:bg-slate-200 dark:text-slate-900 text-sm"
          >
            {dark ? 'Light' : 'Dark'}
          </button>

          <Link to="/dashboard" className="px-3 py-1.5 rounded-xl bg-pigeon-500 text-white text-sm">
            Open App
          </Link>

          {/* 最右边的 Upgrade 按钮 */}
          <Link
            to="/upgrade"
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-sm hover:bg-amber-600"
            title="Upgrade to Premium"
          >
            Upgrade
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function App(){
  const loc = useLocation()
  const isHome = loc.pathname === '/'
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/upgrade" element={<Upgrade />} />
      </Routes>
      {isHome && (
        <footer className="border-t py-8 text-center text-sm text-gray-500 dark:text-slate-400">
          © {new Date().getFullYear()} Pigeon Budget
        </footer>
      )}
    </div>
  )
}
