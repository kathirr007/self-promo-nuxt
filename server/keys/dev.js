module.exports = {
  DB_URI: process.env.MONGODB_URI || 'mongodb+srv://kathirr007:123454321@cluster0.467r698.mongodb.net/selfpromo-db?retryWrites=true&w=majority&appName=Cluster0',
  SESSION_SECRET: process.env.SESSION_SECRET || 'jkl123!@#$',
  AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  AWSSecretKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWSRegion: process.env.AWS_REGION || 'us-east-2'
}

/* module.exports = {
  DB_URI: 'mongodb+srv://kathirr007:123454321@cluster0-f4rer.mongodb.net/selfpromo-db?retryWrites=true&w=majority',
  SESSION_SECRET: 'jkl123!@#$'
} */