const mongoose = require("mongoose");
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
const subMissionSchema = new mongoose.Schema({
  text: {
    type: String,
    required:  [true, "Text to Task is required"],
    maxlength: [255, "Maximum length of text is 255 characters"],
    minlength: [2, "Minimum length of text is 2 characters"],
  },
  idMission:{
    type: String,
    required: [true, "mission id is required"],
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
 },schemaOptions);

 
const subTeskModel = new mongoose.model("sub_missions", subMissionSchema);
module.exports = subTeskModel;
