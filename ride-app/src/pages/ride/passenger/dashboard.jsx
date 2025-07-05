import React from 'react'
import NavBar from '../../../components/layout/NavBar'
import Footer from '../../../components/layout/Footer'
import PassengerDashboardBody from '../../../components/ride/PassengerDashboardBody'

const PassengerDashboard = () => {
  return (
    <div>
      <NavBar />
      <PassengerDashboardBody />
      <Footer />
    </div>
  )
}

export default PassengerDashboard