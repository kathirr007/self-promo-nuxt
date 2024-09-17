const ProductHero = require('../models/product-hero');

exports.createHero = function (req, res, next) {
  const productData = req.body;

  const productHero = new ProductHero(productData);
  productHero.product = productData.product;

  productHero.save((errors, createdHero) => {
    if (errors) {
      return res.status(422).send(errors);
    }

    return res.json(createdHero);
  });
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

exports.updateProductHeroes = function (req, res, next) {
  const id = req.params.id;

  ProductHero.findById(id)
    .populate('product')
    .exec()
    .then(hero => {
      hero.set({ createdAt: new Date() })
      hero.save((errors, updatedHero) => {
        if (errors) {
          return res.status(422).send(errors);
        }

        return res.json(updatedHero);
      })
    })
    .catch(errors => {
      return res.status(422).send(errors);
    })
}

exports.deleteProductHero = async function (req, res, next) {
  const heroId = req.params.id;

  try {
    let deletedProduct = await ProductHero.deleteOne({
      _id: heroId
    }, (err, deletedHero) => {
      if (err) {
        return res.json({
          success: false,
          message: err.message
        })
      }
      return res.json({
        status: true,
        message: 'The Hero has been deleted Successfully...'
      })
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}







