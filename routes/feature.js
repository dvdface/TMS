const express = require("express");
const router = express.Router();
const feature = require("../controller/feature");

router.get("/", (req, res) => {
  res.render("feature/feature");
});

router.post("/add_scenario", (req, res) => {
  feature.addScenario(req.body).then((data) => {
    res.status(200).json(data);
  });
});

router.post("/add_feature", (req, res) => {
  feature.addFeature(req.body).then((data) => {
    res.status(200).json(data);
  });
});

router.get("/get_features", (req, res) => {
  if (req.query.id == undefined) rules = { parent: null };
  else if (req.query.id == "") res.status(200).json({});
  else rules = { parent: req.query.id };

  feature.findFeatures(rules).then((data) => {
    res.status(200).json(data);
  });
});

router.post("/get_features", (req, res) => {
  if (req.body.id == undefined) rules = { parent: null };   // 如果是根节点
  else if (req.body.id == "") res.status(200).json({});     // 如果是原始的空节点
  else rules = { parent: req.body.id };

  feature.findFeatures(rules).then((data) => {
    res.status(200).json(data);
  });
});

module.exports = router;
