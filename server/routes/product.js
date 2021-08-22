import express from "express";
const router = express.Router();

import AuthCtrl from "../controllers/auth";
import ProductCtrl from "../controllers/product";
import { deleteImages, upload } from "../controllers/upload-photo";

router.get("", ProductCtrl.getProducts);

router.get(
  "/user-products",
  AuthCtrl.onlyAuthUser,
  AuthCtrl.onlyAdmin,
  ProductCtrl.getadminProducts
);
router.get("/:id", ProductCtrl.getProductById);
router.get("/s/:slug", ProductCtrl.getProductBySlug);

router.post(
  "",
  AuthCtrl.onlyAuthUser,
  AuthCtrl.onlyAdmin,
  ProductCtrl.createProduct
);
router.patch(
  "/:id",
  AuthCtrl.onlyAuthUser,
  AuthCtrl.onlyAdmin,
  // upload.none(),
  upload.array("images", 20),
  deleteImages(),
  ProductCtrl.updateProduct
);
router.delete(
  "/:id",
  AuthCtrl.onlyAuthUser,
  AuthCtrl.onlyAdmin,
  deleteImages(),
  ProductCtrl.deleteProduct
);
router.delete(
  "/ProdImage/:id",
  AuthCtrl.onlyAuthUser,
  AuthCtrl.onlyAdmin,
  ProductCtrl.deleteProductImage
);

module.exports = router;
