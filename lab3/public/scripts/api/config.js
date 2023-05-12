import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js"

const firebaseConfig = {
    apiKey: "AIzaSyA777xeCC9ZJLhKNufHAhy72NhfoDz1ocA",
    authDomain: "trello-cc019.firebaseapp.com",
    databaseURL: "https://trello-cc019-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "trello-cc019",
    storageBucket: "trello-cc019.appspot.com",
    messagingSenderId: "911580040497",
    appId: "1:911580040497:web:a7471ad7f56fc705463410"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);
const storage = getStorage();

export { firebaseConfig, app, auth, database, storage }