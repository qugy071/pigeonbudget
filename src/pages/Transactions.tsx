import { useMemo, useState } from 'react'
import { load, save } from '../utils/storage'
import { autoCategory, ALL_CATS, type Category } from '../utils/rules'

type TxType = 'expense' | 'income'
type Tx = { id:string; date:string; merchant:string; amount:number; category:Category; type:TxType }

const KEY = 'pb_tx'

export default function Transactions(){
  const [tx, setTx] = useState<Tx[]>(() => load<Tx[]>(KEY, []))
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<'all'|Category>('all')
  const [type, setType] = useState<'all'|TxType>('all')
  const [sort, setSort] = useState<'date-desc'|'date-asc'|'amt-desc'|'amt-asc'>('date-desc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [undoBin, setUndoBin] = useState<Tx[]|null>(null)

  function saveTx(next:Tx[]){ setTx(next); save(KEY, next) }

  // 添加交易（含一键自动分类）
  function add(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const date = String(fd.get('date'))
    const merchant = String(fd.get('merchant'))
    const rawAmt = Number(fd.get('amount'))
    const ttype = String(fd.get('type')) as TxType
    let category = String(fd.get('category')) as Category

    if(!merchant || !rawAmt) return alert('Please enter merchant and amount')

    if(category === 'Other' && merchant){
      const { category: c, why } = autoCategory(merchant)
      category = c
      alert(`Auto-categorised as ${c} — ${why}`)
    }

    const signed = ttype === 'income' ? Math.abs(rawAmt) : -Math.abs(rawAmt)
    const row: Tx = { id: crypto.randomUUID(), date, merchant, amount: signed, category, type: ttype }
    saveTx([row, ...tx])
    e.currentTarget.reset()
  }

  // 过滤 + 排序
  const view = useMemo(()=> {
    let list = tx.filter(t =>
      (!q || t.merchant.toLowerCase().includes(q.toLowerCase())) &&
      (cat==='all' || t.category===cat) &&
      (type==='all' || t.type===type)
    )
    list = list.sort((a,b)=>{
      switch(sort){
        case 'date-asc': return a.date.localeCompare(b.date)
        case 'date-desc': return b.date.localeCompare(a.date)
        case 'amt-asc': return Math.abs(a.amount) - Math.abs(b.amount)
        case 'amt-desc': return Math.abs(b.amount) - Math.abs(a.amount)
      }
    })
    return list
  }, [tx,q,cat,type,sort])

  // 批量删除 & 撤销
  function bulkDelete(){
    const ids = Array.from(selected)
    if(ids.length===0) return
    const bin = tx.filter(t=> ids.includes(t.id))
    const next = tx.filter(t=> !ids.includes(t.id))
    setUndoBin(bin); setSelected(new Set()); saveTx(next)
  }
  function undo(){
    if(!undoBin) return
    saveTx([...undoBin, ...tx]); setUndoBin(null)
  }

  function toggle(id:string){
    const s = new Set(selected)
    s.has(id) ? s.delete(id) : s.add(id)
    setSelected(s)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Transactions</h1>

      {/* 控制条 */}
      <div className="mt-4 grid md:grid-cols-4 gap-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search merchant..." className="rounded-xl border px-3 py-2" />
        <select value={cat} onChange={e=>setCat(e.target.value as any)} className="rounded-xl border px-3 py-2">
          <option value="all">All categories</option>
          {ALL_CATS.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={type} onChange={e=>setType(e.target.value as any)} className="rounded-xl border px-3 py-2">
          <option value="all">All types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value as any)} className="rounded-xl border px-3 py-2">
          <option value="date-desc">Newest date</option>
          <option value="date-asc">Oldest date</option>
          <option value="amt-desc">Amount high→low</option>
          <option value="amt-asc">Amount low→high</option>
        </select>
      </div>

      {/* 批量操作 */}
      <div className="mt-3 flex gap-2">
        <button onClick={bulkDelete} className="px-3 py-1.5 rounded-xl border">Delete selected</button>
        <button onClick={undo} disabled={!undoBin} className="px-3 py-1.5 rounded-xl border disabled:opacity-50">Undo</button>
      </div>

      {/* 列表 */}
      <div className="card mt-4 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              <th className="p-3"><input type="checkbox" onChange={e=>{
                if(e.target.checked) setSelected(new Set(view.map(v=>v.id)))
                else setSelected(new Set())
              }}/></th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Merchant</th>
              <th className="text-left p-3">Category</th>
              <th className="text-right p-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {view.map(t=>(
              <tr key={t.id} className="border-t">
                <td className="p-3"><input type="checkbox" checked={selected.has(t.id)} onChange={()=>toggle(t.id)} /></td>
                <td className="p-3">{t.date}</td>
                <td className="p-3">{t.merchant}</td>
                <td className="p-3">{t.category}</td>
                <td className={`p-3 text-right ${t.amount>=0?'text-emerald-600':'text-rose-600'}`}>
                  {t.amount.toLocaleString(undefined,{style:'currency',currency:'AUD'})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 添加表单 */}
      <div className="card p-6 mt-6">
        <h2 className="font-semibold mb-3">Add transaction</h2>
        <form onSubmit={add} className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Date</label>
            <input name="date" type="date" defaultValue={new Date().toISOString().slice(0,10)} className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Type</label>
            <select name="type" className="mt-1 w-full rounded-xl border px-3 py-2">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-sm">Merchant</label>
            <input name="merchant" placeholder="e.g. Coles / 7-Eleven" className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Amount</label>
            <input name="amount" type="number" step="0.01" className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Category</label>
            <select name="category" defaultValue="Other" className="mt-1 w-full rounded-xl border px-3 py-2">
              {ALL_CATS.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <button className="w-full rounded-xl bg-pigeon-500 text-white py-2">Add</button>
          </div>
        </form>
      </div>
    </main>
  )
}
