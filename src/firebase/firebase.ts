import { initializeApp } from "firebase/app";
import type {FirebaseApp} from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import type {
  Auth
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type {FirebaseStorage} from "firebase/storage"
import { getMessaging } from "firebase/messaging";
import type { Messaging } from "firebase/messaging";


const firebaseConfig: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
} = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_KEY as string,
  authDomain: "twyft-c647d.firebaseapp.com",
  projectId: "twyft-c647d",
  storageBucket: "twyft-c647d.appspot.com", 
  messagingSenderId: "331619865944",
  appId: "1:331619865944:web:23623fd822b58932f6812d",
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();
export const appleProvider: OAuthProvider = new OAuthProvider("apple.com");
export const db: Firestore = getFirestore(app);
export const firestore: Firestore = db; // Optional alias
export const storage: FirebaseStorage = getStorage(app);
export const messaging: Messaging = getMessaging(app);

export default app;
