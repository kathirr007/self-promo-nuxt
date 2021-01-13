const Product = require("../models/product");
const slugify = require("slugify");
const { deleteImage, deleteImages } = require("../controllers/upload-photo");

exports.getProducts = function(req, res) {
  Product.find({ status: "published" })
    .populate("author -_id -password -products -email -role")
    .populate("category")
    .sort({ updatedAt: -1 })
    .exec((errors, products) => {
      if (errors) {
        return res.status(422).send(errors);
      }

      return res.json(products);
    });
};

exports.getadminProducts = function(req, res) {
  const userId = req.user.id;

  Product.find({ author: userId })
    .populate("author")
    .sort({ updatedAt: -1 })
    .exec((errors, products) => {
      if (errors) {
        return res.status(422).send(errors);
      }

      return res.json(products);
    });
};

exports.getProductById = (req, res) => {
  const id = req.params.id;

  Product.findById(id)
    .populate("category")
    .exec((errors, product) => {
      if (errors) {
        return res.status(422).send(errors);
      }

      return res.json(product);
    });
};

exports.getProductBySlug = (req, res) => {
  const slug = req.params.slug;

  Product.findOne({ slug })
    .populate("author -_id -password -products -email -role")
    .exec((errors, product) => {
      if (errors) {
        return res.status(422).send(errors);
      }

      return res.json(product);
    });
};

// Needs recheck
exports.createProduct = function(req, res) {
  debugger;
  const productData = req.body;
  const user = req.user;
  const product = new Product(productData);
  product.author = user;
  product.storageLocation = `projects/${slugify(productData.title, {
    replacement: "-", // replace spaces with replacement
    remove: null, // regex to remove characters
    lower: true // result in lower case
  })}`;

  product.save((errors, createdProduct) => {
    if (errors) {
      return res.status(422).send(errors);
    }

    return res.json(createdProduct);
  });
};

exports.updateProduct = function(req, res) {
  // debugger
  let images = req.files
    ? req.files.map(file => {
        return {
          location: file.location,
          size: file.size,
          originalname: file.originalname
        };
      })
    : [];
  // let updateQuery = {
  //   title: req.body.title,
  //   subtitle: req.body.subtitle,
  //   description: req.body.description,
  //   price: req.body.price,
  //   productLink: req.body.productLink,
  //   promoVideoLink: req.body.promoVideoLink,
  //   createdAt: req.body.createdAt,
  //   updatedAt: req.body.updatedAt,
  //   category: req.body.categoryID,
  //   category: req.body.categoryID,
  //   author: req.body.authorID,
  // }
  // if(req.files.length !=0) {
  //     updateQuery.image = req.files[0].location
  //     updateQuery.images = images
  // }
  const productId = req.params.id;
  const productData = req.body;
  if (req.files.length != 0) {
    productData.image = req.files[0].location;
    productData.images = images;
  } else {
    productData.images = JSON.parse(productData.images);
  }
  productData.requirements = JSON.parse(productData.requirements);
  productData.wsl = JSON.parse(productData.wsl);
  productData.updatedAt = Date.now();

  Product.findById(productId)
    .populate("category")
    .exec((errors, product) => {
      if (errors) {
        return res.status(422).send(errors);
      }

      // if (productData.status && productData.status === 'published' && !product.slug) {
      if (productData.status && productData.status === "published") {
        product.slug = slugify(product.title, {
          replacement: "-", // replace spaces with replacement
          remove: null, // regex to remove characters
          lower: true // result in lower case
        });
      }

      product.set(productData);
      product.save((errors, savedProduct) => {
        if (errors) {
          return res.status(422).send(errors);
        }

        return res.json(savedProduct);
      });
    });
};

exports.deleteProduct = async function(req, res) {
  const productId = req.params.id;

  try {
    let deletedProduct = await Product.deleteOne(
      {
        _id: productId
      },
      (err, deletedProduct) => {
        if (err) {
          return res.json({
            success: false,
            message: err.message
          });
        }
        return res.json({
          status: true,
          message: "The Product has been deleted Successfully..."
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteProductImage = async function(req, res) {
  // const productImageId = req.params.id;
  // let key = this.uploadedFiles[index].location.split('/').pop()
  // debugger
  let params = {
    Bucket: "kathirr007-portfolio",
    Key: `${req.headers.storagelocation}`
  };

  try {
    let deletedProductImage = await deleteImage(params);
    return res.json({
      status: true,
      message: "The Product Image has been deleted Successfully..."
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
