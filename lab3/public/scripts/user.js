import { getEmail, getUsername, getUserImage, getProjects } from './requests.js';
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

function getUserProjects(currentProjectId = '') {
    const userProjects = document.getElementById('userProjects')
    getProjects().then((projectsData) => {
        for (const projectId in projectsData) {
            const link = document.createElement('a')
            link.classList.add('project-container__project')
            if (projectId == currentProjectId) {
                link.classList.add('project-container__project_current')
            }
            link.setAttribute('href', `./project.html?id=${projectId}`)
            link.textContent = projectsData[projectId]
            userProjects.appendChild(link)
        }
    })
        .then(() => {
            const link = document.createElement('a')
            link.classList.add('round-button')
            link.classList.add('plus')
            link.href = "./project-create.html"
            link.id = "createProject"
            link.innerText = '+'
            userProjects.appendChild(link)
        })
        .catch((error) => {
            console.error(error.message)
        })
}

export { setUsername, setEmail, setImage, getUserProjects }