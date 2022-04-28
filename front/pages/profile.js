const log = console.log
log('hay')

const form = document.querySelector('#profile');
console.log(form);
form.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('hello')
    const age = form.querySelector('.age').value
    console.log(username)
    const phone = form.querySelector('.phone').value
    const email = form.querySelector('.email').value
    const facebookPage = form.querySelector('.facebookPage').value
    if (age == '') return alert('age is required')
    if (phone == '') return alert('phone is required')
    if (email == '') return alert('email is required')
    if (facebookPage == '') return alert('facebookPage is required')
    log('write')
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
                if (answer.ok) {
                    // localStorage.setItem('token', answer.token)
                } else {
                    alert(answer.msg)
                }
            })
    }
    getUserData()