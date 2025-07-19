export default function PayoutsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-neutral-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-48"></div>
        </div>
        <div className="h-10 bg-neutral-200 rounded w-32"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-neutral-200 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-neutral-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-neutral-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <div className="h-6 bg-neutral-200 rounded w-32"></div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/6"></div>
                </div>
                <div className="w-20 h-4 bg-neutral-200 rounded"></div>
                <div className="w-16 h-6 bg-neutral-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
