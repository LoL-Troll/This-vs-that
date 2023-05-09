async function submitData(){
    const selectElement = document.getElementById('product_category');
    const selectedValue = selectElement.value;
    console.log(selectedValue);
    // console.log("lola");
    const res = await fetch("/majed",{
        method: 'GET',
        body: selectedValue
    });

    // for (const key in res) {
    //     // const option = document.createElement('option');
    //     // option.value = key;
    //     // option.text = myObj[key];
    //     // select.appendChild(option);
    //     console.log(myObj[key]);
    //   }
}