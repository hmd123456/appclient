import React, { useState, useEffect } from 'react';
import './App.css';
import { auth, provider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import ProgressiveForm from './components/ProgressiveForm';

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
    <div className="App">
      <div style={{ float: 'right' }}>
        <span>{user.displayName}</span>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      <ProgressiveForm user={user} />
    </div>
  );
}

export default App;