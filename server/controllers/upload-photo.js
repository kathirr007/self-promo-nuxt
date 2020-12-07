const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const keys = require('../keys');

aws.config.update({
    secretAccessKey: keys.AWSSecretKey,
    accessKeyId: keys.AWSAccessKeyId,
})

const s3 = new aws.S3()
// debugger
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'kathirr007-portfolio',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            cb(null, `projects/${Date.now().toString()}`)
        }
    })
})

const multiUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'kathirr007-portfolio',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname})
        },
        key: (req, file, cb) => {
            cb(null, `projects/${Date.now().toString()}`)
        }
    })
})

module.exports = {upload, multiUpload}