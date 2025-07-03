import ElectronicsHero3 from '@/components/vendors-dashboard/_components/heroSections/electronicheros/electronicsHero3'
import ElectronicHeader3 from '@/components/vendors-dashboard/_components/storeHeaders/eletronicsHeaders/ElectronicHeader3'
import React from 'react'

function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <ElectronicHeader3/>
      <ElectronicsHero3/>
    </div>
  )
}

export default page