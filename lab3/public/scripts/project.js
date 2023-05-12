import { database } from './api/config.js'
import { update, ref, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getUserId } from './cookie.js'
import { getUserImage } from './requests.js'

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

        project.tasks[taskType].push('New task')

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
            heading.textContent = task
            content.appendChild(heading)

            const image = document.createElement('img')
            image.classList.add('user-image')
            image.src = './images/IMG_2735.JPG'
            content.appendChild(image)

            const button = document.createElement('button')
            button.classList.add('round-button')
            section.appendChild(button)

            taskContainer.appendChild(section)
        })
    }).catch((error) => {
        console.error(error.message)
    });
}

updateTasks('to-do')
updateTasks('in-progress')
updateTasks('complete')

getUserImage(getUserId()).then((url) => {
    document.getElementById('profile-image').src = url
}).catch((error) => {
    console.log(error.message)
})