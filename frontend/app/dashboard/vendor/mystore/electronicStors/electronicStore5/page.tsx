import ElectronicsHero5 from '@/components/vendors-dashboard/_components/heroSections/electronicheros/electronicsHero5'
import ElectronicHeader5 from '@/components/vendors-dashboard/_components/storeHeaders/eletronicsHeaders/ElectronicHeader5'
import React from 'react'

function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <ElectronicHeader5/>
      <ElectronicsHero5/>
    </div>
  )
}

export default page