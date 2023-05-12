import { auth, database, storage } from './api/config.js'
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { set, ref as dbRef, update } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { ref as stRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js"
import { createCookie } from './cookie.js'

submitData.addEventListener('click', (e) => {
    let username = document.getElementById('username').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let repeatPassword = document.getElementById('repeat-password').value

    let imageInput = document.getElementById('avatar')
    let image = imageInput.files[0]

    if (password != repeatPassword) {
        alert('Passwords didnt match')
        return
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            set(dbRef(database, 'users/' + user.uid), {
                username: username,
                email: email,
                password: password
            })
                .then(() => {
                    if (image) {
                        const storageRef = stRef(storage, `images/users/${user.uid}/`);
                        uploadBytes(storageRef, image).then((snapshot) => {
                            getDownloadURL(snapshot.ref).then((link) => {
                                update(dbRef(database, `users/${user.uid}`), { 'avatar': link }).then(() => {
                                    createCookie(user.uid);
                                    window.location.replace("index.html");
                                });
                            })
                        });
                    }
                    else {
                        createCookie(user.uid)
                        window.location.replace("index.html")
                    }
                })
                .catch((error) => {
                    alert(error.message);
                });
        })
        .catch((error) => {
            alert(error.message);
        });
});