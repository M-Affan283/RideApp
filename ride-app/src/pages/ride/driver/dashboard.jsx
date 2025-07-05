import React from 'react'
import NavBar from '../../../components/layout/NavBar'
import Footer from '../../../components/layout/Footer'
import DriverDashboardBody from '../../../components/ride/DriverDashboardBody'

const DriverDashboard = () => {
  return (
    <div>
      <NavBar />
      <DriverDashboardBody/>
      <Footer />
    </div>
  )
}

export default DriverDashboard