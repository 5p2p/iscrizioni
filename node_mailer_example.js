/* eslint no-console: 0 */

'use strict';

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ruvido@gmail.com',
        pass: 'amo mia moglie'
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Ruvido test <ruvido@gmail.com>', // sender address
    to: 'info@5p2p.it', // list of receivers
    subject: 'This is a real test', // Subject line
    text: 'Yeah', // plaintext body
    html: 'Yeah <b>Hello world ✔</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent: ' + info.response);
    }
});
