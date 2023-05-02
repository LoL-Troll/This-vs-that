function deleteComment(e){
    const parent = e.closest(".userReview");
  
      let text = "Are you sure to delete this comment?"
      if(confirm(text) == true){
          parent.remove();
      }
      else{
          return;
      }
  }