import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminRegister from './pages/Login_Register/AdminRegister.jsx'
import LoginPage from './pages/Login_Register/LoginPage.jsx'

import HomeAdmin from './pages/AdminUI/HomeAdmin.jsx'
import ManageDepartment from './pages/AdminUI/managerDepartment/ManageDepartment.jsx'
import ManageDepartmentInfor from './pages/AdminUI/managerDepartment/DepartmentDetailPage.jsx'
import ManagePatientOfDepartment from './pages/AdminUI/managerDepartment/ManagePatientOfDepartment.jsx'
import ManageDoctorInDepartment from './pages/AdminUI/managerDepartment/ManageDoctorInDepartment.jsx'
import CreateDepartment from './pages/AdminUI/managerDepartment/CreateDepartment.jsx'

import ManageDoctors from './pages/AdminUI/managerDoctor/managerDoctors.jsx'
import CreateDoctor from './pages/AdminUI/managerDoctor/createDoctor.jsx'
import ManageDoctorInfor from './pages/AdminUI/managerDoctor/managerDoctorInfor.jsx'

import ManageListPatient from './pages/AdminUI/managePatient/manageListPatient.jsx'
import CreatePatient from './pages/AdminUI/managePatient/createPatient.jsx'

import CreateNotification from './pages/AdminUI/manageNotification/createNotification.jsx'

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
        <Route path = "/HomeAdmin/ManagerDepartment" element = {<ManageDepartment/>} />
        <Route path = "/HomeAdmin/ManagerDepartmentInfor" element = {<ManageDepartmentInfor/>} />
        <Route path = "/HomeAdmin/ManagePatientOfDepartment" element = {<ManagePatientOfDepartment/>}/>
        <Route path = "/HomeAdmin/ManageDoctorInDepartment" element = {<ManageDoctorInDepartment/>}/>
        <Route path = "/HomeAdmin/CreateDepartment" element = {<CreateDepartment/>}/>

        <Route path = "/HomeAdmin/ManageDoctors" element = {<ManageDoctors/>}/>
        <Route path = "/HomeAdmin/CreateDoctor" element = {<CreateDoctor/>}/>
        <Route path = "/HomeAdmin/ManageDoctorInfor" element = {<ManageDoctorInfor/>}/>

        <Route path = "/HomeAdmin/ManageListPatient" element = {<ManageListPatient/>}/>
        <Route path = "/HomeAdmin/CreatePatient" element = {<CreatePatient/>}/>

        <Route path = "/HomeAdmin/CreateNotification" element = {<CreateNotification/>}/>


      </Routes>
    </BrowserRouter>
  )
}
export default App;
