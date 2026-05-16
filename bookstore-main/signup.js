function clearErrors(){
    document.getElementById('name-error').innerText = '';
    document.getElementById('email-error').innerText = '';
    document.getElementById('pass-error').innerText = '';
    document.getElementById('conf-error').innerText = '';
    document.getElementById('general-error').innerText = '';
}
function valid_sign(){

 clearErrors();
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('pass').value;
    let conf_pass = document.getElementById('conf_pass').value;
    let admin = document.getElementById('admin').checked;

    let valid = true;

    if(name == ""){
        document.getElementById('name-error').innerText = "Username is required!";
        valid = false;
    }
    if(name.includes(" ")){
    document.getElementById('name-error').innerText = "Username cannot contain spaces!";
    valid = false;
  } 
    if(email == ""){
        document.getElementById('email-error').innerText = "Email is required!";
        valid = false;
    } else if(!email.includes("@")){
        document.getElementById('email-error').innerText = "Invalid email!";
        valid = false;
    }
    if(password == ""){
        document.getElementById('pass-error').innerText = "Password is required!";
        valid = false;
    } if(password.length < 8){
    document.getElementById('pass-error').innerText = "At least 8 characters!";
    valid = false;
}
    if(conf_pass == ""){
        document.getElementById('conf-error').innerText = "Please confirm your password!";
        valid = false;
    } else if(password != conf_pass){
        document.getElementById('conf-error').innerText = "Passwords don't match!";
        valid = false;
    }

    if(!valid) return false;

    
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
    alert('user created successfully');
    window.location.href = "login.html";
       } 
    else {
    document.getElementById('general-error').innerText = data.error;
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
