// ==================== SENSITIVE CONFIG ====================
// Keep this file out of public/shared copies of the project.
// Everything the app needs to talk to Firebase and the Google Sheet
// passbook webhook, plus the default login passwords, lives here.

// export const firebaseConfig = {
//     apiKey: "AIzaSyBXQfK7GsFhnoqQ-CCBALUpAt_mqrW3ynU",
//     authDomain: "waterdb-58644.firebaseapp.com",
//     projectId: "waterdb-58644",
//     storageBucket: "waterdb-58644.firebasestorage.app",
//     messagingSenderId: "189956996443",
//     appId: "1:189956996443:web:5b1d568f663283957cae7e"
// };

export const firebaseConfig = {
    apiKey: "AIzaSyAyLGGhDUQSVPFNrdqrNgcrllw3F1jKkDw",
    authDomain: "sahin-bedb5.firebaseapp.com",
    databaseURL: "https://sahin-bedb5-default-rtdb.firebaseio.com",
    projectId: "sahin-bedb5",
    storageBucket: "sahin-bedb5.firebasestorage.app",
    messagingSenderId: "284579138978",
    appId: "1:284579138978:web:4f63446361ebef3b3076fb",
    measurementId: "G-8GSTXKCP6M"
  };

// Google Apps Script webhook that logs every transaction into the
// "passbook" Google Sheet (Master_Summary / Room_X / Admin_Actions tabs).
// export const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbwf3pSmHcM-gPMkgmdoFMYe_0Qwa0F2MQg_eZuBKBjJMgjSwo1sUGLPtqVu4NsPMWzbrg/exec";

export const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/kjhhj/exec";

// Default login credentials used only the very first time the system
// initializes (i.e. when no data exists yet in Firestore).
export const DEFAULT_ROOM_PASSWORD = "room123";
export const DEFAULT_ADMIN_USERNAME = "admin";
export const DEFAULT_ADMIN_PASSWORD = "admin123";
