
function clearErrors(){
    document.getElementById('username-error').innerText = '';
    document.getElementById('pass-error').innerText = '';
    document.getElementById('general-error').innerText = '';
}

function valid_log(){
     clearErrors();
let username=document.getElementById('em').value;
let password=document.getElementById('pas').value;
    let valid = true;

 if(username == ""){
        document.getElementById('username-error').innerText = "Username is required!";
        valid = false;
    }
    if(password == ""){
        document.getElementById('pass-error').innerText = "Password is required!";
        valid = false;
    } else if(password.length < 6){
        document.getElementById('pass-error').innerText = "At least 6 characters!";
        valid = false;
    }

    if(!valid) return false;


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
