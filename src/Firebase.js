import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.React_APP_ApiKey,
  authDomain: process.env.React_APP_AuthDomain,
  databaseURL: process.env.React_APP_DatabaseURL,
  projectId: process.env.React_APP_ProjectId,
  storageBucket: process.env.React_APP_StorageBucket,
  messagingSenderId: process.env.React_APP_MessagingSenderId,
  appId: process.env.React_APP_AppId,
  measurementId: process.env.React_APP_MeasurementId
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export {app, auth,db};
