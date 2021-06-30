const mongoose = require('mongoose')
const featureModel = require('../model/feature')
const Requirement = featureModel.Requirement
const Feature = featureModel.Feature
const Scenario = featureModel.Scenario


const obj = {
    //feature related
    addFeature: addFeature,
    findFeatures: findFeatures,
    updateFeature: updateFeature,
    removeFeature: removeFeature,
    // scenario related
    addScenario: addScenario,
    updateScenario: updateScenario,
    removeScenario: removeScenario,
    // getScenariosByFeature: getScenariosByFeature
}

async function addFeature(data) {

    if(data.text == null || data.text == undefined) {

        throw 'add feature without title/text'
    }
    data.title = data.text
    delete data.text
    var feature =  new Feature(data)

    return  await feature.save()
}

async function findFeatures(rules) {

    // find feature which parent is null
    return await Requirement.find(rules).sort({ 'order': 'asc', 'id': 'asc' })
}

async function updateFeature(id, data) {

    feature = await Feature.findById(id)

    if(feature==null)
        throw 'not found'

    for(var attr in data) {

        feature[attr] = data[attr]
    }

    var saved = await feature.save()

    return saved.toJSON()
}

async function removeFeature(id) {
    // hidden feature and children scenario instead of delete

    feature = await Feature.findByIdAndUpdate(id, {'hidden': true})
    
    if(feature==null)
        throw 'not found'

    await Scenario.updateMany({ 'parent': id }, {'hidden': true})
    return feature.toJSON()
}

async function addScenario(data) {

    if(!data.text)
        throw 'add scenario without title/text'
    
    data.title = data.text
    delete data.text

    var doc = await new Scenario(data).save()

    return { id: doc.id, text: doc.title }
}


async function updateScenario(id, data) {

    scenario = await Scenario.findById(id)

    if(scenario==null)
        throw 'not found'

    for(var attr in data) {

        scenario[attr] = data[attr]
    }

    var saved = await scenario.save()

    return saved
}

async function removeScenario(id) {
    // hidden scenario instead of delete

    scenario = await Scenario.findByIdAndUpdate(id, { 'hidden': true})

    if(scenario == null)
        throw 'not found'

    return scenario.toJSON()
    
}


module.exports = obj