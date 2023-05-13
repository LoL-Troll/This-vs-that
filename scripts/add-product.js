async function updatePage() {

    var s = document.getElementsByName('product_categorie')[0];
    var option = s.options[s.selectedIndex].text;

    console.log(s, option);

    window.location = `/add-product.html?category=${option}`;
}
