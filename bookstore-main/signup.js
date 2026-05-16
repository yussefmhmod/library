
function valid_sign(){
    let name=document.getElementById('name').value;
let email=document.getElementById('email').value;
let password=document.getElementById('pass').value;
let conf_pass=document.getElementById('conf_pass').value;
let admin=document.getElementById('admin').checked;


    if(name==""||email==""||password==""||conf_pass==""){
        alert("Fill the required data!");
        return false;
    }

    else if(!email.includes("@")){
         alert("invalid email");
         return false; 
    }
     else if(password.length<6){
        alert("password must be at least 6 characters");
        return false;
    }
    else if(password!=conf_pass){
        alert("unmatched passwords!");
        return false;
    }
    
    
    fetch('http://127.0.0.1:8000/users/signup/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: name,
        email: email,
        password: password,
        confirm_password: conf_pass,
        is_admin: admin
    })
})
.then(res => res.json())
.then(data => {
    if(data.message){
        alert("Account created successfully!");
       window.location.href = "login.html";
    } else {
        alert(data.error);
    }
})
return false;
      
}
function showpass(fieldId){
     let password=document.getElementById(fieldId);
     if(password.type==="password"){
        password.type="text";
     }
     else{
        password.type="password";
     }
     
}
