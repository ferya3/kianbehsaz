import { getTranslations } from 'next-intl/server'
import type { SiteSetting } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { Link } from '@/lib/i18n/navigation'
import { Container } from '@/components/ui/Container'
import { NewsletterForm } from '@/components/shared/NewsletterForm'
import { FOOTER_NAV } from './navigation'

/**
 * The footer closes the page with the company's name at display size.
 *
 * On a dark site the footer is not a dumping ground — it is the last frame, so
 * it gets the same treatment as the hero: one huge piece of type, a hairline,
 * and the practical details underneath it.
 */
export async function SiteFooter({
  locale,
  settings,
}: {
  locale: Locale
  settings: SiteSetting | null
}) {
  const [t, tNav, tSite] = await Promise.all([
    getTranslations({ locale, namespace: 'Footer' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getTranslations({ locale, namespace: 'Site' }),
  ])

  const siteName = settings?.siteName || tSite('name')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-ink-950">
      <Container className="pt-20 pb-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink-50">{siteName}</h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              {settings?.tagline || t('companyBody')}
            </p>

            {settings?.social?.length ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {settings.social.map((profile) => (
                  <li key={profile.id ?? profile.url}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="label-mono border border-white/15 px-3 py-1.5 transition-colors hover:border-white/50 hover:text-ink-50"
                    >
                      {profile.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label={t('quickLinks')}>
            <h3 className="label-mono">{t('quickLinks')}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {FOOTER_NAV.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-300 transition-colors hover:text-ink-50"
                  >
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('resources')}>
            <h3 className="label-mono">{t('resources')}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {FOOTER_NAV.resources.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-300 transition-colors hover:text-ink-50"
                  >
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="label-mono">{t('contactTitle')}</h3>
            <address className="mt-5 space-y-2 text-sm not-italic text-ink-300">
              {settings?.address ? <p>{settings.address}</p> : null}
              {settings?.phones?.map((phone) => (
                <p key={phone.id ?? phone.number}>
                  <a
                    href={`tel:${phone.number}`}
                    dir="ltr"
                    className="font-mono transition-colors hover:text-ink-50"
                  >
                    {phone.number}
                  </a>
                </p>
              ))}
              {settings?.emails?.map((email) => (
                <p key={email.id ?? email.address}>
                  <a
                    href={`mailto:${email.address}`}
                    dir="ltr"
                    className="font-mono transition-colors hover:text-ink-50"
                  >
                    {email.address}
                  </a>
                </p>
              ))}
            </address>

            <div className="mt-8">
              <NewsletterForm locale={locale} />
            </div>
          </div>
        </div>

        <div className="rule-hairline mt-16 flex flex-col gap-4 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono" dir="ltr">
            © {year} {siteName}
          </p>
          <p>{t('rights')}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-ink-200">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ink-200">
              {t('terms')}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
