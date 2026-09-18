export function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-white/15 px-8 py-20 text-center text-ink-400">
      {message}
    </div>
  )
}
