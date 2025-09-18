import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-20 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Budgeting that feels <span className="text-pigeon-600">effortless</span>.
          </h1>
          <p className="mt-4 text-gray-600 dark:text-slate-300">
            Automatic categorisation, clear insights, and goals you actually reach—built for students and young families.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/dashboard" className="px-5 py-3 rounded-xl bg-pigeon-500 text-white">Open the App</Link>
            <a href="#features" className="px-5 py-3 rounded-xl bg-white border">Learn more</a>
          </div>
          <p className="mt-6 italic text-gray-500">
            “Our family uses Pigeon Budget — simple and effective.” — Jason & Sarah
          </p>
        </div>

        <div className="card card-hover p-6">
          <img className="rounded-xl" alt="dashboard"
               src="https://images.unsplash.com/photo-1553729784-e91953dec042?q=80&w=1200&auto=format&fit=crop" />
        </div>
      </section>

      <section id="features" className="border-t bg-white dark:bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-4 gap-6">
          {[
            ['🤖','Auto Categorisation','Explainable rules that learn your merchants.'],
            ['📊','Budgets','Know where you stand—no surprises.'],
            ['🎯','Goals','Small steps add up to big wins.'],
            ['👨‍👩‍👧','Family-ready','Shared categories (coming soon).'],
          ].map(([icon,title,desc])=> (
            <div key={String(title)} className="card p-6 card-hover">
              <div className="text-2xl">{icon}</div>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-slate-300 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
