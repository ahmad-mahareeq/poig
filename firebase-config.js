/* ============================================
   Firebase Configuration
   ============================================ */
const firebaseConfig = {
  apiKey: "AIzaSyDSjK2bk_WN7A_ec4x58UmqnDQmQ-wJaMM",
  authDomain: "poig-website.firebaseapp.com",
  projectId: "poig-website",
  storageBucket: "poig-website.firebasestorage.app",
  messagingSenderId: "133047803992",
  appId: "1:133047803992:web:6167e63dfafeee6552ea2d",
  measurementId: "G-26S0DJVK79"
};

let db = null;
let auth = null;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  auth = typeof firebase.auth === 'function' ? firebase.auth() : null;
} catch (e) {
  console.error('Firebase init failed:', e);
}
