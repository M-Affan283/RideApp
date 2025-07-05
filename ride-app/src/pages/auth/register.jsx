import React from 'react'
import RegisterForm from '../../components/auth/RegisterForm'
import NavBar from '../../components/layout/NavBar'
import Footer from '../../components/layout/Footer'

const Register = () => {
  return (
    <div>
      <NavBar />
      <RegisterForm />
      <Footer />
    </div>
  )
}

export default Register