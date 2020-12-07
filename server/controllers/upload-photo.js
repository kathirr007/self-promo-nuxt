const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const keys = require('../keys');

aws.config.update({
    secretAccessKey: keys.AWSSecretKey,
    accessKeyId: keys.AWSAccessKeyId,
})

const s3 = new aws.S3()

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'vue-amazon-clone-v1',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            cb(null, `portfolio/${Date.now().toString()}`)
        }
    })
})

const multiUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'vue-amazon-clone-v1',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname})
        },
        key: (req, file, cb) => {
            cb(null, `portfolio/${Date.now().toString()}`)
        }
    })
})

module.exports = {upload, multiUpload}