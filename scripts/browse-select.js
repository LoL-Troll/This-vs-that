selectedItems = []


function selectButton(button){
    let data = button.getAttribute("id");
    let isSelected = button.getAttribute("isSelected");
    if(selectedItems.length <= 3 || (isSelected)) {
        if (isSelected) {
            button.classList.remove("selected");
            removeItem(data);
            button.setAttribute("isSelected", "");
        } else {
            button.classList.add("selected");
            addItem(data);
            button.setAttribute("isSelected", "true");
        }
    }
    else {
        alert("You can only select 4 items at a time")
    }
    
}


function addItem(item){
    if(!selectedItems.includes(item)){
        selectedItems.push(item);
    }
    console.log("These are the selected items id" + selectedItems)
}

function removeItem(item){
    if(selectedItems.includes(item)){
        selectedItems = removeElementFromArray(selectedItems, item);
    }
    console.log("These are the selected items id" + selectedItems)
}

function removeElementFromArray(arr,val){
    let index = arr.indexOf(val);
    if(index !== -1){
        arr.splice(index, 1);
    }
    console.log(arr);
    return arr;
}

function sendElements(){
    let returnedString = "compare?"
    for (let index = 1; index < selectedItems.length; index++) {
        returnedString += "id" + index + "=" + selectedItems[index-1] + "&"
    }
    returnedString += "id" + selectedItems.length + "=" + selectedItems[selectedItems.length-1]
    return returnedString;
}