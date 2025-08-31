import React, { useState, useEffect } from 'react';
import './App.css';
import { auth, provider, uploadFileToFirebase, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState('');
  const [mandatoryDocs, setMandatoryDocs] = useState([]);
  const [optionalDocs, setOptionalDocs] = useState([]);
  const [files, setFiles] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [status, setStatus] = useState('');

  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 📦 Fetch categories from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched categories:', data);
        setCategories(data);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  // 🧭 Update document lists when category changes
  useEffect(() => {
    if (selected) {
      const cat = categories.find(c => c.name === selected);
      setMandatoryDocs(cat?.mandatoryDocs || []);
      setOptionalDocs(cat?.optionalDocs || []);
      setFiles({});
      setCanSubmit(false);
    }
  }, [selected, categories]);

  // ✅ Enable submit when all mandatory docs are uploaded
  useEffect(() => {
    if (mandatoryDocs.length) {
      setCanSubmit(mandatoryDocs.every(doc => files[doc]));
    }
  }, [files, mandatoryDocs]);

  // 📁 Handle file selection
  const handleFileChange = (doc, e) => {
    setFiles(prev => ({ ...prev, [doc]: e.target.files[0] }));
  };

  // 🔐 Google Sign-In
  const handleGoogleSignIn = async () => {
    await signInWithPopup(auth, provider);
  };

  // 🔓 Sign-Out
  const handleSignOut = async () => {
    await signOut(auth);
  };

  // 🚀 Submit application
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.email) {
      setStatus("User not authenticated.");
      return;
    }

    setStatus('Uploading files...');
    const uploadedDocsTemp = {};
    const userEmail = user.email.replace(/[@.]/g, '_');

    for (const [doc, file] of Object.entries(files)) {
      const path = `applications/${userEmail}/${selected}/${doc}/${file.name}`;
      try {
        console.log(`Uploading ${doc}: ${path}`);
        const url = await uploadFileToFirebase(file, path);
        uploadedDocsTemp[doc] = url;
      } catch (err) {
        setStatus(`Failed to upload ${doc}: ${err.message}`);
        return;
      }
    }

    console.log("Writing to Firestore:", {
      userEmail: user.email,
      category: selected,
      uploadedDocs: uploadedDocsTemp,
      submittedAt: new Date(),
      status: 'Submitted'
    });

    try {
  const docRef = await addDoc(collection(db, "applications"), {
    userEmail: user.email,
    category: selected,
    uploadedDocs: uploadedDocsTemp,
    submittedAt: serverTimestamp(),
    status: 'Submitted'
  });

  
  console.log("Document written with ID:", docRef.id);
  setStatus('Submitted!');
} catch (err) {
  console.error("Firestore write failed:", err);
  setStatus(`Submission failed: ${err.message}`);
}

  };

  // 🧑‍💻 UI
  if (!user) {
    return (
      <div className="App">
        <h2>Sign in to Apply</h2>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div className="App">
      <div style={{ float: 'right' }}>
        <span>{user.displayName}</span>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>

      <h2>Apply for a Category</h2>
      <select value={selected} onChange={e => setSelected(e.target.value)}>
        <option value="">-- Select Category --</option>
        {categories.map(cat => (
          <option key={cat.name} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      {selected && (
        <form onSubmit={handleSubmit}>
          <h3>Mandatory Documents</h3>
          <ul>
            {mandatoryDocs.map(doc => (
              <li key={doc}>
                {doc}:
                <input type="file" onChange={e => handleFileChange(doc, e)} required />
                {files[doc] && <span> ✅</span>}
              </li>
            ))}
          </ul>
//test
          <h3>Optional Documents</h3>
          <ul>
            {optionalDocs.map(doc => (
              <li key={doc}>
                {doc}:
                <input type="file" onChange={e => handleFileChange(doc, e)} />
                {files[doc] && <span> ✅</span>}
              </li>
            ))}
          </ul>

          <button type="submit" disabled={!canSubmit}>Submit</button>
        </form>
      )}

      {status && <p>{status}</p>}
    </div>
  );
}

export default App;
