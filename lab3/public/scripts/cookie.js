function createCookie(uid) {
    document.cookie = `user=${uid};`
}

function checkAuth() {
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));
    if (userCookie) {
        return true
    }

    return false
}

function logOut() {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("login.html");
}

function getUserId() {
    if (checkAuth()) {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('user='))
            .split('=')[1];
    }
}

export { createCookie, checkAuth, getUserId, logOut }