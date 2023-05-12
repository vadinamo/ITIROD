import { ref as dbRef, update } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { ref as stRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js"
import { storage } from './api/config.js'

function uploadImageAndGetLink(storage, database, uid, image) {
    const storageRef = stRef(storage, `images/users/${uid}/`);
    return uploadBytes(storageRef, image).then((snapshot) => {
        return getDownloadURL(snapshot.ref).then((link) => {
            return update(dbRef(database, `users/${uid}`), { 'avatar': link }).then(() => {
                return true;
            });
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

export { uploadImageAndGetLink, getUserImage }
