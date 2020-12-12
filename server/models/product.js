const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  slug: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  subtitle: String,
  image: String,
  storageLocation: String,
  storageLocationNew: {type: String, default: null},
  images: Array,
  description: {type: String, default: ''},
  rating: Number,
  // what students learn
  wsl: [{type: Schema.Types.Mixed, value: String}],
  requirements: [{type: Schema.Types.Mixed, value: String}],
  promoVideoLink: String,
  productLink: String,
  // githubLink: String,
  price: Number,
  discountedPrice: Number,
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted', 'published'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  author: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Product', productSchema );
