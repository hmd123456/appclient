import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// 🔧 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7Vi2RsnZvwnTXo5OEWg4-c998YiVQB2A",
  authDomain: "docfirebase-5cf10.firebaseapp.com",
  projectId: "docfirebase-5cf10",
  storageBucket: "docfirebase-5cf10.firebasestorage.app", // 🔁 fixed typo: should be .appspot.com
  //storageBucket: "docfirebase-5cf10.appspot.com", // ✅ correct
  messagingSenderId: "62375155442",
  appId: "1:62375155442:web:392f02f1f94d7b12bf626b",
  measurementId: "G-QE4EKQJCNR"
};


 
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (err) {
  console.error("Firebase init error:", err);
}


export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);

export async function uploadFileToFirebase(file, path) {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
}
