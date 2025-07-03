import FashionHero1 from '@/components/vendors-dashboard/_components/heroSections/fashionheros/fashionHero1'
import FashionHeader1 from '@/components/vendors-dashboard/_components/storeHeaders/fashionheaders/fashionHeader1'
import FashionHeader2 from '@/components/vendors-dashboard/_components/storeHeaders/fashionheaders/fashionHeader2'
import React from 'react'

function page() {
  return (
    <div>
      <FashionHeader1/>
      <FashionHero1/>
    </div>
  )
}

export default page