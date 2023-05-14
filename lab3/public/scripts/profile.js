import { database, auth, storage } from './api/config.js'
import { update, ref as dbRef, get, remove } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { updateEmail, updatePassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getUserId, logOut, checkAuth } from './cookie.js'
import { getEmail, getUserImage, uploadImageAndGetLink, getProjectName } from './requests.js';
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

function loadInvitations() {
    getEmail(userId).then((email) => {
        get(dbRef(database, 'invitations')).then((result) => {
            const invitations = result.val()
            const userInvitations = document.getElementById('invitations')
            userInvitations.innerHTML = ''
            for (const key in invitations) {
                if (invitations[key].email == email) {
                    const div = document.createElement('div')
                    div.classList.add('invitations__invite')
                    div.id = `invite${key}`

                    const p = document.createElement('p')
                    p.classList.add('invitations__project-name')
                    getProjectName(invitations[key].project_id).then((projectName) => {
                        p.innerText = projectName
                    })
                    div.appendChild(p)

                    const acceptBtn = document.createElement('button')
                    acceptBtn.classList.add('invitations__button')
                    acceptBtn.classList.add('invitations__button_accept')
                    acceptBtn.addEventListener('click', () => accept(key));
                    div.appendChild(acceptBtn)

                    const declineBtn = document.createElement('button')
                    declineBtn.classList.add('invitations__button')
                    declineBtn.classList.add('invitations__button_decline')
                    declineBtn.addEventListener('click', () => decline(key));
                    div.appendChild(declineBtn)

                    userInvitations.appendChild(div)
                }
            }
        }).catch((error) => {
            console.error(error.message)
        })
    })
        .catch((error) => {
            console.error(error.message)
        })
}

function removeInvitation(id) {
    remove(dbRef(database, `invitations/${id}`))
        .then(() => {
            loadInvitations()
        })
}

function accept(id) {
    get(dbRef(database, `invitations/${id}`)).then((invitation) => {
        const projectId = invitation.val().project_id
        const projectRef = dbRef(database, `projects/${projectId}`)

        get(projectRef).then((snapshot) => {
            const projectData = snapshot.val();

            if (projectData.users.includes(userId)) {
                console.log('already here')
                return;
            }

            update(projectRef, {
                users: [...projectData.users, userId],
            })
                .then(() => {
                    getUserProjects()
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    })
        .then(() => {
            removeInvitation(id)
        })
}

function decline(id) {
    removeInvitation(id)
}

setEmail()
setUsername()
setImage()

loadProfile()
getUserProjects()
loadInvitations()