const express = require("express");
const router = express.Router();
const feature = require("../controller/feature");
const { Scenario } = require("../model/feature");

router.get("/", (req, res) => {
  res.render("feature/index");
});

router.get("/nav", (req, res) => {
  res.render("feature/nav");
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

router.post("/update_feature", (req, res) => {
  if (req.body.id == undefined){

    res.status(500).send('id can\'t be null');

  } else {
    
    // find doc accroding to id
    feature.updateFeature(req.body.id, req.body).then((data) => {

      res.status(200).json(data);
    })
  }
})

router.post("/update_scenario", (req, res) => {
  if (req.body.id == undefined) {

    res.status(500).send('id can\'t be null');

  } else {
    
    // find doc accroding to id
    feature.updateScenario(req.body.id, req.body).then((data) => {

      res.status(200).json(data);
    });
  }
});


router.post("/remove_feature", (req, res) => {
  if (req.body.id == undefined) {

    res.status(500).send('id can\'t be null');
  } else {

    feature.removeFeature(req.body.id).then((data) => {
      res.status(200).json(data);
    })
  }
});

router.post("/remove_scenario", (req, res) => {
  if (req.body.id == undefined) {

    res.status(500).send('id can\'t be null');
  } else {

    feature.removeScenario(req.body.id).then((data) => {
      res.status(200).json(data);
    })
  }
});

module.exports = router;
