// Email RegExp
var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

var db = firebase.initializeApp({
  databaseURL: 'https://app-5pani2pesci.firebaseio.com'
}).database()
var peopleEventRef = db.ref('events/sorrento-1719-marzo-2017')


new Vue({
  el: "#app",
  data: {
    newBuddy: '',
    buddyName: '',
    buddyEmail: '',
    buddyMobile: '',
    buddyAge: '',
    buddyCity: ''
  },
  computed: {
    validation: function () {
      return {
        name: !!this.buddyName.trim(), // !! make the variable boolean
        email: emailRE.test(this.buddyEmail)
      }
    },
    isValid: function () {
      var validation = this.validation
      console.log(validation)
      return Object.keys(validation).every(function (key) {
        // every checks if all elements pass the test implemented in the callback function
        console.log('key> '+key)
        console.log('validation key> '+validation[key])
        return validation[key]
      })
    }
  },
  methods: {
    addBuddy: function() {
      console.log('Form is valid? '+this.isValid)
      // if (this.buddyName) {
      if (this.isValid) {
        peopleEventRef.push({
          name: this.buddyName,
          email: this.buddyEmail,
          mobile: this.buddyMobile,
          age: this.buddyAge,
          city: this.buddyCity,
          notes: '',
          role: 'user',  // user roles: user, member, staff
          status: 'active', // user status: active, canceled
          registrationEmail: false, //Send a confirmation email upon registration
          registrationDate: '', //Date of registration
        })
        this.buddyName = ''
        this.buddyEmail = ''
        this.buddyMobile = ''
        this.buddyAge = ''
        this.buddyCity = ''
      }
    },
    updateBuddy: function(buddy, newText) {
      peopleEventRef.child(buddy['.key']).child('notes').set(newText)
    },
  },
  firebase: {
    // can bind to either a direct Firebase reference or a query
    people: peopleEventRef
  }
})
