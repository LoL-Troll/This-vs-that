selectedItems = []


function selectButton(button) {
    let data = button.getAttribute("id");
    let deviceName = button.querySelector(".card-title").innerText;

    let isSelected = button.getAttribute("isSelected");
    if (selectedItems.length <= 3 || (isSelected)) {
        if (isSelected) {
            button.classList.remove("selected");
            removeItem(data, deviceName);
            button.setAttribute("isSelected", "");
        } else {
            button.classList.add("selected");
            addItem(data, deviceName);
            button.setAttribute("isSelected", "true");
        }
    }
    else {
        alert("You can only select 4 items at a time")
    }

}


function addItem(item, deviceName) {
    if (!selectedItems.includes(item)) {
        selectedItems.push(item);
    }

    let li_device_name = document.createElement('li');
    li_device_name.innerText = deviceName;
    li_device_name.setAttribute("id", `li_${item}`);
    li_device_name.setAttribute("class", `bg-light border-light-subtle px-3 py-2 m-2 rounded-5`)

    document.getElementById("selected_devices_tags").appendChild(li_device_name);
}

function removeItem(item) {
    if (selectedItems.includes(item)) {
        selectedItems = removeElementFromArray(selectedItems, item);
    }
    let ul_devices_names = document.getElementById("selected_devices_tags");
    let li_device_name = document.getElementById(`li_${item}`);
    let removed = ul_devices_names.removeChild(li_device_name);
}

function removeElementFromArray(arr, val) {
    let index = arr.indexOf(val);
    if (index !== -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function sendElements() {
    if(selectedItems.length >= 1){
        let returnedString = "compare?"
        for (let index = 1; index < selectedItems.length; index++) {
            returnedString += "id" + index + "=" + selectedItems[index - 1] + "&"
        }
        returnedString += "id" + selectedItems.length + "=" + selectedItems[selectedItems.length - 1]
    return returnedString;
    }
    else{
        alert("You need to select at least one product")
        return "browse-select.html";
    }
    
}