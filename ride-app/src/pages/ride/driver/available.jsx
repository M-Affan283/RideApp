import React from 'react'
import AvailableRidesTable from '../../../components/ride/AvailableRidesTable'
import NavBar from '../../../components/layout/NavBar'
import Footer from '../../../components/layout/Footer'


const AvailableRides = () => {
  return (
    <div>
      <NavBar />
      <AvailableRidesTable />
      <Footer />
    </div>
  )
}

export default AvailableRides