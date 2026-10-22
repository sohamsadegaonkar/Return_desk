const steps = [
  { number: "01", title: "Capture the request", detail: "Keep the customer, order, and item together in one clear record." },
  { number: "02", title: "Review with context", detail: "Follow the request through review, with notes alongside each decision." },
  { number: "03", title: "Record a resolution", detail: "Make the agreed refund, replacement, or store credit clear." },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-lg focus:bg-white focus:p-3">Skip to content</a>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-8">
          <span className="flex items-center gap-3 text-lg font-bold tracking-tight"><span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-xl bg-teal-800 text-white">↩</span>ReturnDesk</span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">Foundation preview</span>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <section aria-labelledby="intro-title">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">Customer care, carried through</p>
            <h1 id="intro-title" className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-6xl">A clearer path from return to resolution.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">One focused workspace for the details, decisions, and next steps behind every return.</p>
            <a href="#workspace-status" className="mt-8 inline-flex rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-800">View workspace status <span aria-hidden="true" className="ml-3">↓</span></a>
          </section>
          <aside id="workspace-status" aria-labelledby="status-title" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Workspace status</p>
            <h2 id="status-title" className="mt-4 text-2xl font-semibold tracking-tight">Taking shape.</h2>
            <p className="mt-3 leading-7 text-slate-600">The workspace is being built. Request creation, review, and resolution are not available yet.</p>
            <div className="mt-6 rounded-xl bg-teal-50 p-4 text-sm leading-6 text-teal-950">This preview does not collect customer data or process returns.</div>
          </aside>
        </div>
        <section aria-labelledby="workflow-title" className="mt-16 border-t border-slate-200 pt-8 sm:mt-24">
          <h2 id="workflow-title" className="text-sm font-semibold text-slate-700">The planned workflow</h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-3">
            {steps.map((step) => <li key={step.number} className="rounded-2xl border border-slate-200 bg-white p-6"><span className="text-sm font-semibold text-teal-700">{step.number}</span><h3 className="mt-4 text-lg font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{step.detail}</p></li>)}
          </ol>
        </section>
      </main>
      <footer className="mx-auto max-w-6xl px-5 pb-8 text-xs leading-6 text-slate-500 sm:px-8">ReturnDesk · A guided returns workspace</footer>
    </div>
  );
}
