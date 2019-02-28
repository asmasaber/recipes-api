var ses = require('node-ses')
var client = ses.createClient({ key: 'AKIAI4P6JZAPRQUOMZBA', secret: '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', region: 'us-east-2' })

function sendMail (to, subject, content) {
  console.log('enter sendMail')
  client.sendEmail({
    to: to,
    from: 'recipesapp.mailservice@gmail.com',
    subject: subject,
    message: content,
    altText: 'plain text'
  }, function (err, data, res) {
    if (err) {
      console.log(err)
    } else {
      console.log(data)
      console.log(res)
    }
  })
}
module.exports = {
  sendResetPasswordMail (userEmail) {
    console.log('enter sendResetPasswordMail')
    sendMail(userEmail, 'Recipes Account New Password', '159753654')
  }
}
