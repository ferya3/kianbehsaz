import { getTranslations } from 'next-intl/server'
import type { SiteSetting } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { Link } from '@/lib/i18n/navigation'
import { Container } from '@/components/ui/Container'
import { NewsletterForm } from '@/components/shared/NewsletterForm'
import { FOOTER_NAV } from './navigation'

export async function Footer({
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
    <footer className="bg-brand-950 text-brand-200">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">{siteName}</h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-300">
              {settings?.tagline || t('companyBody')}
            </p>

            {settings?.social?.length ? (
              <ul className="mt-5 flex flex-wrap gap-3">
                {settings.social.map((profile) => (
                  <li key={profile.id ?? profile.url}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="rounded-pill border border-white/20 px-3 py-1 text-xs capitalize text-brand-200 transition-colors hover:border-white/50 hover:text-white"
                    >
                      {profile.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label={t('quickLinks')}>
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              {t('quickLinks')}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {FOOTER_NAV.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('resources')}>
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              {t('resources')}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {FOOTER_NAV.resources.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              {t('contactTitle')}
            </h2>
            <address className="mt-4 space-y-2 text-sm not-italic">
              {settings?.address ? <p>{settings.address}</p> : null}
              {settings?.phones?.map((phone) => (
                <p key={phone.id ?? phone.number}>
                  <a href={`tel:${phone.number}`} dir="ltr" className="hover:text-white">
                    {phone.number}
                  </a>
                </p>
              ))}
              {settings?.emails?.map((email) => (
                <p key={email.id ?? email.address}>
                  <a href={`mailto:${email.address}`} dir="ltr" className="hover:text-white">
                    {email.address}
                  </a>
                </p>
              ))}
            </address>

            <div className="mt-6">
              <NewsletterForm locale={locale} />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-brand-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteName}. {t('rights')}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="hover:text-white">
              {t('terms')}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
