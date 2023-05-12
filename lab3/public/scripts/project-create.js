import { database } from './api/config.js'
import { set, ref, push } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getUserId } from './cookie.js'

submitData.addEventListener('click', (e) => {
    let name = document.getElementById('name').value
    let description = document.getElementById('description').value

    const project_id = push(ref(database, 'projects')).key
    set(ref(database, 'projects/' + project_id), {
        name: name,
        description: description,
        users: [getUserId()],
        tasks: {"to-do": [], "in-progress": [], "complete": []}
    })
        .then(() => {
            window.location.replace(`project.html?id=${project_id}`);
        })
        .catch((error) => {
            alert(error.message);
        });
})