import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminRegister from './pages/Login_Register/AdminRegister.jsx'
import LoginPage from './pages/Login_Register/LoginPage.jsx'
import HomeAdmin from './pages/AdminUI/HomeAdmin.jsx'

function App()
{
  return (
    <BrowserRouter>
      <Routes>
        {/* Mặc định vào login */}
        <Route path = "/" element = {<Navigate to = "/Login"/>} />

        <Route path = "/Login" element = {<LoginPage/>} />
        <Route path = "/Register" element = {<AdminRegister/>} />
        <Route path = "/HomeAdmin" element = {<HomeAdmin/>} />

      </Routes>
    </BrowserRouter>
  )
}
export default App;
