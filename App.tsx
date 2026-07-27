import React, { useState, useEffect } from 'react';
import { ScreenId, TriageResult, Appointment, AppNotification } from './types';
import { INITIAL_APPOINTMENT } from './data/mockData';
import { auth, onAuthStateChanged } from './lib/firebase';
import { signOutUser } from './services/authService';
import { saveAppointmentToFirestore, subscribeUserAppointments } from './services/firestoreService';
import { notificationService } from './services/notificationService';
import { Header } from './components/Header';
import { MobileFrame } from './components/MobileFrame';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { HealthCheckScreen } from './components/screens/HealthCheckScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { BookingScreen } from './components/screens/BookingScreen';
import { QueueTrackerScreen } from './components/screens/QueueTrackerScreen';
import { WalletScreen } from './components/screens/WalletScreen';
import { AiAssistantScreen } from './components/screens/AiAssistantScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AdminManagementScreen } from './components/screens/AdminManagementScreen';
import { SosModal } from './components/modals/SosModal';
import { QrModal } from './components/modals/QrModal';
import { AllScreensModal } from './components/modals/AllScreensModal';
import { AuthModal } from './components/modals/AuthModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { NotificationToastBanner } from './components/NotificationToastBanner';
import { PostAppointmentFeedbackModal } from './components/modals/PostAppointmentFeedbackModal';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('welcome');
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Auth state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Modals state
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isAllScreensOpen, setIsAllScreensOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Push Notification state
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(1);
  const [latestPushNotification, setLatestPushNotification] = useState<AppNotification | null>(null);

  // Listen for push notification events
  useEffect(() => {
    const unsub = notificationService.subscribe((notifications, latestPush) => {
      const unread = notifications.filter((n) => !n.read).length;
      setUnreadNotificationsCount(unread);
      if (latestPush) {
        setLatestPushNotification(latestPush);
      }
    });
    return () => unsub();
  }, []);

  // Shared state
  const [appointment, setAppointment] = useState<Appointment>(INITIAL_APPOINTMENT);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // Real-time Firestore sync for appointments
  useEffect(() => {
    const unsub = subscribeUserAppointments((apts) => {
      if (apts && apts.length > 0) {
        setAppointment(apts[0]);
      }
    });
    return () => unsub();
  }, [currentUser]);

  const handleTriageComplete = (result: TriageResult) => {
    // Triage completed, ready to pass to booking
  };

  const handleBookAppointment = (newApt: Appointment) => {
    setAppointment(newApt);
    saveAppointmentToFirestore(newApt);
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'} font-sans antialiased selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-300`}>
      
      {/* Global Application Header */}
      <Header
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Viewport Wrapper */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4">
        <MobileFrame
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          isMobileFrame={isMobileFrame}
          onOpenAllScreens={() => setIsAllScreensOpen(true)}
        >
          {activeScreen === 'welcome' && (
            <WelcomeScreen
              setActiveScreen={setActiveScreen}
              onOpenQr={() => setIsQrOpen(true)}
            />
          )}

          {activeScreen === 'healthCheck' && (
            <HealthCheckScreen
              setActiveScreen={setActiveScreen}
              onTriageComplete={handleTriageComplete}
            />
          )}

          {activeScreen === 'dashboard' && (
            <DashboardScreen
              setActiveScreen={setActiveScreen}
              onOpenQr={() => setIsQrOpen(true)}
              onOpenSos={() => setIsSosOpen(true)}
              appointment={appointment}
              onOpenFeedback={() => setIsFeedbackOpen(true)}
            />
          )}

          {activeScreen === 'booking' && (
            <BookingScreen
              setActiveScreen={setActiveScreen}
              onBookAppointment={handleBookAppointment}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          )}

          {activeScreen === 'queueTracker' && (
            <QueueTrackerScreen
              setActiveScreen={setActiveScreen}
              onOpenQr={() => setIsQrOpen(true)}
              onOpenFeedback={() => setIsFeedbackOpen(true)}
            />
          )}

          {activeScreen === 'wallet' && (
            <WalletScreen
              setActiveScreen={setActiveScreen}
              onOpenQr={() => setIsQrOpen(true)}
            />
          )}

          {activeScreen === 'aiAssistant' && (
            <AiAssistantScreen
              setActiveScreen={setActiveScreen}
            />
          )}

          {activeScreen === 'analytics' && (
            <AnalyticsScreen
              setActiveScreen={setActiveScreen}
            />
          )}

          {activeScreen === 'profile' && (
            <ProfileScreen
              setActiveScreen={setActiveScreen}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              onSignOut={handleSignOut}
            />
          )}

          {activeScreen === 'adminManagement' && (
            <AdminManagementScreen
              setActiveScreen={setActiveScreen}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          )}
        </MobileFrame>
      </main>

      {/* Modals */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
      />

      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        tokenNumber={appointment.tokenNumber}
        doctorName={appointment.doctorName}
        department={appointment.doctorSpecialty}
      />

      <AllScreensModal
        isOpen={isAllScreensOpen}
        onClose={() => setIsAllScreensOpen(false)}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user, profile) => {
          setCurrentUser(user);
        }}
      />

      {/* Push Notification Toast Banner (Appears on incoming alerts) */}
      <NotificationToastBanner
        latestPushNotification={latestPushNotification}
        onClearToast={() => setLatestPushNotification(null)}
        setActiveScreen={setActiveScreen}
      />

      {/* Push Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        setActiveScreen={setActiveScreen}
      />

      {/* Post-Appointment Doctor Rating & Feedback Modal */}
      <PostAppointmentFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        appointment={appointment}
        onFeedbackSubmitted={(updatedApt) => {
          setAppointment(updatedApt);
          saveAppointmentToFirestore(updatedApt);
        }}
      />

    </div>
  );
}
