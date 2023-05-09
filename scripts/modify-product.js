function updatePage() {
    
    var s = document.getElementsByName('product_categorie')[0];
    var option = s.options[s.selectedIndex].text;


    const infoDivs = document.getElementsByClassName("device-information");

    for (let index = 0; index < infoDivs.length; index++) {
        const element = infoDivs[index];
        element.style.display = 'none';
    }

    if (option === "Monitor") {
        
        document.getElementById('phoneContainer').style.display = 'none';

        document.getElementById('monitorContainer').style.display = 'block';
        document.getElementById('common-information').style.display = 'block';
        document.getElementById('display-information').style.display = 'block';
        document.getElementById('ghostMonitor').style.display = 'block';
    } else if (option === "Phone") {
        document.getElementById('monitorContainer').style.display = 'none';

        document.getElementById('phoneContainer').style.display = 'block';
        document.getElementById('common-information').style.display = 'block';
        document.getElementById('phone-information').style.display = 'block';
        document.getElementById('ghostPhone').style.display = 'block';
    }
}

function selectedBrand() {
    const s = document.getElementsByName('brand');
    console.log(s);

    for (let i = 0; i < s.length; i++) {
        const s = document.getElementsByName('brand')[i];
        let option = s.options[s.selectedIndex].text;

        if (option === "Asus") {
            {
                document.getElementById('ghostMonitorBrandLG').style.display = 'none';
                document.getElementById('ghostMonitorBrandAsus').style.display = 'block';
            }
        }
        else if (option === "LG") {
            {
                document.getElementById('ghostMonitorBrandAsus').style.display = 'none';
                document.getElementById('ghostMonitorBrandLG').style.display = 'block';
            }
        }
        else if (option === "Apple") {
            {
                document.getElementById('ghostMonitorBrandSamsung').style.display = 'none';
                document.getElementById('ghostMonitorBrandApple').style.display = 'block';
            }
        }
        else if (option === "Samsung") {
            {
                document.getElementById('ghostMonitorBrandApple').style.display = 'none';
                document.getElementById('ghostMonitorBrandSamsung').style.display = 'block';
            }
        }
    };

}

function selectedProduct() {
    const s = document.getElementsByName('selectedProduct');
    console.log(s);

    for (let i = 0; i < s.length; i++) {
        const s = document.getElementsByName('selectedProduct')[i];
        let option = s.options[s.selectedIndex].text;

        if (option === "Iphone10") {
            {
                console.log("iphone10")
                document.getElementsByClassName('ApplePhoneIphone10')[0].style.display = 'block';
                document.getElementsByClassName('ApplePhoneIphone11')[0].style.display = 'none';
            }
        }
        else if (option === "Iphone11") {
            {
                console.log("iphone11")
                document.getElementsByClassName('ApplePhoneIphone11')[0].style.display = 'block';
                document.getElementsByClassName('ApplePhoneIphone10')[0].style.display = 'none';
            }
        }
    };

}