const log = console.log
const { json } = require('express');
var express = require('express');
var router = express.Router();
const redis = require('redis');
let client;
let users = [];

//
// DB: connection,reading of users
//
(async () => {
  client = redis.createClient();
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
  const usersJSON = await client.get('users')
  try {
    users = JSON.parse(usersJSON)
  } catch (error) {
    log('can not read users from DB')
  }
  log(users)
})();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/auth/register', async (req, res) => {
  function successfulResponse() {
    res.json({
      ok: true,
      msg: 'user was successful created'
    })
  }
  function unsuccessfulResponse() {
    res.json({
      ok: false,
      msg: 'user already exist pleas chose another username'
    })
  }
  async function addDataToDB() {
    users.push(userData);
    const newUsersJSON = JSON.stringify(users);
    await client.set('users', newUsersJSON);
  }
  let users = [];
  const userData = req.body;
  log(userData);
  if (userData.password == '') {
    return res.json({
      ok: false,
      msg: 'password is required'
    })
  }
  const usersJSON = await client.get('users');
  log(usersJSON);
  if (usersJSON == null) {//відсутність поля users
    await addDataToDB()
    successfulResponse()
  } else {
    try {
      users = JSON.parse(usersJSON)
      const isExist = users.some((user) => {
        return user.username == userData.username
      })
      if (isExist) {
        unsuccessfulResponse()
      } else {
        await addDataToDB()
        successfulResponse()
      }
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: 'error on server'
      })
    }
  }
})

router.post('/api/auth/login', async (req, res) => {
  const userData = req.body;
  const usersJSON = await client.get('users');
  if (usersJSON == null) {//відсутність поля users
    log('usersJSON == null')
  } else {
    try {
      users = JSON.parse(usersJSON)
      for (let i = 0; i < users.length; i++) {
        if (users[i].username == userData.username) {
          if (users[i].password == userData.password) {
            const token = Math.random()
            users[i].token = token
            const newUsersJSON = JSON.stringify(users);
            await client.set('users', newUsersJSON);
            return res.json({
              ok: true,
              msg: 'user is logged',
              token,
            })
          } else {
            return res.json({
              ok: false,
              msg: 'password not correct'
            })
          }
        }
      }
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: 'error on server'
      })
    }
  }
})

router.all('/*', async (req, res, next) => {
  const token = req.headers.token
  const user = users.find((user) => token == user.token)
  log(123,user)
  if (!user) return res.json({
    ok: false,
    msg: 'user dont have access'
  })
  req.user = user
  req.userSave = {
    age: req.user.age,
    phone: req.user.phone,
    email: req.user.email,
    facebookPage: req.user.facebookPage,
    username: req.user.username
  }
  log(135,req.user)
  next()
})

router.post('/api/test', async (req, res) => {
  const data = req.body;
  res.json({
    ok: true,
    user: req.userSave
  })
})

router.get('/api/profile', async (req, res) => {
  res.json({
    ok: true,
    user: req.userSave
  })
})
router.put('/api/profile', async (req, res) => {
  const userData = req.body;
  log(userData)
  const token = req.headers.token
  for (let i = 0; i < users.length; i++) {
    if (token == users[i].token) {
      users[i].age = userData.age
      users[i].phone = userData.phone
      users[i].email = userData.email
      users[i].facebookPage = userData.facebookPage
      const newUsersJSON = JSON.stringify(users);
      await client.set('users', newUsersJSON);
      return res.json({
        ok: true,
        msg: 'user was changed',
      })
    }
  }
  return res.json({
    ok: false,
    msg: 'user not found'
  })

  // 1 крок(відредагувати юзера)
  // users-масив-константа зі всіма юзерами
  // перебрати масив і знайти юзера,який відправив запит по юзер нейм!(form)
  // req.user.username-звідси берем імя юзера
  //прописуємо йому нові данні які прийшли
  // 2 крок(зберегти його в базу данних)
})



module.exports = router;
