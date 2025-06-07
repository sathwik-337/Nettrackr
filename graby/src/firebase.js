import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyK6TLO5qCD4FXjK759Zcu8YtODiCjv6U",
  authDomain: "net-trackr.firebaseapp.com",
  projectId: "net-trackr",
  storageBucket: "net-trackr.appspot.com",
  messagingSenderId: "468510467773",
  appId: "1:468510467773:web:79b3a14af22aaea76179d4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function giveOneCreditIfFirstLogin(uid, username) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      username: username || "Unknown",
      credits: 1,
      creditHistory: [
        {
          type: "earned",
          amount: 1,
          reason: "First login bonus",
          timestamp: new Date().toISOString(),
        },
      ],
    });
    console.log("Granted 1 credit on first login");
  }
}

export { app, auth, db, giveOneCreditIfFirstLogin };