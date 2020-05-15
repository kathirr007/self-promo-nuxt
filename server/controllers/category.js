const Category = require('../models/category');

/* exports.createCategory = async (req, res) => {
  try {
      let category = new Category()
      category.name = req.body.name

      await category.save()

      res.json({
          status: true,
          message: 'Category is created Successfully...'
      })
  } catch(err) {
      res.status(500).json({
          success: false,
          message: err.message
      })
  }
} */

exports.createCategory = function(req, res) {
  // const categoryData = req.body
  // console.log(categoryData)
  // const category = new Category(categoryData)
  const category = new Category()
  category.name = req.body.name

  category.save((err, createdCategory) => {
    if(err) {
      return res.json({
        success: false,
        message: err.message
      })
    }
    return res.json(createdCategory)
  })
}

exports.getCategories = function(req, res) {
  Category.find({})
        .exec((errors, categories) => {

    if (errors) {
      return res.status(422).send(errors);
    }

    return res.json(categories);
  });
}
