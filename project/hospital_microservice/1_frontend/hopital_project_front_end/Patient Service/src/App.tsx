import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Doctors from './components/Doctors';
import Contact from './components/Contact';
import SignIn from './components/SignIn';
import UserProfile from './components/UserProfile';
import MedicalRecords from './components/MedicalRecords';
import Appointment from './components/Appointment';
import DoctorPatients from './components/DoctorPatients';

function App() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'profile' | 'records' | 'appointment' | 'patients'>('home');

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
      default:
        return (
          <>
            <Hero />
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
        onAppointmentClick={handleAppointmentClick}
        onPatientsClick={handlePatientsClick}
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
