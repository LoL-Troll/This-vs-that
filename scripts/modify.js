//to remove the child nodes of the selector.
async function removeAllChildNodes(parent, text) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    parent.appendChild(new Option(text, text, selected = true));
}
// to pick option from category.
async function submitCat() {
    const selectElement = document.getElementById("product_category");
    const selectedValue = selectElement.value;

    const res = await fetch("/brand", {
        method: "POST",
        body: JSON.stringify({ catagoery: selectedValue }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });

    await removeAllChildNodes(document.getElementById("product_brand"), "Select a brand");
    await removeAllChildNodes(document.getElementById("product_name"), "Select a device");
    document.getElementById("deviceName").style.display = "none";
    showBrands(await res.json());
}
// to send selected category to recieve brand
async function showBrands(brands) {

    const container = document.getElementById("product_brand");

    for (brand of brands) {
        container.appendChild(new Option(brand.manufacturer, brand.manufacturer));
    }
    document.getElementById("Brand").style.display = "block";
}

//to pick option from brands
async function submitBrand() {
    const selectElement = document.getElementById("product_brand");
    const text = selectElement[0].value;

    const selectedValue = selectElement.value;
    const selectedCategory = document.getElementById("product_category").value;
    const res = await fetch("/device", {
        method: "POST",
        body: JSON.stringify({ catagoery: selectedCategory, name: selectedValue }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    await removeAllChildNodes(document.getElementById("product_name"), "Select a device");

    showDevices(await res.json(), text);
}
// to send selected brand and category to recieve brand
async function showDevices(devices, text) {

    const container = document.getElementById("product_name");
    for (device of devices) {
        container.appendChild(new Option(device.name, device.id));
    }
    document.getElementById("deviceName").style.display = "block";
}

async function QueryPage() {
    let id = document.getElementById("product_name").value;
    window.location = `/modify.html?id=${id}`;
};