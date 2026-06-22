import { useEffect, useState } from 'react'
import { useLenis } from 'lenis/react'

const sections = [
  { id: 'what', n: '01', label: 'About' },
  { id: 'system', n: '02', label: 'System' },
  { id: 'principles', n: '03', label: 'Principles' },
  { id: 'framework', n: '04', label: 'Framework' },
  { id: 'workflows', n: '05', label: 'Workflows' },
  { id: 'references', n: '06', label: 'Reference' },
  { id: 'usage', n: '07', label: 'Use' },
]

const NAV_OFFSET = -72

export default function Nav() {
  // undefined when reduced-motion (Lenis isn't mounted) — we fall back to native.
  const lenis = useLenis()
  const [active, setActive] = useState('')

  // active-section tracking: whichever section sits in the middle band
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean)
    if (!els.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function go(e, target) {
    e.preventDefault()
    if (lenis) {
      lenis.scrollTo(target, { offset: NAV_OFFSET })
    } else {
      // reduced-motion / no-Lenis fallback
      if (target === 0) window.scrollTo(0, 0)
      else document.querySelector(target)?.scrollIntoView()
    }
  }

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 top-0 z-50 bg-paper border-b border-gray-2"
    >
      <div className="mx-auto w-full max-w-[var(--canvas-max)] px-6 md:px-8 h-14 md:h-16 flex items-center gap-6">
        {/* wordmark — back to top */}
        <a
          href="#top"
          onClick={(e) => go(e, 0)}
          className="shrink-0 flex items-baseline gap-2 leading-none"
        >
          <span className="text-base font-bold tracking-display">Swiss Design</span>
          <span className="hidden sm:inline text-caption font-medium uppercase tracking-[0.16em] text-gray-1">
            AI Agent Skill
          </span>
        </a>

        {/* section index — a flush, scrollable table-of-contents row */}
        <ul className="flex-1 flex items-center justify-end gap-4 md:gap-6 overflow-x-auto no-scrollbar">
          {sections.map((s) => {
            const isActive = active === s.id
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => go(e, `#${s.id}`)}
                  aria-current={isActive ? 'true' : undefined}
                  className={
                    'group flex items-baseline gap-1.5 text-caption font-medium uppercase tracking-[0.16em] transition-colors ' +
                    (isActive ? 'text-accent' : 'text-ink hover:text-accent')
                  }
                >
                  <span className="nums-tabular text-gray-1 group-hover:text-accent">
                    {s.n}
                  </span>
                  <span>{s.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
