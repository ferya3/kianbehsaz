import { getTranslations } from 'next-intl/server'
import type { Project } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { resolveMedia } from '@/lib/cms/media'
import { Container } from '@/components/ui/Container'
import { ArrowLink } from '@/components/ui/Button'
import { ProjectIndex, type IndexRow } from '@/components/projects/ProjectIndex'

export async function ProjectsSection({
  locale,
  projects,
}: {
  locale: Locale
  projects: Project[]
}) {
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'Home' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])

  if (!projects.length) return null

  const rows: IndexRow[] = projects.map((project) => {
    const image = resolveMedia(project.coverImage, 'wide')
    const category = typeof project.category === 'object' ? project.category.title : null

    return {
      id: project.id,
      title: project.title,
      href: `/projects/${project.slug}`,
      imageUrl: image?.url,
      imageAlt: image?.alt,
      meta: [category, project.location, project.year?.toString()].filter(
        (value): value is string => Boolean(value),
      ),
    }
  })

  return (
    <section className="bg-ink-950 py-section">
      <Container>
        <div className="rule-hairline flex items-baseline gap-4 pt-4">
          <span className="label-mono text-ember-400">03</span>
          <span className="label-mono">{t('projectsEyebrow')}</span>
        </div>

        <div className="mt-8 mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl text-[clamp(2rem,4.4vw,3.75rem)]">{t('projectsTitle')}</h2>
          <ArrowLink href="/projects">{tCommon('viewAll')}</ArrowLink>
        </div>

        <ProjectIndex rows={rows} label={t('projectsTitle')} />
      </Container>
    </section>
  )
}
