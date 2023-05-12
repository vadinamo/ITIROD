import { database } from './api/config.js'
import { update, ref, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

const projectId = new URLSearchParams(window.location.search).get('id')
console.log(projectId)

document.querySelectorAll('.round-button').forEach(button => {
    button.addEventListener('click', () => {
        addTask(button.id)
    });
});

function addTask(taskType) {
    taskType = taskType.replace("add-", "")
    const projectRef = ref(database, `projects/${projectId}`)
    get(projectRef).then((snapshot) => {
        const project = snapshot.val()
        if (!project.tasks) {
            project.tasks = {}
        }
        if (!project.tasks[taskType]) {
            project.tasks[taskType] = []
        }

        project.tasks[taskType].push('asd')

        console.log(project)

        update(projectRef, project).then(() => {
            console.log('Поля успешно обновлены.');
        }).catch((error) => {
            console.error(error.message);
        });
    }).catch((error) => {
        console.error(error.message)
    });

}