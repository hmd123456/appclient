import React, { useState, useEffect } from 'react';
import './App.css';
import { auth, provider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProgressiveForm from './components/ProgressiveForm';
import ProfileSummary from './components/ProfileSummary';

function App() {
  const [user, setUser] = useState(null);

  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 🔐 Google Sign-In
  const handleGoogleSignIn = async () => {
    await signInWithPopup(auth, provider);
  };

  // 🔓 Sign-Out
  const handleSignOut = async () => {
    await signOut(auth);
  };

  // 🧑‍💻 UI
  if (!user) {
    return (
      <div className="App">
        <button onClick={handleGoogleSignIn}>Sign In with Google</button>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <div style={{ float: 'right' }}>
          <span>{user.displayName}</span>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
        <Routes>
          <Route path="/" element={<ProgressiveForm user={user} />} />
          <Route path="/profile" element={<ProfileSummary user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;