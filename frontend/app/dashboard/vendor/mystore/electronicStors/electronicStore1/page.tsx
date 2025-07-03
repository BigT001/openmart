import ElectronicsHero1 from '@/components/vendors-dashboard/_components/heroSections/electronicheros/electronicsHero1'
import ElectronicHeader1 from '@/components/vendors-dashboard/_components/storeHeaders/eletronicsHeaders/ElectronicHeader1'
import React from 'react'

function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <ElectronicHeader1/>
      <ElectronicsHero1/>
    </div>
  )
}

export default page