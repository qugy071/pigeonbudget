import { useState } from 'react'
import { load, save } from '../utils/storage'
import { ALL_CATS, type Category } from '../utils/rules'
import type { } from 'react' // keep tsx

type Budget = { id:string; category:Category; amount:number }
type Tx = { category:Category; amount:number; type:'expense'|'income' }

const KEY = 'pb_budgets'
const TX_KEY = 'pb_tx'

export default function Budgets(){
  const [budgets, setBudgets] = useState<Budget[]>(() => load(KEY, [] as Budget[]))
  const tx:Tx[] = load(TX_KEY, [] as Tx[])

  function upsert(b:Budget){
    const i = budgets.findIndex(x=>x.id===b.id)
    const arr = [...budgets]
    if(i>=0) arr[i] = b; else arr.unshift(b)
    setBudgets(arr); save(KEY, arr)
  }

  function usedOf(cat:Category){
    return tx.filter(t=> t.category===cat && t.type==='expense').reduce((a,b)=> a + Math.abs(b.amount), 0)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Budgets</h1>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div className="card p-6">
          <h2 className="font-semibold">Set / Update budget</h2>
          <form onSubmit={e=>{
            e.preventDefault()
            const fd = new FormData(e.currentTarget as HTMLFormElement)
            const category = fd.get('category') as Category
            const amount = Number(fd.get('amount'))
            upsert({ id:`b-${category}`, category, amount })
            ;(e.currentTarget as HTMLFormElement).reset()
          }} className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Category</label>
              <select name="category" className="mt-1 w-full rounded-xl border px-3 py-2">
                {ALL_CATS.map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm">Monthly Budget</label>
              <input name="amount" type="number" step="0.01" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
            <div className="col-span-2">
              <button className="w-full rounded-xl bg-pigeon-500 text-white py-2">Save</button>
            </div>
          </form>
        </div>

        <div className="space-y-3">
          {budgets.map(b=>{
            const used = usedOf(b.category)
            const ratio = Math.min(100, Math.round((used / (b.amount||1)) * 100))
            const over = used > b.amount
            return (
              <div key={b.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{b.category}</div>
                  <div className={over? 'text-rose-600':'text-gray-600'}>{ratio}% used</div>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${over?'bg-rose-500':'bg-pigeon-500'}`} style={{width: ratio+'%'}} />
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  ${used.toFixed(2)} / ${b.amount.toFixed(2)} {over && <b className="text-rose-600 ml-1">Over budget!</b>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
