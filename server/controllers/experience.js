const Experience = require("../models/experience");
const slugify = require("slugify");
const request = require("request");
const AsyncLock = require("async-lock");
const experience = require("../models/experience");
const lock = new AsyncLock();

const MEDIUM_URL = "https://medium.com/@filipjerga/latest?format=json&limit=20";

function parseFilters(queries) {
  const parsedQueries = {};
  if (queries.filter) {
    Object.keys(queries).forEach(qKey => {
      if (qKey.includes("filter")) {
        const pKey = qKey.match(/\[([^)]+)\]/)[1];
        parsedQueries[pKey] = queries[qKey];
      }
    });
  }

  return parsedQueries;
}

exports.getExperiences = (req, res) => {
  const pageSize = parseInt(req.query.pageSize) || 0;
  const pageNum = parseInt(req.query.pageNum) || 1;
  const skips = pageSize * (pageNum - 1);
  const filters = req.query.filter || {};

  Experience.find({ status: "published", ...filters })
    .sort({ updatedAt: -1 })
    .populate("author -_id -password -products -email -role")
    .skip(skips)
    .limit(pageSize)
    .exec(function (errors, publishedExperiences) {
      if (errors) {
        return res.status(422).send(errors);
      }

      Experience.countDocuments({ status: "published" }).then(count => {
        return res.json({
          experiences: publishedExperiences,
          count,
          pageCount: Math.ceil(count / pageSize)
        });
      });
    });
};

exports.getMediumExperiences = (req, res) => {
  request.get(MEDIUM_URL, (err, apiRes, body) => {
    if (!err && apiRes.statusCode === 200) {
      let i = body.indexOf("{");
      const data = body.substr(i);
      res.send(data);
    } else {
      res.sendStatus(500).json(err);
    }
  });
};

exports.getExperienceBySlug = (req, res) => {
  const slug = req.params.slug;

  Experience.findOne({ slug })
    .populate("author -_id -password -products -email -role")
    .exec(function (errors, foundExperience) {
      if (errors) {
        return res.status(422).send(errors);
      }

      return res.json(foundExperience);
    });
};

exports.getExperienceById = (req, res) => {
  const experienceId = req.params.id;

  Experience.findOne({ _id: experienceId })
    .populate("author -_id -password -products -email -role")
    .exec(function (errors, foundExperience) {
      if (errors) {
        return res.status(422).send(errors);
      }

      return res.json(foundExperience);
    });
  /* Experience.findById(experienceId, (errors, foundExperience) => {
    if (errors) {
      console.log(errors)
      return res.status(422).send(errors);
    }
    console.log(foundExperience)
    return res.json(foundExperience);
  }); */
};

exports.getUserExperiences = (req, res) => {
  const user = req.user;

  Experience.find({ author: user.id }, function (errors, userExperiences) {
    if (errors) {
      return res.status(422).send(errors);
    }

    return res.json(userExperiences);
  }).sort({ "createdAt": -1 });

};

exports.updateExperience = (req, res) => {
  const experienceId = req.params.id;
  const experienceData = req.body;

  Experience.findById(experienceId, function (errors, foundExperience) {
    if (errors) {
      return res.status(422).send(errors);
    }

    // if (experienceData.status && experienceData.status === 'published' && !foundExperience.slug) {
    if (experienceData.status && experienceData.status === "published") {
      foundExperience.slug = slugify(foundExperience.title, {
        replacement: "-", // replace spaces with replacement
        remove: null, // regex to remove characters
        lower: true // result in lower case
      });
    }

    foundExperience.set(experienceData);
    foundExperience.updatedAt = new Date();
    foundExperience.save(function (errors, foundExperience) {
      if (errors) {
        return res.status(422).send(errors);
      }

      return res.json(foundExperience);
    });
  });
};

exports.createExperience = (req, res) => {
  const lockId = req.query.lockId;

  if (!lock.isBusy(lockId)) {
    lock.acquire(
      lockId,
      function (done) {
        const experienceData = req.body;
        const experience = new Experience(experienceData);
        experience.author = req.user;

        experience.save((errors, createdExperience) => {
          setTimeout(() => done(), 5000);

          if (errors) {
            return res.status(422).send(errors);
          }

          return res.json(createdExperience);
        });
      },
      function (errors, ret) {
        errors && console.error(errors);
      }
    );
  } else {
    return res.status(422).send({ message: "Experience is getting saved!" });
  }
};

exports.deleteExperience = (req, res) => {
  const experienceId = req.params.id;

  Experience.deleteOne({ _id: experienceId }, function (errors) {
    if (errors) {
      return res.status(422).send(errors);
    }

    res.json({ status: "deleted" });
  });
};
