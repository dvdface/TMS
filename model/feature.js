const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = {
  discriminatorKey: 'type',
  timestamps: true
};

function customValidator(re, value) {
  let ret = true;
  value.split("\n").forEach((item) => {
    ret = ret && re.test(item);
  });

  return ret;
}

// use to validate Gherkin format
function gherkinValidator(value) {
  if (value == null) return true;

  if (value == "") return true;

  const re = /^\s*(given|when|then|and|as\s*a|i\s*want\s*to|so\s*that)/i;

  return customValidator(re, value);
}

// used to validate Ghkerin parameters format
function parameterValidator(value) {
  if (value == null) return true;

  if (value == "") return true;

  const re = /^\s*\|(.*\|\s*)*$/;

  return customValidator(re, value);
}

const TypeList = [
  "Functionality",
  "Functionality-Suitability",
  "Functionality-Accuracy",
  "Functionality-Interoperability",
  "Functionality-Compliance",
  "Functionality-Security",
  "Reliability",
  "Reliability-Maturity",
  "Reliability-Fault Tolerance",
  "Reliability-Recoverability",
  "Usability",
  "Usability-Understandability",
  "Usability-Learnability",
  "Usability-Operability",
  "Efficiency",
  "Efficiency-Time Behaviour",
  "Efficiency-Resource Behaviour",
  "Maintainability",
  "Maintainability-Analysability",
  "Maintainability-Changeability",
  "Maintainability-Stability",
  "Maintainability-Testability",
  "Portability",
  "Portability-Adaptability",
  "Portability-Installability",
  "Portability-Conformance",
  "Portability-Replaceability",
];

const baseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: {
      type: String,
      trim: true,
      validate: gherkinValidator,
      default: "",
    },
    parent: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "feature",
      default: null,
    },
  },
  options
);

const Requirement = mongoose.model("requirement", baseSchema);

const scenarioSchema = new Schema({
  paramter: {
    type: String,
    trim: true,
    validate: parameterValidator,
    default: "",
  },
  priority: {
    type: String,
    trim: true,
    match: /^\s*P\d+\s*$/,
    default: "P0",
  },
  testtype: { type: String, trim: true, enum: TypeList },
});

const Feature = Requirement.discriminator("feature", new Schema({}), options);

// insert a default feature named '/'
async function addDefaultFeature() {

    var defaultFeature = await Feature.findOne({title: ''})
    if(defaultFeature == null) {

        await new Feature({title: '/', content: '', parent: null}).save()
        await Feature.findOneAndUpdate({title:'/'}, {title: ''})
      }
}

addDefaultFeature()

const Scenario = Requirement.discriminator("scenario", scenarioSchema, options);

module.exports.Requirement = Requirement;
module.exports.Feature = Feature;
module.exports.Scenario = Scenario;
