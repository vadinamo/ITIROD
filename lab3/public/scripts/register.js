import { auth, database } from './api/config.js'
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { set, ref } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { createCookie } from './cookie.js'

submitData.addEventListener('click', (e) => {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            set(ref(database, 'users/' + user.uid), {
                email: email,
                password: password
            })
                .then(() => {
                    createCookie(user.uid)
                })
                .catch((error) => {
                    alert(error.message);
                });
        })
        .catch((error) => {
            alert(error.message);
        });
});