/* const Category = require('../models/category');

exports.createCategory = function (req, res) {
  // const categoryData = req.body
  // console.log(categoryData)
  // const category = new Category(categoryData)
  const category = new Category()
  category.name = req.body.name

  category.save((err, createdCategory) => {
    if (err) {
      return res.json({
        success: false,
        message: err.message
      })
    }
    return res.json(createdCategory)
  })
}

exports.getCategories = function (req, res) {
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

} */

import type { Category } from '~~/server/models/types/category'
// import { HTTPError } from 'h3'
import CategoryModel from '~~/server/models/category'

export async function createCategory(event: any): Promise<any> {
  try {
    const body = await readBody(event)
    const category = new CategoryModel(body)

    const createdCategory = await category.save()
    return createdCategory
  }
  catch (err: any) {
    throw createError({ statusCode: 422, message: err.message })
  }
}

export async function getCategories(event: any): Promise<any[]> {
  try {
    const query = event ? getQuery(event) : {}
    const categories = await CategoryModel.find({}).exec()
    return categories
  }
  catch (errors: any) {
    throw createError({ statusCode: 422, message: errors.message })
  }
}

export async function getCategoryById(event: any): Promise<any> {
  try {
    const { id } = getRouterParams(event)
    const foundCategory = await CategoryModel.findById(id)

    if (!foundCategory) {
      throw createError({ statusCode: 404, message: 'Category not found' })
    }

    return foundCategory
  }
  catch (errors: any) {
    throw createError({ statusCode: 422, message: errors.message })
  }
}

export async function updateCategory(event: any): Promise<any> {
  try {
    const { id } = getRouterParams(event)
    const categoryData = await readBody<Category>(event)

    if (!categoryData) {
      throw createError({ statusCode: 400, message: 'Request body is required' })
    }

    const foundCategory = await CategoryModel.findById(id)

    if (!foundCategory) {
      throw createError({ statusCode: 404, message: 'Category not found' })
    }

    foundCategory.set(categoryData)
    const savedCategory = await foundCategory.save()
    return savedCategory
  }
  catch (errors: any) {
    throw createError({ statusCode: 422, message: errors.message })
  }
}

export async function deleteCategory(event: any): Promise<{ status: boolean, message: string }> {
  try {
    const { id } = getRouterParams(event)

    await CategoryModel.deleteOne({ _id: id })

    return {
      status: true,
      message: 'The Category has been deleted Successfully...',
    }
  }
  catch (err: any) {
    throw createError({ statusCode: 500, message: err.message })
  }
}
