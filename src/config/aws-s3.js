
var aws = require('aws-sdk')
aws.config.update({
  accessKeyId: 'AKIAJZLJRQQEFWMXLOPA',
  secretAccessKey: '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',
  signatureVersion: 'v4',
  region: 'us-east-2'
})
var multer = require('multer')
var multerS3 = require('multer-s3')
var s3 = new aws.S3()
const bucket = 'reciipes-assets'
module.exports = {
  upload: multer({
    storage: multerS3({
      s3: s3,
      bucket: bucket,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, `${Date.now().toString()}-${file.originalname}`)
      }
    })
  }),
  delete (key) {
    s3.deleteObject({
      Bucket: bucket,
      Key: key.replace('https://reciipes-assets.s3.us-east-2.amazonaws.com/', '')
    }, function (err, data) {
      if (err) {
        console.log(err)
      }
    })
  }
}
