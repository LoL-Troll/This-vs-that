function sendmails(){
    var s = document.getElementById('issue_type');
    var option = s.options[s.selectedIndex].text;
    var params = {message:"Topic "+ option + "\n" + "message: " + document.getElementById("exampleFormControlTextarea1").value};
    
    emailjs.send("service_d326pig","template_ki9pd09",params);
}
