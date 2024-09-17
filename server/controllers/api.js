const ProductHero = require('../models/product-hero');
const passport = require('passport');

exports.getPageData = function (req, res, next) {
  const data = {}
  /* ProductHero.findOne()
    .sort({ createdAt: -1 })
    .populate('product')
    .exec()
    .then(productHero => {

    })
    .catch(errors => res.status(422).send(errors)) */
  ProductHero.find({})
    .sort({ createdAt: -1 })
    .populate('product')
    .exec()
    .then(heroes => {
      data.productHero = heroes;
      return res.json(data);
    })
    .catch(errors => {
      return res.status(422).send(errors);
    })
};

exports.getProductHeroes = function (req, res, next) {
  ProductHero.find({})
    .populate('product')
    .sort({ createdAt: -1 })
    .exec()
    .then(heroes => {
      return res.json(heroes);
    })
    .catch(errors => {
      return res.status(422).send(errors);
    })
}