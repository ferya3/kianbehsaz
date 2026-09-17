import type { Project } from '@/payload-types'
import { resolveMedia } from '@/lib/cms/media'
import { MediaCard } from '@/components/ui/Card'

export function ProjectGrid({
  projects,
  priorityCount = 0,
}: {
  projects: Project[]
  priorityCount?: number
}) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => {
        const image = resolveMedia(project.coverImage, 'card')
        const category =
          project.category && typeof project.category === 'object' ? project.category.title : null

        // Location and year are what a visitor scans a project list for.
        const meta = [project.location, project.year].filter(Boolean).join(' · ')

        return (
          <li key={project.id}>
            <MediaCard
              href={`/projects/${project.slug}`}
              title={project.title}
              description={project.summary}
              imageUrl={image?.url}
              imageAlt={image?.alt}
              badge={category}
              meta={meta || undefined}
              priority={index < priorityCount}
            />
          </li>
        )
      })}
    </ul>
  )
}
