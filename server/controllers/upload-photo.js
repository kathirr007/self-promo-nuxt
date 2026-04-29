const {
  S3,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand
} = require('@aws-sdk/client-s3');

const multer = require('multer');
const keys = require('../keys');

const s3 = new S3({
  region: process.env.AWSRegion || 'us-east-2',
  credentials: {
    secretAccessKey: keys.AWSSecretKey,
    accessKeyId: keys.AWSAccessKeyId,

  },
});

// Custom Storage Engine for AWS SDK v3
class S3Storage {
  constructor(options) {
    this.s3 = options.s3;
    this.bucket = options.bucket;
    this.acl = options.acl || 'public-read';
    this.cacheControl = options.cacheControl || 'max-age=31536000';
    this.getKey = options.key;
    this.getMetadata = options.metadata;
  }

  _handleFile(req, file, cb) {
    const chunks = [];

    file.stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    file.stream.on('end', () => {
      const buffer = Buffer.concat(chunks);

      this.getKey(req, file, (err, key) => {
        if (err) return cb(err);

        const params = {
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ACL: this.acl,
          ContentType: file.mimetype,
          CacheControl: this.cacheControl,
        };

        this.getMetadata(req, file, (err, metadata) => {
          if (err) return cb(err);
          if (metadata) {
            params.Metadata = metadata;
          }

          // AWS SDK v3 uses Promises
          this.s3.send(new PutObjectCommand(params))
            .then((data) => {
              cb(null, {
                size: buffer.length,
                location: `https://${this.bucket}.s3.amazonaws.com/${key}`,
                key: key,
                bucket: this.bucket,
                contentType: file.mimetype,
                originalname: file.originalname,
              });
            })
            .catch((err) => cb(err));
        });
      });
    });

    file.stream.on('error', (err) => {
      cb(err);
    });
  }

  _removeFile(req, file, cb) {
    const params = {
      Bucket: this.bucket,
      Key: file.key,
    };

    // AWS SDK v3 uses Command pattern with Promises
    this.s3.send(new DeleteObjectCommand(params))
      .then(() => cb(null))
      .catch((err) => cb(err));
  }
}

const deleteImage = ((params) => {
  s3.send(new DeleteObjectCommand(params))
    .then(() => console.log('Image deleted...'))
    .catch((err) => console.log(err, err.stack));
})

const deleteImages = (() => {
  return (req, res, next) => {
    try {
      const uploadedFiles = req.headers.uploadedfiles;
      const objects = uploadedFiles && uploadedFiles !== 'undefined'
        ? JSON.parse(uploadedFiles).map(item => ({ Key: item.location.split('/').slice(3).join('/') }))
        : [];

      if(objects.length !== 0 && req.headers.deletefiles !== 'false') {
        s3.send(new DeleteObjectsCommand({
          Bucket: 'kathirr007-portfolio',
          Delete: { Objects: objects, Quiet: true }
        }))
          .then(() => console.log('Images deleted...'))
          .catch((err) => console.log(err));
      }
    } catch (e) {
      console.error("Error parsing headers for deletion", e);
    } finally {
      next();
    }
  }
})

const createS3Storage = (options) => {
  return new S3Storage(options);
};


const upload = multer({
    storage: createS3Storage({
        s3: s3,
        bucket: 'kathirr007-portfolio',
        acl: 'public-read',
        cacheControl: 'max-age=31536000',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            if(req.headers.storagelocationnew !== 'null') {
              cb(null, `${req.headers.storagelocationnew}/${Date.now().toString()}`)
            } else {
              cb(null, `${req.headers.storagelocation}/${Date.now().toString()}`)
            }
        }
    })
})

const multiUpload = multer({
    storage: createS3Storage({
        s3: s3,
        bucket: 'kathirr007-portfolio',
        acl: 'public-read',
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