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

exports.getCategoryById = (req, res) => {
  const id = req.params.id;

  Category
    .findById(id, (errors, foundCategory) => {
    if (errors) {
      return res.status(422).send(errors);
    }

    return res.json(foundCategory);
    })
}

exports.updateCategory = function (req, res) {
  const categoryId = req.params.id;
  const categoryData = req.body;

  Category.findById(categoryId, (errors, foundCategory) => {
    if (errors) {
      return res.status(422).send(errors);
    }

    foundCategory.set(categoryData);
    foundCategory.save((errors, savedCategory) => {
      if (errors) {
        return res.status(422).send(errors);
      }

      return res.json(savedCategory);
    });
  })
}

exports.deleteCategory = async function (req, res) {
  const categoryId = req.params.id;

  try {
    let deletedCategory = await Category.deleteOne({
      _id: categoryId
    }, (err, deletedCategory) => {
      // console.log(deletedCategory)
      if (err) {
        return res.json({
          success: false,
          message: err.message
        })
      }
      return res.json({
        status: true,
        message: `The Category has been deleted Successfully...`
      })
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }

}
