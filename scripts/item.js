async function deleteReview(id) {
    var wantToDelete = confirm("Are you sure you want to delete this review ?");
    if (wantToDelete) {
        const response = await fetch(`http://127.0.0.1:8000/item/${id}`, {method: "DELETE"});
        const itemToDelete = await document.getElementById(id);
        itemToDelete.remove();
    }
}