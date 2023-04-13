function myFunction() {
    element = document.getElementById("dropdown__content")
    display = element.style.display
    if (display === 'grid') {
        element.style.display = 'none'
    }
    else {
        element.style.display = 'grid'
    }
}