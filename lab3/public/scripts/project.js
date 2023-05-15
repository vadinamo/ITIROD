import { database } from './api/config.js'
import { update, ref, get, set, push, remove } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getUserId, logOut } from './cookie.js'
import { getUserImage, getUsername } from './requests.js'
import { setEmail, setUsername, setImage, getUserProjects } from './user.js';

const currentProjectId = new URLSearchParams(window.location.search).get('id')
const projectRef = ref(database, `projects/${currentProjectId}`)

const containers = [document.getElementById('to-do'),
document.getElementById('in-progress'),
document.getElementById('complete')]

let draggables = []
let from = ''
let to = ''

document.querySelectorAll('.round-button').forEach(button => {
    if (!button.matches('#inviteMember, #createProject')) {
        button.addEventListener('click', () => {
            addTask(button.id)
        });
    }
});

document.getElementById('logOut').addEventListener("click", logOut)
document.getElementById('sentInvitation').addEventListener('click', sentInvitation)

function addTask(taskType) {
    taskType = taskType.replace("add-", "")
    get(projectRef).then((snapshot) => {
        const project = snapshot.val()
        if (!project.tasks) {
            project.tasks = {}
        }
        let taskId = 0
        if (!project.tasks[taskType]) {
            project.tasks[taskType] = []
            taskId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        }
        else {
            taskId = push(ref(database, `projects/${currentProjectId}/tasks`)).key
        }

        project.tasks[taskType].push({ id: taskId, text: 'New task', user: getUserId() })

        update(projectRef, project).then(updateTasks(taskType))
            .catch((error) => {
                alert(error.message)
            });
    }).catch((error) => {
        alert(error.message)
    });
}

function removeTask(taskId, taskType) {
    get(projectRef).then((snapshot) => {
        const project = snapshot.val()
        project.tasks[taskType] = project.tasks[taskType].filter(task => task.id !== taskId);
        update(projectRef, project)
            .then(() => {
                document.getElementById(taskType).removeChild(document.getElementById(taskId))
            })
            .catch((error) => {
                alert(error.message);
            });
    })
        .catch((error) => {
            console.error(error.message)
        })
}




function updateTasks(taskType) {
    get(projectRef).then((snapshot) => {
        const project = snapshot.val()
        if (!project.tasks || !project.tasks[taskType]) {
            return
        }

        const taskContainer = document.getElementById(taskType)
        taskContainer.innerHTML = ''
        project.tasks[taskType].forEach((task) => {
            let section = document.createElement('section')
            section.classList.add('task-view__card')
            section.classList.add('draggable')
            section.id = `${task.id}`

            const content = document.createElement('div')
            content.classList.add('task-view__card-content')
            section.appendChild(content)

            const heading = document.createElement('h2')
            heading.classList.add('task-view__card-text')
            heading.textContent = task.text
            content.appendChild(heading)

            const image = document.createElement('img')
            image.classList.add('user-image')
            getUserImage(task.user).then((url) => {
                image.src = url
            })
            content.appendChild(image)

            const button = document.createElement('button')
            button.classList.add('round-button')

            const buttonImage = document.createElement('img')
            buttonImage.src = './images/defaults/trashcan.png'
            button.appendChild(buttonImage)
            button.addEventListener('click', () => removeTask(task.id, taskType));
            section.appendChild(button)

            section.draggable = 'true'
            section.addEventListener('dragstart', () => {
                section.classList.add('dragging')
                from = section.parentElement.id
            })

            section.addEventListener('dragend', () => {
                section.classList.remove('dragging')
                to = section.parentElement.id

                updateTaskOrder()
            })
            draggables.push(section)
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

function sentInvitation() {
    const email = document.getElementById('inviteEmail').value
    const invite = {
        'email': email,
        'project_id': currentProjectId
    }

    const inviteId = push(ref(database, 'invitations')).key
    set(ref(database, 'invitations/' + inviteId), invite)
        .catch((error) => {
            alert(error.message);
        });
}

containers.forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            container.appendChild(draggable)
        } else {
            container.insertBefore(draggable, afterElement)
        }
    })
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

function GetTaskOrder(taskType) {
    const container = document.getElementById(taskType)
    let order = []
    container.querySelectorAll('[id]').forEach((child) => {
        order.push(child.id)
    })
    return order
}

function updateTaskOrder() {
    if (from != to) {
        get(projectRef).then((snapshot) => {
            let project = snapshot.val()
            const allTasks = project.tasks[from].concat(project.tasks[to]).filter(task => task !== undefined);

            const fromOrder = GetTaskOrder(from)
            const toOrder = GetTaskOrder(to)

            project.tasks[from] = []
            project.tasks[to] = []

            fromOrder.forEach((taskId) => {
                project.tasks[from].push(allTasks.find(task => task.id === taskId))
            })
            toOrder.forEach((taskId) => {
                project.tasks[to].push(allTasks.find(task => task.id === taskId))
            })

            update(projectRef, { tasks: project.tasks })
                .then(() => {
                    updateTasks(from)
                    updateTasks(to)
                })
        })
            .catch((error) => {
                console.error(error.message)
            })
    }
    else {
        get(projectRef).then((snapshot) => {
            let project = snapshot.val()
            const allTasks = project.tasks[from]

            const order = GetTaskOrder(from)
            project.tasks[from] = []

            order.forEach((taskId) => {
                project.tasks[from].push(allTasks.find(task => task.id === taskId))
            })

            update(projectRef, { tasks: project.tasks })
                .then(() => {
                    updateTasks(from)
                })
        })
            .catch((error) => {
                console.error(error.message)
            })
    }
}

updateTasks('to-do')
updateTasks('in-progress')
updateTasks('complete')

setEmail()
setUsername()
setImage()

getUserProjects(currentProjectId)
getProjectUsers()