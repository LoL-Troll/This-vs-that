var count = 1;
function addDevice() {
    count++;
    document.getElementById("device-" + count).style.display = "block"
    if (count === 4) {
        document.getElementById("more").style.display = "none"
    }
}