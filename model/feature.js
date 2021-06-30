const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 使用type进行区分
const options = {
  discriminatorKey: 'type',
  timestamps: true
};



// 质量属性
const QualityList = [
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

// 定义基础Schema
const baseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    parent: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "feature",
      default: null,
    },
    order: {
      type: Number,
      default: 0
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  options
);

// Basic Schhema做为需求Model
const Requirement = mongoose.model("requirement", baseSchema);

// 基于基础Schema创建Feature Schema
const Feature = Requirement.discriminator("feature", new Schema({}), options);

// 基于基础Schema创建Scenario Schema
const scenarioSchema = new Schema({
  quality: { type: String, trim: true, enum: QualityList },   // 多一个质量属性
});

const Scenario = Requirement.discriminator("scenario", scenarioSchema, options);

// 首次使用，创建一个默认特性节点
async function addDefaultFeature() {

  var defaultFeature = await Feature.findOne({title: ''})
  if(defaultFeature == null) {

      await new Feature({title: '/', content: '', parent: null}).save()
      await Feature.findOneAndUpdate({title:'/'}, {title: ''})
    }
}

addDefaultFeature()

// 导出
module.exports.Requirement = Requirement;
module.exports.Feature = Feature;
module.exports.Scenario = Scenario;
