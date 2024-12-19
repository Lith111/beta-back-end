const mongoosse = require("mongoose");
// to vaidate
const joi = require("joi");
// post schema
const midcalSchema = new mongoosse.Schema(
  {
    title: {
      type: String,
      required: true,
      minlenght: 2,
      trim: true,
      Maxlenght: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlenght: 10,
    },
    user: {
      type: mongoosse.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userFuture : {
      type: String,
      required: true,
      minlenght: 2,
      trim: true,
      Maxlenght: 200,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
  },
  {
    timestamps: true,
  }
);
const midcal = mongoosse.model('Midcal',midcalSchema);
// validte
function vaidateCreatMidcal(obj) {
  const schema = joi.object({
    title: joi.string().trim().min(2).max(200).required(),
    description : joi.string().trim().min(10).required(),
    userFuture: joi.string().trim().min(2).max(200).required(),

    })
  return schema.validate(obj);
}

module.exports = {
  midcal,
  vaidateCreatMidcal,
}
