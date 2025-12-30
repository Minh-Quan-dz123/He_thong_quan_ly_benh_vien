import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminRegister from './pages/Login_Register/AdminRegister.jsx'
import LoginPage from './pages/Login_Register/LoginPage.jsx'

import HomeAdmin from './pages/AdminUI/HomeAdmin.jsx'

import DepartmentPage from './pages/AdminUI/managerDepartment/DepartmentPage.jsx'
import ManageDepartment from './pages/AdminUI/managerDepartment/ManageDepartment.jsx'
import ManageDepartmentInfor from './pages/AdminUI/managerDepartment/DepartmentDetailPage.jsx'
import ManagePatientOfDepartment from './pages/AdminUI/managerDepartment/ManagePatientOfDepartment.jsx'
import ManageDoctorInDepartment from './pages/AdminUI/managerDepartment/ManageDoctorInDepartment.jsx'
import CreateDepartment from './pages/AdminUI/managerDepartment/CreateDepartment.jsx'

import DoctorPage from './pages/AdminUI/managerDoctor/DoctorPage.jsx'
import ManageDoctors from './pages/AdminUI/managerDoctor/managerDoctors.jsx'
import CreateDoctor from './pages/AdminUI/managerDoctor/createDoctor.jsx'
import ManageDoctorInfor from './pages/AdminUI/managerDoctor/managerDoctorInfor.jsx'

import PatientPage from './pages/AdminUI/managePatient/PatientPage.jsx'
import ManageListPatient from './pages/AdminUI/managePatient/manageListPatient.jsx'
import CreatePatient from './pages/AdminUI/managePatient/createPatient.jsx'

import Notification from './pages/AdminUI/manageNotification/NotificationPage.jsx'
import CreateNotification from './pages/AdminUI/manageNotification/createNotification.jsx'
import HistoryNotification from './pages/AdminUI/manageNotification/historyNotification.jsx'

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
        <Route path = "/HomeAdmin/DepartmentPage" element = {<DepartmentPage/>} />
        <Route path = "/HomeAdmin/ManagerDepartment" element = {<ManageDepartment/>} />
        <Route path = "/HomeAdmin/ManagerDepartmentInfor" element = {<ManageDepartmentInfor/>} />
        <Route path = "/HomeAdmin/ManagePatientOfDepartment" element = {<ManagePatientOfDepartment/>}/>
        <Route path = "/HomeAdmin/ManageDoctorInDepartment" element = {<ManageDoctorInDepartment/>}/>
        <Route path = "/HomeAdmin/CreateDepartment" element = {<CreateDepartment/>}/>

        <Route path = "/HomeAdmin/DoctorPage" element = {<DoctorPage/>}/>
        <Route path = "/HomeAdmin/ManageDoctors" element = {<ManageDoctors/>}/>
        <Route path = "/HomeAdmin/CreateDoctor" element = {<CreateDoctor/>}/>
        <Route path = "/HomeAdmin/ManageDoctorInfor" element = {<ManageDoctorInfor/>}/>

        <Route path = "/HomeAdmin/PatientPage" element = {<PatientPage/>}/>
        <Route path = "/HomeAdmin/ManageListPatient" element = {<ManageListPatient/>}/>
        <Route path = "/HomeAdmin/CreatePatient" element = {<CreatePatient/>}/>


        <Route path = "/HomeAdmin/Notification" element = {<Notification/>}/>
        <Route path = "/HomeAdmin/CreateNotification" element = {<CreateNotification/>}/>
        <Route path = "/HomeAdmin/HistoryNotification" element = {<HistoryNotification/>}/>

      </Routes>
    </BrowserRouter>
  )
}
export default App;
