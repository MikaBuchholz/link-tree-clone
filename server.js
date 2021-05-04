if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5002;

app.use(express.json())

//removed password for commit
mongoose.connect(process.env.url, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DATABASE CONNECTED!😎')
})

const mongooseSchema = mongoose.Schema
const userSchema = new mongooseSchema({
      username: String,
      listedLinks: [String]
})

var compiledUserSchema = mongoose.model('Users', userSchema)

function saveUser (username, listedLinks) {
  var user = new compiledUserSchema({username: username, listedLinks: listedLinks})

  user.save(function (err) {
    if (err) {
      return '🤬'
    }
  })
}

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/home.html'))
})

app.post('/save-user', (req, res) => {
  var username = req.body.username
  var listedLinks = req.body.listedLinks
  
  if (username != undefined || !listedLinks != undefined) {
      console.log('User data is valid 😍')
      res.status(200).send({status: 'User saved'})
      saveUser(username, listedLinks)
  }
})

app.get('/:username', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/user.html'))   
})

app.post('/user', async (req, res) => {
 
    if (!req.body) {
      return 'No body 🤦‍♂️'
    }
    
    var username = req.body.username

    var userData = await compiledUserSchema.find({username: username},   (err, data) => {
      if (err) {
        return '😠'
          } 
      })
      try {
      var links = userData[0].listedLinks
        res.status(200).send({username: username, listedLinks: links}) 
      } catch {
        res.send({username: 'NaN', listedLinks: 'NaN'})
      }
})

app.listen(PORT, () => {
  console.log('Server is listening 😎')
})