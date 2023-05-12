import { checkAuth } from './cookie.js'

const container = document.getElementById('container')
container.innerHTML = ''

const result = checkAuth()
if (result == true) {
    const link = document.createElement('a');
    link.setAttribute('class', 'fade-button');
    link.setAttribute('href', './project-create.html');
    link.textContent = 'Create project';
    container.appendChild(link);
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