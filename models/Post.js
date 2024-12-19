const mongoosse = require("mongoose");
// to vaidate
const joi = require("joi");
// post schema
const PostSchema = new mongoosse.Schema(
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
    category: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    likes: [
      {
        type: mongoosse.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON :{virtuals:true},
    toObject:{virtuals:true}
  }
);
// populate Comment 
PostSchema.virtual("comments",{
  ref:"Comment",
  foreignField:"postId",
  localField:"_id"
})
const post = mongoosse.model('Post',PostSchema);
// validte
function vaidateCreatPost(obj) {
  const schema = joi.object({
    title: joi.string().trim().min(2).max(200).required(),
    description : joi.string().trim().min(10).required(),
    category : joi.string().trim().required(),
    })
  return schema.validate(obj);
}
function vaidateUpdatePost(obj){
  const schema = joi.object({
    title: joi.string().trim().min(2).max(200),
    description: joi.string().trim().min(10),
    category: joi.string().trim(),
  })
  return schema.validate(obj);
}
module.exports = {
  post,
  vaidateUpdatePost,
  vaidateCreatPost
}
