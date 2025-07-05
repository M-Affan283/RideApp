import React from 'react'
import RequestRideForm from '../../../components/ride/RequestRideForm'
import Footer from '../../../components/layout/Footer'
import NavBar from '../../../components/layout/NavBar'

const RequestRide = () => {
  return (
    <div>
        <NavBar />
        <RequestRideForm />
        <Footer />
    </div>
  )
}

export default RequestRide