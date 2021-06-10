
const scenarioSchema = new Schema(
    {
        paramters: { type: String, required: false, trim: true, validate: parametersValidator},
        priority: { type: String, required: true, trim: true, uppercase: true, match: /^\s*P\d+\s*$/i},
        type: { type:String, required: true, trim: true, uppercase: true, enum: TypeList},
    }
);

const Scenario = Feature.discriminator("scenario", scenarioSchema, options);