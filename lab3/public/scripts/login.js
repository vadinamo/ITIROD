import { auth } from './api/config.js'
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { createCookie } from './cookie.js'

submitData.addEventListener('click', (e) => {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            createCookie(user.uid)
        })
        .catch((error) => {
            alert(error.message)
        });
});