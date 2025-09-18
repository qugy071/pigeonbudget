// src/pages/Goals.tsx
import { useState } from 'react'
import { load, save } from '../utils/storage'

type Goal = {
  id: string
  name: string
  targetAmount: number
  targetDate: string   // YYYY-MM-DD
  savedAmount: number
}

const KEY = 'pb_goals'

export default function Goals(){
  const [goals, setGoals] = useState<Goal[]>(() =>
    load(KEY, [] as Goal[])
  )

  function persist(next: Goal[]) {
    setGoals(next)
    save(KEY, next)
  }

  function upsert(g: Goal){
    const i = goals.findIndex(x => x.id === g.id)
    const arr = [...goals]
    if (i >= 0) arr[i] = g
    else arr.unshift(g)
    persist(arr)
  }

  function remove(id: string){
    const arr = goals.filter(g => g.id !== id)
    persist(arr)
  }

  function perMonth(g: Goal){
    const months = Math.max(
      1,
      Math.ceil(
        (new Date(g.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
      )
    )
    return (g.targetAmount - g.savedAmount) / months
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Savings Goals</h1>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        {/* 左侧：创建/更新目标表单 */}
        <div className="card p-6">
          <h2 className="font-semibold">Create / Update goal</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget as HTMLFormElement)
              const g: Goal = {
                id: String(fd.get('id')) || crypto.randomUUID(),
                name: String(fd.get('name') || ''),
                targetAmount: Number(fd.get('targetAmount') || 0),
                targetDate: new Date(String(fd.get('targetDate'))).toISOString().slice(0, 10),
                savedAmount: Number(fd.get('savedAmount') || 0),
              }
              upsert(g)
              ;(e.currentTarget as HTMLFormElement).reset()
            }}
            className="mt-4 grid grid-cols-2 gap-3"
          >
            <input type="hidden" name="id" />

            <div className="col-span-2">
              <label className="text-sm">Name</label>
              <input name="name" className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>

            <div>
              <label className="text-sm">Target Amount</label>
              <input
                name="targetAmount"
                type="number"
                step="0.01"
                className="mt-1 w-full rounded-xl border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm">Target Date</label>
              <input
                name="targetDate"
                type="date"
                className="mt-1 w-full rounded-xl border px-3 py-2"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm">Saved So Far</label>
              <input
                name="savedAmount"
                type="number"
                step="0.01"
                className="mt-1 w-full rounded-xl border px-3 py-2"
              />
            </div>

            <div className="col-span-2 mt-2">
              <button className="w-full rounded-xl bg-pigeon-500 text-white py-2">
                Save
              </button>
            </div>
          </form>
        </div>

        {/* 右侧：目标卡片列表（含 Add Saved 快捷按钮 + 自定义输入 + 删除） */}
        <div className="space-y-3">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              g={g}
              perMonth={perMonth}
              onUpsert={upsert}
              onDelete={()=>{
                if (confirm(`Delete goal “${g.name}”? This cannot be undone.`)) {
                  remove(g.id)
                }
              }}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

/** 单个目标卡片（带本地输入状态） */
function GoalCard({
  g,
  perMonth,
  onUpsert,
  onDelete,
}: {
  g: Goal
  perMonth: (g: Goal) => number
  onUpsert: (g: Goal) => void
  onDelete: () => void
}) {
  const [custom, setCustom] = useState<string>('') // 自定义金额输入框

  const pct = g.targetAmount > 0
    ? Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100))
    : 0
  const monthly = perMonth(g)

  function addSaved(extra: number){
    if (!Number.isFinite(extra) || extra === 0) return
    const updated: Goal = { ...g, savedAmount: g.savedAmount + extra }
    onUpsert(updated)
  }

  function submitCustom(){
    const val = Number(custom)
    if (!val) return
    addSaved(val)
    setCustom('')
  }

  return (
    <div className="card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{g.name}</div>
        <div className="flex items-center gap-3">
          <div className="text-gray-600">{pct}%</div>
          {/* 删除按钮 */}
          <button
            onClick={onDelete}
            className="px-2 py-1 rounded-lg bg-rose-100 text-rose-700 text-xs hover:bg-rose-200"
            title="Delete goal"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-pigeon-500" style={{ width: pct + '%' }} />
      </div>

      <div className="text-sm text-gray-600">
        ${g.savedAmount.toFixed(2)} / ${g.targetAmount.toFixed(2)}
      </div>

      <div className="text-sm">
        Suggested monthly save: <b>${monthly.toFixed(2)}</b>
      </div>

      {/* 快捷更新按钮 */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {[50, 100, 500].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => addSaved(val)}
            className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-sm hover:bg-emerald-600"
          >
            +${val}
          </button>
        ))}

        {/* 自定义金额输入 + 添加按钮 */}
        <div className="flex items-center gap-2 ml-auto">
          <input
            type="number"
            step="0.01"
            placeholder="Custom"
            value={custom}
            onChange={e=>setCustom(e.target.value)}
            className="w-28 rounded-lg border px-3 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={submitCustom}
            className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
