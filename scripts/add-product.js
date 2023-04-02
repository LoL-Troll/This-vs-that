function updatePage() {
    var s = document.getElementsByName('product_categorie')[0];
    var option = s.options[s.selectedIndex].text;


    const infoDivs = document.getElementsByClassName("device-information");
    
    for (let index = 0; index < infoDivs.length; index++) {
        const element = infoDivs[index];
        element.style.display = 'none';
    }

    if (option === "Monitor") {
        document.getElementById('common-information').style.display = 'block';
        document.getElementById('display-information').style.display = 'block';
    } else if (option === "Phone") {
        document.getElementById('common-information').style.display = 'block';
        document.getElementById('phone-information').style.display = 'block';
    } 
}