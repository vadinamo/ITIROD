import { getEmail, getUsername, getUserImage } from './requests.js';
import { getUserId } from './cookie.js'

function setImage() {
    getUserImage(getUserId()).then((url) => {
        document.getElementById('dropdownContentImage').src = url
    }).catch((error) => {
        console.log(error.message)
    })
}

function setUsername() {
    getUsername(getUserId()).then((username) => {
        document.getElementById('dropdownUsername').innerText = username
        document.getElementById('dropdownContentUsername').innerText = username
    }).catch((error) => {
        console.log(error.message)
    })
}

function setEmail() {
    getEmail(getUserId()).then((email) => {
        document.getElementById('dropdownContentEmail').innerText = email
    }).catch((error) => {
        console.log(error.message)
    })
}

export { setUsername, setEmail, setImage }