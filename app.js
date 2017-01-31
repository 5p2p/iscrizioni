// Email RegExp
var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const alertUnique = document.getElementById('alertUnique')
const alertForm = document.getElementById('alertForm')
const inputBox = document.getElementById('inputBox')
const thankYou = document.getElementById('thankYou')

const confirmationEmail = '<h1>Grazie!</h1>'+
'<p>Abbiamo correttamente ricevuto la tua iscrizione, ti aspettiamo il 17 Marzo.</p>'+
'<p>Ti ricordiamo che <strong>nel caso tu non possa più partecipare</strong> di comunicare'+
'tempestivamente la tua assenza. Questo ci permette di dare ad un\'altra persona la possibilità'+
'di partecipare e di gestire in maniera migliore l\'organizzazione del corso.</p>'+
'<p>A presto!</p>'+
'<p>Lo staff di 5pani2pesci</p>'

var db = firebase.initializeApp({
  databaseURL: 'https://app-5pani2pesci.firebaseio.com'
}).database()
var peopleEventRef = db.ref('events/sorrento-1719-marzo-2017')
var emailRef = db.ref('events/emails/sending')


function sendEmail(email){
  // push to Firebase
  console.log('> Queing Email to Firebase')
  emailRef.push(email)
  // reset form
  // callback(buddy)
}

function pushFirebase(buddy,callback){
  // push to Firebase
  console.log('> Pushing to Firebase')
  peopleEventRef.push(buddy)
  // reset form
  callback(buddy)
}

function uniqueEmail (buddy, callback, callback2) {
  var email = buddy.email
  peopleEventRef.orderByChild("email").equalTo(email).once("value", function(snapshot) {
    var unique = !(snapshot.val() !== null)
    console.log('unique email? '+unique)
    if (unique) {
      console.log ('> email is GOOD')
      alertUnique.classList.add('hide')
      callback(buddy,callback2)
    }
    else {
      console.log ('> email already TAKEN :(')
      alertUnique.classList.remove('hide')
    }
  })
}

function uniqueNess (buddy, uniqueKey, callback, callback2) {
  var buddyTest = buddy[uniqueKey]
  peopleEventRef.orderByChild(uniqueKey).equalTo(buddyTest).once("value", function(snapshot) {
    var unique = !(snapshot.val() !== null)
    console.log('unique key? '+unique)
    if (unique) {
      console.log ('> key value is GOOD')
      alertUnique.classList.add('hide')
      callback(buddy,callback2)
    }
    else {
      console.log ('> key value already TAKEN :(')
      alertUnique.classList.remove('hide')
    }
  })
}

function resetForm (buddy) {
  console.log('> Reset form fields')
  // console.log('this is the value of inputBoxHidden:'+vm.$data.inputBoxHidden)
  for (var key in buddy) buddy[key]=''
  thankYou.classList.remove('hide')
  vm.$data.inputBoxHidden = true
}

function postPushStuff () {
  console.log('> Show Thank You message')
  thankYou.classList.remove('hide')
  vm.$data.inputBoxHidden = true

  console.log ('> Queue Confirmation Email')
  var emailObj = vm.$data.emailObj
  var email = vm.$data.nBuddy.email
  emailObj.to = email
  emailRef.push(emailObj)
}

var vm = new Vue({
  el: "#app",
  data: {
    inputBoxHidden: false,
    emailObj: {
      from: 'iscrizioni@5p2p.it',
      to: '',
      subject: 'Conferma iscrizione Sorrento 17-19 Marzo',
      body: confirmationEmail
    },
    nBuddy: {
      name: '',
      email: '',
      mobile: '',
      age: '',
      city: '',
      food: '',
      notes: '',
      role: 'user',  // user roles: user, member, staff
      status: 'active', // user status: active, canceled
      registrationEmail: false, //Send a confirmation email upon registration (not email validation)
      registrationDate: '', //Date of registration
    }
  },
  computed: {
    validation: function () {
      return {
        name: !!this.nBuddy.name.trim(), // !! make the variable boolean
        email: emailRE.test(this.nBuddy.email), // RegExp test for email
        // mobile: !!this.nBuddy.mobile.trim(),
        // age: !!this.nBuddy.age.trim(),
        // city: !!this.nBuddy.city.trim(),
        // food: !!this.nBuddy.food.trim(),
      }
    },
    isValid: function () {
      var validation = this.validation
      console.log(validation)
      return Object.keys(validation).every(function (key) {
        // every checks if all elements pass the test implemented in the callback function
        console.log('key> '+key+' ===> '+validation[key])
        return validation[key]
      })
    },
  },
  methods: {
    addBuddy: function(){
      if (this.isValid) {
        console.log ('>> Form is valid')
        alertForm.classList.add('hide')
        // uniqueEmail(this.nBuddy,
        uniqueNess(this.nBuddy, "name",
          pushFirebase,
          postPushStuff
          // resetForm
        )
      }
      else {
        console.log('>> Something is missing in your form')
        alertForm.classList.remove('hide')
        // TODO achieve same behavior putting all alerts in a vuejs object and then v-for like:
        // TODO see https://jsfiddle.net/chrisvfritz/pyLbpzzx
      }
    },
    updateBuddy: function(nBuddy, newText) {
      peopleEventRef.child(nBuddy['.key']).child('notes').set(newText)
    }
  },
  // firebase: {
  //   // can bind to either a direct Firebase reference or a query
  //   people: peopleEventRef
  // }
})
