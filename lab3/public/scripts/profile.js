import { database } from './api/config.js'
import { update, ref, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getUserId, logOut } from './cookie.js'
import { getEmail, getUsername, getUserImage } from './requests.js';
import { setEmail, setUsername, setImage } from './user.js';

const userId = getUserId()
const userRef = ref(database, `users/${userId}`)

document.getElementById('logOut').addEventListener("click", logOut)

function loadProfile() {
    get(userRef).then((snapshot) => {
        const user = snapshot.val()

        document.getElementById('username').value = user.username
        document.getElementById('email').value = user.email
        getUserImage(userId).then((link) => {
            document.getElementById('avatar').src = link
        })
    })
}

setEmail()
setUsername()
setImage()

loadProfile()
