import { database, auth, storage } from './api/config.js'
import { update, ref as dbRef, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { updateEmail, updatePassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getUserId, logOut, checkAuth } from './cookie.js'
import { getUserImage, uploadImageAndGetLink } from './requests.js';
import { setEmail, setUsername, setImage, getUserProjects } from './user.js';

if (!checkAuth()) {
    window.location.replace("login.html");
}

const userId = getUserId()
const userRef = dbRef(database, `users/${userId}`)

document.getElementById('logOut').addEventListener("click", logOut)

submitData.addEventListener('click', (e) => {
    let username = document.getElementById('username').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let repeatPassword = document.getElementById('repeat-password').value

    let imageInput = document.getElementById('avatar')
    let image = imageInput.files[0]

    let userData = {
        'username': username,
        'email': email
    }

    auth.onAuthStateChanged((user) => {
        if (user) {
            updateEmail(user, email).then(() => {
                return user.getIdToken();
            }).then((idToken) => {
                if (password != '' && password === repeatPassword) {
                    return updatePassword(user, password);
                } else {
                    return Promise.resolve();
                }
            }).then(() => {
                return user.getIdToken();
            }).then((idToken) => {
                return update(userRef, userData);
            }).then(() => {
                if (image) {
                    return uploadImageAndGetLink(storage, database, userId, image);
                } else {
                    return Promise.resolve();
                }
            }).then((link) => {
                if (link) {
                    document.getElementById('avatarImage').src = link;
                }

                location.reload(true);
            }).catch((error) => {
                console.error(error.message);
            });
        }
    });
})

function loadProfile() {
    get(userRef).then((snapshot) => {
        const user = snapshot.val()

        document.getElementById('username').value = user.username
        document.getElementById('email').value = user.email
        getUserImage(userId).then((link) => {
            document.getElementById('avatarImage').src = link
        })
    })
}

setEmail()
setUsername()
setImage()

loadProfile()
getUserProjects()