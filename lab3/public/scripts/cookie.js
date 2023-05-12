function createCookie(uid) {
    document.cookie = `user=${uid}`
    console.log(document.cookie)
}

export { createCookie }