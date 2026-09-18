import { getTranslations } from 'next-intl/server'
import type { Project } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { resolveMedia } from '@/lib/cms/media'
import { ProjectIndex, type IndexRow } from './ProjectIndex'

/**
 * Projects always render as the index, never as a grid — on the homepage, on
 * the listing and inside a product page. One presentation, one component.
 */
export async function ProjectGrid({
  locale,
  projects,
}: {
  locale: Locale
  projects: Project[]
}) {
  const t = await getTranslations({ locale, namespace: 'Projects' })

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

  return <ProjectIndex rows={rows} label={t('title')} />
}
