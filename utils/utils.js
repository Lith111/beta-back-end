const cloudinary = require('cloudinary');
cloudinary.v2.config({
    cloud_name: process.env. CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});
// cloudinary upload Image
const clouldinaryUploadImage = async(fileUpload)=>{
    try{
      const resault = await cloudinary.v2.uploader.upload(fileUpload,{
        resource_type : 'auto',
      }) 
      return resault;
    }catch(error){
      console.log(error);
      throw new Error("internal Server Error (cloudnary)")
    }
}

const clouldinaryRemoveImage = async(imageId)=>{
    try{
      const resault = await cloudinary.v2.uploader.destroy(imageId)
      return resault;
    }catch(error){
      console.log(error);
      throw new Error("internal Server Error (cloudnary)");
    }
}
const clouldinaryRemoveAllImage = async(PublicIds)=>{
  try{
    const resault = await cloudinary.v2.api.delete_resources(PublicIds);
    return resault;
  }catch(error){
    console.log(error);
    throw new Error("internal Server Error (cloudnary)")

}}
module.exports ={
    clouldinaryUploadImage,
    clouldinaryRemoveImage,
    clouldinaryRemoveAllImage,
}