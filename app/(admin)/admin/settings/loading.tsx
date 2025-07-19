export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-neutral-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-48"></div>
        </div>
        <div className="h-10 bg-neutral-200 rounded w-32"></div>
      </div>

      <div className="border-b border-neutral-200">
        <div className="flex space-x-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="py-2 px-1">
              <div className="h-4 bg-neutral-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <div className="h-6 bg-neutral-200 rounded w-32"></div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 bg-neutral-200 rounded w-20 mb-2"></div>
                <div className="h-10 bg-neutral-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-neutral-200 rounded w-20 mb-2"></div>
                <div className="h-10 bg-neutral-200 rounded"></div>
              </div>
            </div>
            <div>
              <div className="h-4 bg-neutral-200 rounded w-32 mb-2"></div>
              <div className="h-24 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
