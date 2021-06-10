const mongoose = require('mongoose')
const featureModel = require('../model/feature')
const Requirement = featureModel.Requirement
const Feature = featureModel.Feature
const Scenario = featureModel.Scenario


const obj = {
    //feature related
    addFeature: addFeature,
    findFeatures: findFeatures,
    // updateFeature: updateFeature,
    // deleteFeature: deleteFeature,
    // scenario related
    addScenario: addScenario,
    // updateScenario: updateScenario,
    // deleteScenario: deleteScenario,
    // getScenariosByFeature: getScenariosByFeature
}

async function addFeature(data) {

    if(!data.text)
        throw 'add feature without title/text'

    data.title = data.text
    delete data.text
    var feature =  new Feature(data)

    var doc =  await feature.save()

    return { id: doc.id, text: doc.title }
}

async function findFeatures(rules) {
    // find feature which parent is null

    var  reqs =  await Requirement.find(rules).select(['id', 'title', '__t'])

    console.log(reqs)

    var ret = [ ]
    reqs.forEach(doc => {
        let data = { }
        data.id = doc.id
        data.text = doc.title
        if(doc.type == 'feature')
            data.state = 'closed'
        else
            data.state = 'open'
        
        data.attributes = { 'type': 'feature' }
        
        ret.push(data)
    })

    return ret
}

async function addScenario(data) {

    if(!data.text)
        throw 'add scenario without title/text'
    
    data.title = data.text
    delete data.text

    var doc = await new Scenario(data).save()

    return { id: doc.id, text: doc.title }
}


module.exports = obj