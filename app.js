
// ---EVENT variable--------------------------------------------------------
const myEvent = '2017-02-sorrento'

// Email RegExp
var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

var alertUnique = document.getElementById('alertUnique')
var alertForm = document.getElementById('alertForm')
var inputBox = document.getElementById('inputBox')
var thankYou = document.getElementById('thankYou')

// --FIREBASE---------------------------------------------------------------
// var firebase = require("firebase")
var db = firebase.initializeApp({
  databaseURL: 'https://app-5pani2pesci.firebaseio.com'
}).database()

// --FIREBASE REFERENCES----------------------------------------------------
// event users firebase ref
const eventPath = 'events/' // events
const thisEvent = myEvent+'/'
var userRef = db.ref(eventPath+thisEvent+'users/')
// email firebase ref
var emailRef = db.ref('email/draft/')
// unique firebase ref
var uniqRef = db.ref(eventPath+thisEvent+'uniqueness/')


// --FUNCTIONS--------------------------------------------------------------
function formatToday() {
  today = new Date()
  year = today.getFullYear()
  mo = today.getMonth()+1
  month = ('0'+mo).slice(-2)
  day = ('0' + today.getDate()).slice(-2)
  return day+'/'+month+'/'+year
}
var today = formatToday()

function uniqueNess (aRef, aUser, uniqueKey) {
  return new Promise( function(respond,reject){
    aRef.orderByChild(uniqueKey).equalTo(aUser[uniqueKey]).once("value", function (snapshot){
      var unique = !(snapshot.val() !== null)
      if (unique) {
        aRef.push({name: aUser[uniqueKey]})
        .catch(function () {
          reject()
          console.log('ERR Uniqness push failed')
        })
        .then(function(){
          respond()
          // console.log('> Uniqness push')
        })
      }
      else {
        reject()
        // console.log('ERR Key is not unique')
      }
    })
    .catch(function () {
      reject()
      // console.log('ERR Uniqness check failed')
    })
  })
}

function userPush(newUser, userRef) {
  return new Promise (function (respond, reject) {
    userRef.push(newUser)
    .then(function () {
      respond()
      // console.log('> User pushed')
    })
    .catch(function () {
      reject()
      // console.log('ERR Wooow that failed')
    })
  })
}

function emailPush(newUser, emailRef) {
  return new Promise (function (respond, reject) {
    emailRef.push({
      name: newUser.name,
      email: newUser.email,
      type: 'registration',
      status: 'draft',
      event: myEvent
    })
    .then(function () {
      respond()
    })
    .catch(function () {
      reject()
    })
  })
}


// --VUEJS------------------------------------------------------------------
var vm = new Vue({
  el: "#app",
  firebase: {
    users: userRef
  },
  data: {
    todos : [
      {name: 'uno'},
      {name: 'due'},
      {name: 'tre'},
    ],
    inputHide: false,
    user: {
      name: '',
      email: '',
      mobile: '',
      age: '',
      city: '',
      intolerance: '',
      notes: '',
      role: 'user',  // user roles: user, member, staff, canceled
      notifications: [], // array of sent email notifications
      date: today, //Date of registration
    }
  },
  computed: {
    validation: function () {
      return {
        name: !!this.user.name.trim(), // !! make the variable boolean
        email: emailRE.test(this.user.email), // RegExp test for email
        mobile: !!this.user.mobile.trim(),
        age: !!this.user.age.trim(),
        city: !!this.user.city.trim(),
        // intolerance: !!this.user.intolerance.trim(),
      }
    },
    isValid: function () {
      var validation = this.validation
      return Object.keys(validation).every(function (key) {
        // every checks if all elements pass the test implemented in the callback function
        return validation[key]
      })
    },
  },
  methods: {
    updateUser: function(nBuddy, newText) {
      peopleEventRef.child(nBuddy['.key']).child('notes').set(newText)
    },
    addUser: function () {
      if (this.isValid) {
        alertForm.classList.add('hide')
        uniqueNess(uniqRef,this.user,"name")
        .then(function () {
          alertUnique.classList.add('hide')
          userPush(vm.$data.user,userRef)
          .then(function (){
            thankYou.classList.remove('hide')
            vm.$data.inputHide = true
            emailPush(vm.$data.user,emailRef)
            .catch(function () {
              console.error('ERR No email push');
            })
          })
          .catch(function () {
            console.error('ERR No user push')
          })
        })
        .catch(function () {
          console.error('ERR User is not unique')
          alertUnique.classList.remove('hide')
        })
      }
      else{
        alertForm.classList.remove('hide')
        // TODO achieve same behavior putting all alerts in a vuejs object and then v-for like:
        // TODO see https://jsfiddle.net/chrisvfritz/pyLbpzzx
      }
    }
  }
})
