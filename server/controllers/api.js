const ProductHero = require('../models/product-hero');
const passport = require('passport');

exports.getPageData = function (req, res, next) {
  const data = {}
/*   ProductHero.findOne()
            .sort({createdAt: -1})
            .populate('product')
            .exec(function(errors, productHero) {

    if (errors) {
      return res.status(422).send(errors);
    }

    data.productHero = productHero;
    return res.json(data);
  }) */
  ProductHero.find({})
            .sort({createdAt: -1})
            .populate('product')
            .exec(function(errors, heroes) {

    if (errors) {
      return res.status(422).send(errors);
    }

    data.productHero = heroes;
    return res.json(data);
  })
};

exports.getProductHeroes = function(req, res, next) {
  ProductHero.find({})
            .populate('product')
            .sort({createdAt: -1})
            .exec(function(errors, heroes) {
    if (errors) {
      return res.status(422).send(errors);
    }
    debugger
    return res.json(heroes);
  })
}