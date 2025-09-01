import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function ProfileSummary({ user }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (user?.uid) {
        const docRef = doc(db, 'profiles', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setProfile(snap.data());
        }
      }
    }
    fetchProfile1();
  }, [user]);

  if (!profile) return <div className="profile-summary__loading">Loading profile...</div>;

  return (
    <div className="profile-summary__container">
      <h2 className="profile-summary__title">Profile Summary</h2>
      <section className="profile-summary__section">
        <h3>Personal Info</h3>
        <ul>
          <li><strong>First Name:</strong> {profile.personalInfo?.firstName || '-'}</li>
          <li><strong>Last Name:</strong> {profile.personalInfo?.lastName || '-'}</li>
          <li><strong>Phone:</strong> {profile.personalInfo?.phone || '-'}</li>
        </ul>
      </section>
      <section className="profile-summary__section">
        <h3>Education</h3>
        <ul>
          <li><strong>Degree:</strong> {profile.education?.degree || '-'}</li>
          <li><strong>University:</strong> {profile.education?.university || '-'}</li>
          <li><strong>Year:</strong> {profile.education?.year || '-'}</li>
        </ul>
      </section>
      <section className="profile-summary__section">
        <h3>Files</h3>
        <ul>
          <li><strong>Resume:</strong> {profile.files?.resume || '-'}</li>
          <li><strong>Photo:</strong> {profile.files?.photo || '-'}</li>
        </ul>
      </section>
    </div>
  );
}

export default ProfileSummary;