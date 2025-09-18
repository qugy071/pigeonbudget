// src/pages/Upgrade.tsx
import { useEffect, useState } from 'react'

export default function Upgrade(){
  const [isPremium, setIsPremium] = useState<boolean>(() => localStorage.getItem('pb_premium') === '1')

  useEffect(()=> {
    // 仅用于演示，可在其它页面基于这个标志做 UI 变化
  }, [isPremium])

  function handleUpgrade(){
    // 本地模拟升级：写入 localStorage，然后给提示
    localStorage.setItem('pb_premium', '1')
    setIsPremium(true)
    alert('🎉 You are now Premium! Thanks for supporting Pigeon Budget.')
  }

  function handleDowngrade(){
    localStorage.removeItem('pb_premium')
    setIsPremium(false)
    alert('You have cancelled Premium. You can re-upgrade anytime.')
  }

  const features: Array<[string, string]> = [
    ['⚡ Priority Auto-Categorisation',
     'Smarter rules with merchant memory and per-merchant overrides that learn from your edits.'],
    ['📥 CSV Import & Export',
     'Bulk import from banks (CSV mapping helper) and export filtered transactions for tax or reports.'],
    ['👛 Multi-Accounts',
     'Track cash, debit, credit cards separately; switch or view combined totals instantly.'],
    ['👨‍👩‍👧 Family Sharing',
     'Invite family members to shared categories with individual permissions (view / add / edit).'],
    ['🔔 Smart Alerts',
     'Overspend warnings, bill reminders, and goal-at-risk notifications.'],
    ['💬 Priority Support',
     'Skip the queue with priority support and early access to new features.'],
  ]

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: pitch */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Go <span className="text-pigeon-600">Premium</span>
          </h1>
          <p className="mt-3 text-gray-600 dark:text-slate-300">
            Upgrade to unlock powerful automation and collaboration tools that help you save smarter.
          </p>

          <ul className="mt-6 space-y-3">
            {features.map(([title,desc])=>(
              <li key={title} className="flex gap-3">
                <div className="mt-1">✅</div>
                <div>
                  <div className="font-medium">{title}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-300">{desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: pricing card */}
        <div className="card p-6 card-hover">
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold">A$10</div>
            <div className="text-gray-500">/ month</div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Cancel anytime. Local demo — no real payment.</p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-pigeon-500 text-white text-xs">PRO</span>
              <span className="text-sm">All Free features, plus everything listed on the left</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-white text-xs">NEW</span>
              <span className="text-sm">Early access to upcoming experiments</span>
            </div>
          </div>

          {!isPremium ? (
            <button
              onClick={handleUpgrade}
              className="mt-6 w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white py-3 text-sm font-medium"
            >
              Upgrade now — A$10 / month
            </button>
          ) : (
            <div className="mt-6 space-y-3">
              <div className="rounded-xl border bg-emerald-50 text-emerald-700 dark:bg-emerald-600 dark:text-white px-4 py-3 text-sm font-medium">
  🎉 You are Premium. Enjoy all features!
</div>

              <button
                onClick={handleDowngrade}
                className="w-full rounded-xl border py-3 text-sm hover:bg-gray-50"
              >
                Cancel Premium
              </button>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-6">
            This is a high-fidelity local demo for coursework. The button sets a flag in <code>localStorage</code> to simulate subscription.
          </p>
        </div>
      </section>
    </main>
  )
}
