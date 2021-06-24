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

    var  reqs =  await Requirement.find(rules).select(['id', 'title', '__t']).sort({ 'title': 'asc' })

    console.log(reqs)

    var ret = [ ]
    reqs.forEach(doc => {
        let data = { }
        data.id = doc.id
        data.text = doc.title
        if(doc.type == 'feature') {
            data.state = 'closed'
            data.attributes = { 'type': 'feature' }
            data.iconCls = 'tree-folder'
        } else {
            data.state = 'open'
            data.attributes = { 'type': 'scenario' }
            data.iconCls = 'tree-file'
        }
        
        ret.push(data)
    })

    return ret
}

async function updateFeature(id, data) {

    feature = await Feature.findById(id)

    if(feature==null)
        throw 'not found'

    for(var attr in data) {
        feature[attr] = data[attr]
    }

    await feature.save()

    return feature.toJSON()
}

async function removeFeature(id) {

    feature = await Feature.findByIdAndDelete(id)

    if(feature != null) {

        await Scenario.deleteMany({ 'parent': id })
        return feature.toJSON()

    } else {

        return {}
    }
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

    await scenario.save()

    return scenario.toJSON()
}

async function removeScenario(id) {

    scenario = await Scenario.findByIdAndDelete(id)

    if(scenario != null) {

        return scenario.toJSON()
    } else {

        return { }
    }
}


module.exports = obj