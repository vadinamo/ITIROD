import { database } from './api/config.js'
import { update, ref, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getUserId } from './cookie.js'
import { getUserImage, getUsername } from './requests.js'

const projectId = new URLSearchParams(window.location.search).get('id')
const projectRef = ref(database, `projects/${projectId}`)

document.querySelectorAll('.round-button').forEach(button => {
    button.addEventListener('click', () => {
        addTask(button.id)
    });
});

function addTask(taskType) {
    taskType = taskType.replace("add-", "")
    get(projectRef).then((snapshot) => {
        const project = snapshot.val()
        if (!project.tasks) {
            project.tasks = {}
        }
        if (!project.tasks[taskType]) {
            project.tasks[taskType] = []
        }

        project.tasks[taskType].push({ 'text': 'New task', 'user': getUserId() })

        update(projectRef, project).then(updateTasks(taskType))
            .catch((error) => {
                alert(error.message)
            });
    }).catch((error) => {
        alert(error.message)
    });
}

function updateTasks(taskType) {
    get(projectRef).then((snapshot) => {
        const project = snapshot.val()
        if (!project.tasks || !project.tasks[taskType]) {
            return
        }

        const taskContainer = document.getElementById(taskType)
        taskContainer.innerHTML = ''
        project.tasks[taskType].forEach(task => {
            let section = document.createElement('section')
            section.classList.add('task-view__card')

            const content = document.createElement('div')
            content.classList.add('task-view__card-content')
            section.appendChild(content)

            const heading = document.createElement('h2')
            heading.classList.add('task-view__card-text')
            heading.textContent = task.text
            content.appendChild(heading)

            const image = document.createElement('img')
            image.classList.add('user-image')
            getUserImage(getUserId()).then((url) => {
                image.src = url
            })
            content.appendChild(image)

            const button = document.createElement('button')
            button.classList.add('round-button')

            const buttonImage = document.createElement('img')
            buttonImage.src = './images/defaults/comment.png'
            button.appendChild(buttonImage)
            section.appendChild(button)

            taskContainer.appendChild(section)
        })
    }).catch((error) => {
        console.error(error.message)
    });
}

function getProjectUsers() {
    get(projectRef).then((snapshot) => {
        const project = snapshot.val()

        const projectMembers = document.getElementById('project-members')
        project.users.forEach((uid) => {
            const member = document.createElement('div')
            member.classList.add('project-members__member')
            
            const image = document.createElement('img')
            image.classList.add('user-image')
            getUserImage(uid).then((url) => {
                image.src = url
            })
            member.appendChild(image)

            const name = document.createElement('p')
            getUsername(uid).then((username) => {
                name.textContent = username
            })
            name.textContent = 'username'
            member.appendChild(name)

            projectMembers.appendChild(member)
        })
    }).catch((error) => {
        console.error(error.message)
    });
}

updateTasks('to-do')
updateTasks('in-progress')
updateTasks('complete')

getProjectUsers()

getUserImage(getUserId()).then((url) => {
    document.getElementById('profile-image').src = url
}).catch((error) => {
    console.log(error.message)
})
