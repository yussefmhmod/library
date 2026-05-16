function valid_log(){
let username=document.getElementById('em').value;
let password=document.getElementById('pas').value;


    if(username==""||password==""){
        alert("Fill the required data!");
        return false;
    }

     else if(password.length<6){
        alert("password must be at least 6 characters");
        return false;
    }

    fetch('http://127.0.0.1:8000/users/login/' ,{
       method:'POST',
       credentials: "include", 
       headers:{
        'Content-Type' : 'application/json',
       },
       body:JSON.stringify({
          username:username,
          password:password,
       })
        
    })
    .then(res=> res.json())
    .then(data=> {
        if(data.message){
              if(data.is_admin){
                alert("logged in successfully!");
                window.location.href = "adminHP.html"; 
              }
             else{
                 alert("logged in successfully!");
                 window.location.href = "userNavBar.html";
            }
        }
        else{
            alert(data.error);
        }
    })
 
    
    return false;
}
function showpass(){
     let password=document.getElementById('pas');
     if(password.type==="password"){
        password.type="text";
     }
     else{
        password.type="password";
     }
     
}
