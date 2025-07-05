import React from 'react'
import RideHistoryTable from '../../../components/ride/RideHistoryTable'
import NavBar from '../../../components/layout/NavBar'
import Footer from '../../../components/layout/Footer'

const RideHistory = () => {
  return (
    <div>
        <NavBar />
        <RideHistoryTable />
        <Footer />
    </div>
  )
}

export default RideHistory