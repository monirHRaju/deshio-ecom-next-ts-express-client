export default function ProductSkeleton() {
  return (
    <div className="card bg-base-100 border border-base-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-base-300" />
      <div className="card-body p-4 gap-2">
        <div className="h-3 w-16 rounded bg-base-300" />
        <div className="h-4 w-full rounded bg-base-300" />
        <div className="h-4 w-3/4 rounded bg-base-300" />
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-3 rounded-full bg-base-300" />
          ))}
        </div>
        <div className="h-5 w-20 rounded bg-base-300 mt-1" />
        <div className="h-8 w-full rounded bg-base-300 mt-2" />
      </div>
    </div>
  );
}
