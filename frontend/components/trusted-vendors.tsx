export function TrustedVendors() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Trusted Vendors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {/* Vendor logos will go here */}
          <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all">
            <div className="w-32 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
          <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all">
            <div className="w-32 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
          <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all">
            <div className="w-32 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
