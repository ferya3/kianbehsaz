export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-card border border-dashed border-brand-200 bg-surface-muted p-12 text-center text-brand-500">
      {message}
    </div>
  )
}
