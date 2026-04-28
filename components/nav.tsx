import Link from 'next/link'
import { BrandLogo } from '@/components/brand-logo'

const links = [
  { href: '/', label: 'Overview' },
  { href: '/report', label: 'Daily report' },
  { href: '/settings', label: 'Settings' },
]

export function Nav() {
  return (
    <nav className="border-b border-brand-border bg-brand-surface/50 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <BrandLogo />
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-brand-muted transition-colors hover:bg-brand-border/30 hover:text-brand-fg"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
