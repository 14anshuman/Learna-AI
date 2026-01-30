import React from 'react'
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import DocumentsList from './pages/Documents/DocumentsList.jsx'
import DocumentsDetails from './pages/Documents/DocumentsDetails.jsx'
import FlashcardList from './pages/Flashcard/FlashcardList.jsx'
import FlashcardPage from './pages/Flashcard/FlashcardPage.jsx'
import QuizTakePage from './pages/Quizzes/QuizTakePage.jsx'
import QuizResultPage from './pages/Quizzes/QuizResultPage.jsx'
import Profile from './pages/Profile/Profile.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Quizzes from './pages/Quizzes/Quizzes.jsx'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './pages/Landing/LandingPage.jsx'


const App = () => {
  const {loading}=useAuth();

  if(loading){
    return (
    <div className='flex items-center justify-center h-screen'>
      <p>Loading...</p>
      </div>
      );
  }

  return (
    <AnimatePresence mode="wait">

    
    <Router>
      <Routes>
        <Route path="/" 
        element={<LandingPage/>} />
        <Route
          path="/login"
          element={<Login/>}
        />
        <Route
          path="/register"
          element={<Register/>}
        />
        
        <Route
          path="*"
          element={<NotFoundPage/>}
        />


        {/* Protected Routes */}
        <Route element={<ProtectedRoute/>}>
          <Route
            path="/dashboard"
            element={<Dashboard/>}
          />
          <Route
            path="/documents"
            element={<DocumentsList/>}
          />
          <Route
            path="/documents/:id"
            element={<DocumentsDetails/>}
          />
          <Route
            path="/flashcards"
            element={<FlashcardList/>}
          />
          <Route
            path="/documents/:id/flashcards"
            element={<FlashcardPage/>}
          />
          <Route
            path="/quizzes/:quizId"
            element={<QuizTakePage/>}
          />
          <Route
            path="/quizzes/:quizId/results"
            element={<QuizResultPage/>}
          />
          <Route
            path="/profile"
            element={<Profile/>}
          />
          <Route
          path="/quizzes"
          element={<Quizzes/>}
          />

        
        </Route>
          
      </Routes>
    </Router>
    </AnimatePresence>
  )
}

export default App