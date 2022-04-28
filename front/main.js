const log = console.log;
const form = document.querySelector('#register');
console.log(form);
form.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('hello')
    const username = form.querySelector('.username').value
    console.log(username)
    const password = form.querySelector('.password').value
    if (username == '') return alert('username is required')
    if (password == '') return alert('password is required')
    log('write')
    const postOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    }
    fetch('http://localhost:3000/api/auth/register', postOptions)
        .then((req) => req.json())
        .then((answer) => {
            log(answer)
            if (answer.ok) {
                alert('user was successful created')
            } else {
                alert(answer.msg)
            }
        })
})

const form2 = document.querySelector('#login');
console.log(form2);
form2.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('hello')
    const username = form2.querySelector('.username').value
    console.log(username)
    const password = form2.querySelector('.password').value
    if (username == '') return alert('username is required')
    if (password == '') return alert('password is required')
    log('write')
    const postOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    }
    fetch('http://localhost:3000/api/auth/login', postOptions)
        .then((req) => req.json())
        .then((answer) => {
            log(answer)
            if (answer.ok) {
                localStorage.setItem('token', answer.token)
                alert('user was logged')
            } else {
                alert(answer.msg)
            }
        })
})
function test() {
    log(localStorage.getItem('token'))
    const postOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        },
        body: JSON.stringify({a:1})
    }
    fetch('http://localhost:3000/api/test', postOptions)
    .then((req) => req.json())
    .then((answer) => {
        log(answer)
        if (answer.ok) {
            // localStorage.setItem('token', answer.token)
        } else {
            alert(answer.msg)
        }
    })
}

