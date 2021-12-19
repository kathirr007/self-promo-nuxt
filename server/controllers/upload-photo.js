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

/* var AWS = require('aws-sdk');

AWS.config.loadFromPath('./credentials-ehl.json');

var s3 = new AWS.S3();
var params = {  Bucket: 'your bucket', Key: 'your object' };
 */
const deleteImage = ((params) => {
  // debugger
  s3.deleteObject(params, function(err, data) {
    if (err) console.log(err, err.stack);  // error
    else     console.log('Image deleted...');                 // deleted
  });
})

const deleteImages = (() => {
  // debugger
  return (req, res, next) => {
    const objects = req.headers.uploadedfiles !== 'undefined' ? JSON.parse(req.headers.uploadedfiles).map(key => ({ Key: key.location.split('/').splice(3).join('/') })) : [];
    // const newLocation = req.headers.storagelocationnew === 'null' ? false : req.headers.storagelocationnew !== req.headers.storagelocation ? true : false
    if(objects.length !== 0 && req.headers.deletefiles !== 'false') {
      s3.deleteObjects({Bucket: 'kathirr007-portfolio', Delete: { Objects: objects, Quiet: true }}, function(err, data) {
        if (err && err !== null) {
          console.log(err); // error
        } else {
          console.log('Images deleted...'); // deleted
        }
      });
      next()
    } else {
      next()
    }
  }
})

// debugger
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'kathirr007-portfolio',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        cacheControl: 'max-age=31536000',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            // let temp = JSON.parse(req.body)
            if(req.headers.storagelocationnew !== 'null') {
              cb(null, `${req.headers.storagelocationnew}/${Date.now().toString()}`)
            } else {
              cb(null, `${req.headers.storagelocation}/${Date.now().toString()}`)
            }
        }
    })
})

const multiUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'kathirr007-portfolio',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        cacheControl: 'max-age=31536000',
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname})
        },
        key: (req, file, cb) => {
            cb(null, `projects/${Date.now().toString()}`)
        }
    })
})

module.exports = {upload, multiUpload, deleteImage, deleteImages}