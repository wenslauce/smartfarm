import './index.css';
import Layout from './dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './Home/homepage';
import LoginForm from './auth/login/components/LoginForm'
import SignupForm from './auth/signup/components/SignupForm'
import Dashboard from './dashboard/pages/Homepage/Dashboard'
import ChatbotUI from './dashboard/pages/chatbot'
import YieldPredict from './dashboard/pages/YieldPrediction/YieldPredict'
import FertilizerRecommend from './dashboard/pages/FertilizerRecommend/FertilizerRecommend'
import MedicalImageAnalysis from './dashboard/pages/diseasesDetection'
import FarmerProfile from './dashboard/pages/ProfilePage'
import CropRecommend from './dashboard/pages/CropRecommendation/CropRecommend'
import { FarmAnalytics } from './dashboard/pages/Contacts/Contact'
// import NotFound from './NotFound/NotFound';
import 'regenerator-runtime/runtime'
import { useState } from 'react';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true' || 
                         localStorage.getItem('isAuthenticated') === 'true'
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return children
}

function App() {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Homepage />} />
      
      {/* Auth routes */}
      <Route path="/auth">
        <Route path="login" element={<LoginForm flip={handleFlip} />} />
        <Route path="signup" element={<SignupForm flip={handleFlip} />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="bot" element={<ChatbotUI />} />
        <Route path="yield" element={<YieldPredict />} />
        <Route path="fertilizers" element={<FertilizerRecommend />} />
        <Route path="diseases" element={<MedicalImageAnalysis />} />
        <Route path="profile" element={<FarmerProfile />} />
        <Route path="crop-recommendation" element={<CropRecommend />} />
        <Route path="inventory" element={<FarmAnalytics />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
