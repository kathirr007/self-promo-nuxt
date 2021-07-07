const express = require("express");
const router = express.Router();

const experienceCtrl = require("../controllers/experience");
const AuthCtrl = require("../controllers/auth");

router.get("", experienceCtrl.getExperiences);

router.get("/medium", experienceCtrl.getMediumExperiences);

router.get(
  "/me",
  AuthCtrl.onlyAuthUser,
  AuthCtrl.onlyAdmin,
  experienceCtrl.getUserExperiences
);

router.get("/:id", experienceCtrl.getExperienceById);

router.get("/s/:slug", experienceCtrl.getExperienceBySlug);

router.post(
  "",
  AuthCtrl.onlyAuthUser,
  AuthCtrl.onlyAdmin,
  experienceCtrl.createExperience
);

router.patch(
  "/:id",
  AuthCtrl.onlyAuthUser,
  AuthCtrl.onlyAdmin,
  experienceCtrl.updateExperience
);

router.delete(
  "/:id",
  AuthCtrl.onlyAuthUser,
  AuthCtrl.onlyAdmin,
  experienceCtrl.deleteExperience
);

module.exports = router;
