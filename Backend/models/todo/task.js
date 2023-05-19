const mongoose = require("mongoose");
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
const MissionSchema = new mongoose.Schema({
  text: {
    type: String,
    required:  [true, "Text to Task is required"],
    maxlength: [255, "Maximum length of text is 255 characters"],
    minlength: [3, "Minimum length of text is 0 characters"],
  },
  idU:{
    type: String,
    required: [true, "user id is required"],
  },
  status: {
    type: Boolean,
    default:false,
  },
  completedOn: {
    type: Date,
    default: null,
    index: true,
  },
  order: {
    type: Number,
    default: null,
  },
 },schemaOptions);

 
const TeskModel = new mongoose.model("Missions", MissionSchema);
module.exports = TeskModel;
