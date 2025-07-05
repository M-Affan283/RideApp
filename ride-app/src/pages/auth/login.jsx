import React from 'react'
import LoginForm from '../../components/auth/LoginForm'
import NavBar from '../../components/layout/NavBar'
import Footer from '../../components/layout/Footer'

const Login = () => {
  return (
    <div>
      <NavBar />
      <LoginForm />
      <Footer />
    </div>
  )
}

export default Login