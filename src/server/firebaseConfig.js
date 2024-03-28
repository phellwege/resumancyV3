import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import "firebase/auth";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
    authDomain: `${process.env.REACT_APP_FIREBASE_AUTHDOMAIN}`,
    projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
    storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGEBUCKET}`,
    messagingSenderId: `${process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID}`,
    appId: `${process.env.REACT_APP_FIREBASE_APPID}`,
    measurementId: "G-P48DLL1JDN"
}

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const perf = getPerformance(app);
export const storage = getStorage(app)
export const db = getFirestore(app);
export const auth = getAuth();