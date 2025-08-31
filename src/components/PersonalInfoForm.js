import React, { useState } from 'react';
import { db } from '../firebase'; // Make sure you have exported db from your firebase.js
import { doc, setDoc } from 'firebase/firestore';

function PersonalInfoForm({ initialData, onNext, user }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    ...initialData
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Save to Firestore
    if (user?.uid) {
      const docRef = doc(db, 'profiles', user.uid);
      await setDoc(docRef, { personalInfo: form }, { merge: true });
    }
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Personal Information</h3>
      <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
      <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
      <button type="submit">Next</button>
    </form>
  );
}

export default PersonalInfoForm;