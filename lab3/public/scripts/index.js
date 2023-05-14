import { checkAuth, getUserId } from './cookie.js'
import { getProjects } from './requests.js';

const container = document.getElementById('container')
container.innerHTML = ''

const result = checkAuth()
if (result == true) {
    const link = document.createElement('a');
    link.setAttribute('class', 'fade-button');
    link.setAttribute('href', './profile.html#profile');
    link.textContent = 'Profile';
    container.appendChild(link);
    getProjects().then((projectsData) => {
        for (const projectId in projectsData) {
            const project = document.createElement('a');
            project.setAttribute('class', 'fade-button');
            project.setAttribute('href', `./project.html?id=${projectId}`);
            project.textContent = projectsData[projectId];
            container.appendChild(project);
        }
    }).then(() => {
        const createProject = document.createElement('a');
        createProject.setAttribute('class', 'fade-button');
        createProject.setAttribute('href', './project-create.html');
        createProject.textContent = 'Create project';
        container.appendChild(createProject);
    }).catch((error) => {
        console.error(error);
    });
}
else {
    const login = document.createElement('a');
    login.setAttribute('class', 'fade-button');
    login.setAttribute('href', './login.html');
    login.textContent = 'Log in';
    container.appendChild(login);

    const register = document.createElement('a');
    register.setAttribute('class', 'fade-button');
    register.setAttribute('href', './register.html');
    register.textContent = 'Register';
    container.appendChild(register);
}
