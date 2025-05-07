document.querySelector('.login_button').addEventListener('click', function(event) {
    event.preventDefault(); 
    const login_name = document.querySelector('.login_name').value;
    const login_password = document.querySelector('.login_password').value;

    if (login_name === "admin" && login_password === '123') {
        window.location.href = '/admin.html';
        console.log('123');
    } else {
        console.log(login_name + ' ' + login_password);
        alert('Name or password is incorrect');
    }
});
