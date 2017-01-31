/* eslint no-console: 0 */

'use strict';

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'info.5p2p@gmail.com',
        pass: 'amo mio marito'
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Iscrizioni 5pani2pesci <iscrizioni@5p2p.it>', // sender address
    replyTo: 'Iscrizioni 5pani2pesci <iscrizioni@5p2p.it>', // use this when from is not registered in GMAIL
    to: 'ruvido@gmail.com', // list of receivers
    subject: 'Test iscrizioni', // Subject line
    // text: 'Yeah', // plaintext body
    html: 'Wow, sei iscritto.' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent: ' + info.response);
    }
});
