// Unified Firebase initialization (compat SDK)
// Ensure the compat SDK scripts are included before this file in your HTML.
(function(){
  if (!window.firebase) {
    console.error('Firebase compat SDK not found. Include firebase-app-compat.js before firebase-config.js');
    return;
  }

  // Use one project consistently so authentication and Firestore match.
  const firebaseConfig = {
    apiKey: "AIzaSyAq7ZSY9zJSIAHkhollNVHobntjfmMjdD4",
    authDomain: "reclamamanaus-f23fa.firebaseapp.com",
    projectId: "reclamamanaus-f23fa",
    storageBucket: "reclamamanaus-f23fa.firebasestorage.app",
    messagingSenderId: "735372483202",
    appId: "1:735372483202:web:09da0010bd8da53645729b"
  };

  try {
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }

    // Create short-hand globals for convenience (used across the site)
    window.db = firebase.firestore();
    window.auth = firebase.auth();
    if (firebase.storage) {
      window.storage = firebase.storage();
    }

    window.getCurrentUser = function() {
      return window.auth ? window.auth.currentUser : null;
    };

    window.ensureAuthenticated = function() {
      const currentUser = window.getCurrentUser();
      if (!currentUser) {
        window.location.href = 'CadUser.html';
        return null;
      }
      return currentUser;
    };
  } catch (err) {
    console.error('Error initializing Firebase:', err);
  }
})();
