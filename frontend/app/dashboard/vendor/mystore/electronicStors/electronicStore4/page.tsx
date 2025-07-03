import ElectronicsHero4 from '@/components/vendors-dashboard/_components/heroSections/electronicheros/electronicsHero4'
import ElectronicHeader4 from '@/components/vendors-dashboard/_components/storeHeaders/eletronicsHeaders/ElectronicHeader4'
import React from 'react'

function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <ElectronicHeader4/>
      <ElectronicsHero4/>
    </div>
  )
}

export default page