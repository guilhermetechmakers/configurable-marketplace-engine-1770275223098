import { Link } from 'react-router-dom'
import { BookOpen, Mail, Twitter, Github, Linkedin } from 'lucide-react'

const footerLinks = [
  { to: '/help', label: 'Docs', icon: BookOpen },
  { to: '/help', label: 'Contact', icon: Mail },
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
]

const socialLinks = [
  { href: 'https://twitter.com', label: 'Twitter', icon: Twitter },
  { href: 'https://github.com', label: 'GitHub', icon: Github },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: Linkedin },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Marketplace. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
