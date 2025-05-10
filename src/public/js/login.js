function loginCheck(data){
    loginStatus = data.status
    localStorage.setItem('token',data.token)
    if(loginStatus){
        window.location.href = "/admin?token=" + data.token
    }
    else{
        alert('Incorrect')
    }
}

document.querySelector('.login_button').addEventListener('click', function(event) {
    event.preventDefault(); 
    const login_name = document.querySelector('.login_name').value;
    const login_password = document.querySelector('.login_password').value;
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login_name, login_password })
    }
    fetch("/logindata",options)
    .then(response => response.json())
    .then(data => loginCheck(data))
    .catch(error => console.log(error))

});
