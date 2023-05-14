async function getJarirPrice(jarir_link) {

    if (jarir_link) {
        var len = jarir_link.length;
        jarir_link = jarir_link.slice(len - 11, len - 5);
        jarir_link = "https://www.jarir.com/api/catalogv1/product/store/sa-en/sku/" + jarir_link;
        var price;
        try {
            const response = await fetch(jarir_link);
            const data = await response.json();

            price = data.hits.hits[0]._source.final_price;
        } catch (error) {
            console.error(error);
        }
        return price;
    }
    return "Not Available";
}

async function getNoonPrice(noon_link) {
    if (noon_link) {
        var len = noon_link.length;
        noon_link = noon_link.slice(29);
        noon_link = "https://www.noon.com/_svc/catalog/api/v3/u" + noon_link;
        let price;

        try {
            const response = await fetch(noon_link, {
                "headers": { "x-locale": "en-sa" },
                "method": "GET"
            });

            const data = await response.json();

            price = await data.product.variants[0].offers[0].sale_price;

            if (!price) {
                price = await data.product.variants[0].offers[0].price;
            }

        } catch (error) {
            console.error(error);
        }
        return price ? price : "Not Available";
    }
    return "Not Available";

}

module.exports = {
    getJarirPrice,
    getNoonPrice
}