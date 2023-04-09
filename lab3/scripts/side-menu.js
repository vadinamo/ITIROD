function toggleNav() {
    var sideNav = document.getElementById("side-nav");
    if (sideNav.style.width == "250px") {
        sideNav.style.width = "0";
    } else {
        sideNav.style.width = "250px";
    }
}