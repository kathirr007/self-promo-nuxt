const express = require('express');
const router = express.Router();

const AuthCtrl = require('../controllers/auth');
const CategoriesCtrl = require('../controllers/category');

router.post('',
              AuthCtrl.onlyAuthUser,
              AuthCtrl.onlyAdmin,
              CategoriesCtrl.createCategory);

router.get('', CategoriesCtrl.getCategories);
router.get('/:id', CategoriesCtrl.getCategoryById);

router.patch('/:id',
              AuthCtrl.onlyAuthUser,
              AuthCtrl.onlyAdmin,
              CategoriesCtrl.updateCategory)

router.delete('/:id',
              AuthCtrl.onlyAuthUser,
              AuthCtrl.onlyAdmin,
              CategoriesCtrl.deleteCategory)

module.exports = router;
