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
  }).catch((err) => {
    
    res.status(500).send(err)
  });
});

router.post("/add_feature", (req, res) => {

  feature.addFeature(req.body).then((data) => {

    res.status(200).json({ id: data.id, text: data.title });

  }).catch((err) => {res.status(500).send(err)});
});

router.get("/get_features", (req, res) => {

  if (req.query.id == undefined) {
    // get Root

    rules = { parent: null };

  } else {
  
    rules = { parent: req.query.id };
  }

  // 如果有hidden参数，就更加hidden参数查询
  if (req.query.hidden != undefined) {

    rules['hidden'] = req.query.hidden == 'true'? true : false
  
  } else {

    // 没有hidden参数，就不查hidden的数据
    rules['hidden'] = false
  }

  // find self; then its children
  feature.findFeatures(rules).then((data) => {

    var retData = data.map(doc => {
        let ret = { }
        ret.id = doc.id
        ret.text = doc.title
        if(doc.type == 'feature') {
            ret.state = 'closed'
            ret.attributes = { 'type': 'feature' }
            ret.iconCls = 'tree-folder'
        } else {
            ret.state = 'open'
            ret.attributes = { 'type': 'scenario' }
            ret.iconCls = 'tree-file'
        }
        return ret
    })

    res.status(200).json(retData)

  }).catch((err) => {res.status(500).send(err)});
});


router.post("/update_feature", (req, res) => {

  if (req.body.id == undefined){

    res.status(500).send('id can\'t be null');

  } else {
    
    // find doc accroding to id
    feature.updateFeature(req.body.id, req.body).then((data) => {

      res.status(200).json(data);
    }).catch((err) => {res.status(500).send(err)});
  }
})

router.post("/update_scenario", (req, res) => {

  if (req.body.id == undefined) {

    res.status(500).send('id can\'t be null');

  } else {
    
    // find doc accroding to id
    feature.updateScenario(req.body.id, req.body).then((data) => {

      res.status(200).json(data);

    }).catch((err) => {res.status(500).send(err)});;
  }
});


router.post("/remove_feature", (req, res) => {

  if (req.body.id == undefined) {

    res.status(500).send('id can\'t be null');

  } else {

    feature.removeFeature(req.body.id).then((data) => {

      res.status(200).json(data);
    }).catch((err) => {res.status(500).send(err)});
  }
});

router.post("/remove_scenario", (req, res) => {

  if (req.body.id == undefined) {

    res.status(500).send('id can\'t be null');

  } else {

    feature.removeScenario(req.body.id).then((data) => {

      res.status(200).json(data);
    }).catch((err) => {res.status(500).send(err)});
  }
});

router.get("/view_feature", (req, res) => {

  if(req.query.id == undefined) {

    res.status(500).send('id can\'t be null');

  } else {

    feature.findFeatures({ _id : req.query.id }).then((data) => {

      res.status(200).render("feature/edit", data[0].toJSON())

    }).catch((err) => {
      
      res.status(500).send(err);
    })
  }
});

module.exports = router;
