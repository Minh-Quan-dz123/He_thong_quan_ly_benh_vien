import { useState } from 'react';
// 1. Nhóm Common
import Navbar from './components/common/Navbar';
import Hero from './components/common/Hero';
import QuickAccess from './components/common/QuickAccess';
import Doctors from './components/patient/Doctors';
import Contact from './components/common/Contact';
import SignIn from './components/common/SignIn';
import UserProfile from './components/common/UserProfile';
import News from './components/common/News';

// 2. Nhóm Patient
import MedicalRecords from './components/patient/MedicalRecords';
import Appointment from './components/patient/Appointment';
import Specialties from './components/patient/Specialties';
import PatientGuide from './components/patient/PatientGuide';

// 3. Nhóm Doctor
import DoctorPatients from './components/doctor/DoctorPatients';
// import DoctorDashboard from './components/doctor/DoctorDashboard'; // (Mở comment khi bạn đã tạo file này)
// import Prescription from './components/doctor/Prescription';       // (Mở comment khi bạn đã tạo file này)

function App() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'profile' | 'records' | 'appointment' | 'patients' | 'news' | 'specialties' | 'guide'>('home');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | undefined>(undefined);
  const [guideSection, setGuideSection] = useState<'process' | 'insurance' | 'payment'>('process');

  const handleLogin = (user: string, role: 'patient' | 'doctor') => {
    setIsLoggedIn(true);
    setUsername(user);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setUserRole(null);
    setCurrentView('home');
  };

  const handleAppointmentClick = () => {
    if (isLoggedIn) {
      setCurrentView('appointment');
    } else {
      setIsSignInOpen(true);
    }
  };

  const handlePatientsClick = () => {
    if (isLoggedIn && userRole === 'doctor') {
      setCurrentView('patients');
    }
  };

  const handleNewsClick = () => {
    setCurrentView('news');
  };

  const handleSpecialtyClick = (id: string) => {
    setSelectedSpecialtyId(id);
    setCurrentView('specialties');
  };

  const handleGuideClick = (section: 'process' | 'insurance' | 'payment') => {
    setGuideSection(section);
    setCurrentView('guide');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return <UserProfile role={userRole} />;
      case 'records':
        return <MedicalRecords />;
      case 'appointment':
        return <Appointment />;
      case 'patients':
        return <DoctorPatients />;
      case 'news':
        return <News />;
      case 'specialties':
        return <Specialties initialSpecialtyId={selectedSpecialtyId} key={selectedSpecialtyId} />;
      case 'guide':
        return <PatientGuide section={guideSection} />;
      default:
        return (
          <>
            <Hero />
            <QuickAccess />
            <Doctors />
            <Contact />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar 
        onSignInClick={() => setIsSignInOpen(true)}
        isLoggedIn={isLoggedIn}
        username={username}
        role={userRole}
        onLogout={handleLogout}
        onProfileClick={() => setCurrentView('profile')}
        onMedicalRecordsClick={() => setCurrentView('records')}
        onHomeClick={() => setCurrentView('home')}
        onNewsClick={handleNewsClick}
        onAppointmentClick={handleAppointmentClick}
        onPatientsClick={handlePatientsClick}
        onSpecialtyClick={handleSpecialtyClick}
        onGuideClick={handleGuideClick}
      />
      {renderContent()}
      <SignIn 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
