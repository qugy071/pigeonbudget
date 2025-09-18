import { useMemo, useState } from 'react'
import { load, save } from '../utils/storage'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts'

type TxType = 'expense' | 'income'
type Category = 'Groceries' | 'Dining' | 'Transport' | 'Entertainment' | 'Bills' | 'Rent' | 'Salary' | 'Other'
interface Tx { id: string; date: string; merchant: string; amount: number; category: Category; type: TxType }

const COLORS = ['#3fbf89','#66cda2','#99e0c1','#c6eedb','#23835c','#1f694c','#1b5740']
const CATS: Category[] = ['Groceries','Dining','Transport','Entertainment','Bills','Rent','Salary','Other']

export default function Dashboard(){
  const [tx, setTx] = useState<Tx[]>(() => load<Tx[]>('pb_tx', [
    { id:'t1', date:new Date().toISOString().slice(0,10), merchant:'Coles',        amount:-56.2, category:'Groceries',   type:'expense' },
    { id:'t2', date:new Date().toISOString().slice(0,10), merchant:'Employer Pty', amount:1200,  category:'Salary',      type:'income' },
    { id:'t3', date:new Date().toISOString().slice(0,10), merchant:'PTV',          amount:-9.2,  category:'Transport',   type:'expense' },
  ]))

  function add(form: {date:string; type:TxType; merchant:string; amount:string; category:Category}){
    const id = crypto.randomUUID()
    const signed = form.type === 'income' ? Math.abs(+form.amount) : -Math.abs(+form.amount)
    const row: Tx = { id, date:form.date, merchant:form.merchant, amount:signed, category:form.category, type:form.type }
    const next = [row, ...tx]
    setTx(next); save('pb_tx', next)
  }
  function remove(id: string){
    const next = tx.filter(t => t.id !== id)
    setTx(next); save('pb_tx', next)
  }

  const summary = useMemo(() => {
    const income  = tx.filter(t=>t.type==='income').reduce((a,b)=>a+b.amount,0)
    const expense = tx.filter(t=>t.type==='expense').reduce((a,b)=>a+Math.abs(b.amount),0)
    return { income, expense, net: income - expense }
  }, [tx])

  const daily = useMemo(() => {
    const days: Record<string, number> = {}
    for(const t of tx){
      const k = t.date
      const v = t.type === 'income' ? t.amount : -Math.abs(t.amount)
      days[k] = (days[k] || 0) + v
    }
    return Object.entries(days).map(([date, value]) => ({ date, value }))
  }, [tx])

  const byCat = useMemo(() => {
    const m = new Map<string, number>()
    for(const t of tx){ if(t.type==='expense'){ m.set(t.category, (m.get(t.category)||0) + Math.abs(t.amount)) } }
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }))
  }, [tx])

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="grid md:grid-cols-3 gap-6 mt-4">
        <div className="card p-6"><div className="text-sm text-gray-500">Income</div><div className="text-2xl font-bold">
          {summary.income.toLocaleString(undefined,{style:'currency',currency:'AUD'})}
        </div></div>
        <div className="card p-6"><div className="text-sm text-gray-500">Expense</div><div className="text-2xl font-bold">
          {summary.expense.toLocaleString(undefined,{style:'currency',currency:'AUD'})}
        </div></div>
        <div className="card p-6"><div className="text-sm text-gray-500">Net</div><div className={`text-2xl font-bold ${summary.net>=0?'text-emerald-600':'text-rose-600'}`}>
          {summary.net.toLocaleString(undefined,{style:'currency',currency:'AUD'})}
        </div></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-3">Daily Net Flow</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date"/><YAxis/><Tooltip/>
                <Line type="monotone" dataKey="value" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold mb-3">Expenses by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCat} dataKey="value" nameKey="name" outerRadius={100}>
                  {byCat.map((_,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-3">Add Transaction</h2>
          <TxForm onAdd={add} />
        </div>
        <div className="card p-0 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-slate-700">
              <tr>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Merchant</th>
                <th className="text-left p-3">Category</th>
                <th className="text-right p-3">Amount</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {tx.map(t=> (
                <tr key={t.id} className="border-t">
                  <td className="p-3">{t.date}</td>
                  <td className="p-3">{t.merchant}</td>
                  <td className="p-3">{t.category}</td>
                  <td className={`p-3 text-right ${t.amount>=0?'text-emerald-600':'text-rose-600'}`}>
                    {t.amount.toLocaleString(undefined,{style:'currency',currency:'AUD'})}
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-sm text-rose-600" onClick={()=>remove(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

function TxForm({ onAdd }: { onAdd: (form: {date:string; type:TxType; merchant:string; amount:string; category:Category}) => void }){
  const [date,setDate] = useState<string>(()=> new Date().toISOString().slice(0,10))
  const [type,setType] = useState<TxType>('expense')
  const [merchant,setMerchant] = useState<string>('Coles')
  const [amount,setAmount] = useState<string>('12.50')
  const [category,setCategory] = useState<Category>('Groceries')

  function submit(e: React.FormEvent){
    e.preventDefault()
    if(!merchant || !amount) return alert('Please enter merchant and amount')
    onAdd({ date, type, merchant, amount, category })
    setMerchant(''); setAmount(''); setCategory('Other')
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-sm">Date</label>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
      </div>
      <div>
        <label className="text-sm">Type</label>
        <select value={type} onChange={e=>setType(e.target.value as TxType)} className="mt-1 w-full rounded-xl border px-3 py-2">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className="col-span-2">
        <label className="text-sm">Merchant</label>
        <input value={merchant} onChange={e=>setMerchant(e.target.value)} placeholder="e.g. Coles" className="mt-1 w-full rounded-xl border px-3 py-2" />
      </div>
      <div>
        <label className="text-sm">Amount</label>
        <input type="number" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
      </div>
      <div>
        <label className="text-sm">Category</label>
        <select value={category} onChange={e=>setCategory(e.target.value as Category)} className="mt-1 w-full rounded-xl border px-3 py-2">
          {CATS.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="col-span-2 mt-2">
        <button className="w-full rounded-xl bg-pigeon-500 text-white py-2">Add</button>
      </div>
    </form>
  )
}
