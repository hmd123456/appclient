import React, { useState, useEffect } from 'react';
import PersonalInfoForm from './PersonalInfoForm';
import EducationForm from './EducationForm';
import FileUploadForm from './FileUploadForm';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function ProgressiveForm({ user }) {
  const [step, setStep] = useState(0);
  const [personalInfo, setPersonalInfo] = useState({});
  const [education, setEducation] = useState({});
  const [files, setFiles] = useState({});
  const [status, setStatus] = useState('');

  // Fetch profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      if (user?.uid) {
        const docRef = doc(db, 'profiles', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setPersonalInfo(data.personalInfo || {});
          setEducation(data.education || {});
          setFiles(data.files || {});
        }
      }
    }
    fetchProfile();
  }, [user]);

  const handlePersonalNext = async (data) => {
    setStatus('Saving...');
    if (user?.uid) {
      const docRef = doc(db, 'profiles', user.uid);
      await setDoc(docRef, { personalInfo: data }, { merge: true });
    }
    setPersonalInfo(data);
    setStatus('');
    setStep(1);
  };

  const handleEducationNext = async (data) => {
    setStatus('Saving...');
    if (user?.uid) {
      const docRef = doc(db, 'profiles', user.uid);
      await setDoc(docRef, { education: data }, { merge: true });
    }
    setEducation(data);
    setStatus('');
    setStep(2);
  };

  const handleFilesSubmit = async (data) => {
    setStatus('Uploading...');
    // For demo: just save file names, not actual files
    if (user?.uid) {
      const docRef = doc(db, 'profiles', user.uid);
      await setDoc(docRef, { files: Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key]?.name || '';
        return acc;
      }, {}) }, { merge: true });
    }
    setFiles(data);
    setStatus('Profile completed!');
  };

  if (step === 0) {
    return <PersonalInfoForm initialData={personalInfo} onNext={handlePersonalNext} user={user} />;
  }
  if (step === 1) {
    return <EducationForm initialData={education} onNext={handleEducationNext} onBack={() => setStep(0)} user={user} />;
  }
  if (step === 2) {
    return <FileUploadForm initialFiles={files} onSubmit={handleFilesSubmit} onBack={() => setStep(1)} user={user} />;
  }

  return <div>{status}</div>;
}

export default ProgressiveForm;