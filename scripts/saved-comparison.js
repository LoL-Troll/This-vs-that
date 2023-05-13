async function sendElements(id) {
    const res = await fetch("/comparisonID", {
        method: "POST",
        body: JSON.stringify({ comparisonID: id}),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });

    let result = await res.json();
    const array = Object.values(result);
    let selectedItems = array.filter(value => value !== null);
    
    let returnedString = "compare?"
    for (let index = 1; index < selectedItems.length; index++) {
        returnedString += "id" + index + "=" + selectedItems[index - 1] + "&"
    }
    returnedString += "id" + selectedItems.length + "=" + selectedItems[selectedItems.length - 1]
    window.location.href = returnedString;
}