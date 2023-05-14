import { ref as dbRef, update, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { ref as stRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js"
import { database, storage } from './api/config.js'
import { getUserId } from './cookie.js'

function uploadImageAndGetLink(storage, database, uid, image) {
    const storageRef = stRef(storage, `images/users/${uid}/`);
    return uploadBytes(storageRef, image).then((snapshot) => {
        return getDownloadURL(snapshot.ref).then((link) => {
            return update(dbRef(database, `users/${uid}`), { 'avatar': link });
        });
    });
}

function getUserImage(uid) {
    const storageRef = stRef(storage, `images/users/${uid}`);
    return getDownloadURL(storageRef).then((url) => {
        return url;
    }).catch((error) => {
        console.error(error);
        return './images/avatar.png'
    });
}

function getUsername(uid) {
    const databaseRef = dbRef(database, `users/${uid}`);
    return get(databaseRef).then((user) => {
        return user.val().username;
    }).catch((error) => {
        console.log(error);
        return 'undefined';
    });
}

function getEmail(uid) {
    const databaseRef = dbRef(database, `users/${uid}`);
    return get(databaseRef).then((user) => {
        return user.val().email;
    }).catch((error) => {
        console.log(error);
        return 'undefined';
    });
}

function getProjectName(uid) {
    const databaseRef = dbRef(database, `projects/${uid}`);
    return get(databaseRef).then((user) => {
        return user.val().name;
    }).catch((error) => {
        console.log(error);
        return 'undefined';
    });
}

function getProjects() {
    let projectsData = {};
    const userId = getUserId();
    return get(dbRef(database, 'projects')).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const projectId = childSnapshot.key;
            const project = childSnapshot.val();
            if (project.users && project.users.includes(userId)) {
                projectsData[projectId] = project.name;
            }
        });
        return projectsData;
    }).catch((error) => {
        console.error(error);
    });
}

export { uploadImageAndGetLink, getUserImage, getUsername, getEmail, getProjects, getProjectName }
