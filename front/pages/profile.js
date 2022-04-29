const log = console.log
log('hay')

const form = document.querySelector('#profile');
console.log(form);
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const age = form.querySelector('.age').value
    const phone = form.querySelector('.phone').value
    const email = form.querySelector('.email').value
    const facebookPage = form.querySelector('.facebookPage').value
    if (age == '') return alert('age is required')
    if (phone == '') return alert('phone is required')
    if (email == '') return alert('email is required')
    if (facebookPage == '') return alert('facebookPage is required')
    const userData = {
        age,
        phone,
        email,
        facebookPage
    }
    log(userData)
    saveUserData(userData)
})

function saveUserData(userData) {
    const postOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        },
        body: JSON.stringify(userData)
    }

    fetch('http://localhost:3000/api/profile', postOptions)
        .then((req) => req.json())
        .then((answer) => {
            log(answer)
            if (answer.ok) {
                location.reload()
                // localStorage.setItem('token', answer.token)
            } else {
                alert(answer.msg)
            }
        })
}
function getUserData() {
    const postOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        },
        // body: JSON.stringify({ a: 1 })
    }

    fetch('http://localhost:3000/api/profile', postOptions)
        .then((req) => req.json())
        .then((answer) => {
            log(answer)
            form.querySelector('.age').value = answer.user.age
            form.querySelector('.phone').value = answer.user.phone
            form.querySelector('.email').value = answer.user.email
            form.querySelector('.facebookPage').value = answer.user.facebookPage

            if (answer.ok) {
                // localStorage.setItem('token', answer.token)
            } else {
                alert(answer.msg)
            }
        })
}
getUserData()