import { useMemo } from 'react'
import { load } from '../utils/storage'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

type Tx = { date:string; amount:number; type:'expense'|'income'; category:string }
const COLORS = ['#3fbf89','#66cda2','#99e0c1','#c6eedb','#23835c','#1f694c','#1b5740']
const AXIS_TICK = '#cbd5e1'  // slate-300（深色下可见）
const AXIS_LINE = '#94a3b8'  // slate-400

export default function Insights(){
  const tx:Tx[] = load('pb_tx', [] as Tx[])

  const byCategory = useMemo(()=> {
    const m = new Map<string, number>()
    for(const t of tx){ if(t.type==='expense') m.set(t.category, (m.get(t.category)||0) + Math.abs(t.amount)) }
    return Array.from(m.entries()).map(([name,value])=>({ name, value }))
  }, [tx])

  const dailyExpense = useMemo(()=> {
    const d: Record<string, number> = {}
    for(const t of tx){ if(t.type==='expense'){ d[t.date] = (d[t.date]||0) + Math.abs(t.amount) } }
    return Object.entries(d).map(([date,total])=>({ date, total }))
  }, [tx])

  const quick = useMemo(()=> {
    if(tx.length<2) return 'Add a few transactions to see insights.'
    const expenses = tx.filter(t=>t.type==='expense')
    if(expenses.length<2) return 'Add more expenses to unlock insights.'
    const total = expenses.reduce((a,b)=>a+Math.abs(b.amount),0)
    const max = expenses.reduce((m,t)=> Math.max(m, Math.abs(t.amount)), 0)
    return `This period: ${expenses.length} expenses, total $${total.toFixed(2)}. Largest single expense: $${max.toFixed(2)}.`
  }, [tx])

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Insights</h1>
      <p className="mt-2 text-sm text-gray-600">{quick}</p>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div className="card p-6">
          <h2 className="font-semibold mb-3">Expenses by Category</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="value" data={byCategory} outerRadius={100}>
                  {byCategory.map((_,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-3">Daily Expenses</h2>
          <div className="h-72">
           <ResponsiveContainer>
  <BarChart data={dailyExpense}>
    <CartesianGrid stroke="rgba(148,163,184,.25)" /> {/* 网格线：slate-400 的 25% 透明 */}
    <XAxis
      dataKey="date"
      tick={{ fill: AXIS_TICK, fontSize: 12 }}
      stroke={AXIS_LINE}
    />
    <YAxis
      tick={{ fill: AXIS_TICK, fontSize: 12 }}
      stroke={AXIS_LINE}
    />
    <Tooltip
      contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
      labelStyle={{ color: '#64748b' }}
    />
    <Bar dataKey="total" fill="#3fbf89" /> 
  </BarChart>
</ResponsiveContainer>

          </div>
        </div>
      </div>
    </main>
  )
}
