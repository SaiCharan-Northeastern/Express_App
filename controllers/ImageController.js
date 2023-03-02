const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
let mysql = require('mysql2');
require('dotenv').config();

const bcrypt = require('bcrypt');
// const upload = multer({ dest: 'uploads/'});
// const {uploadFile, getFileStream} = require('../s3');

const {models : {Product}} =  require('../models');
const {models : {User}} =  require('../models');
const {models : {Image}} =  require('../models');



User.sequelize.sync();
Image.sequelize.sync();


// aws.config.update({
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     region: process.env.region,
//   });
  

  
module.exports = {

  create: ( async(req,res) => {


    if(req.headers.authorization === undefined){
       return  res.sendStatus(401);
    }

       
        var encoded = req.headers.authorization.split(' ')[1];
        // decode it using base64
        var decoded = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
        var name = decoded.split(':')[0];
        var pass = decoded.split(':')[1];

    
    const list_1 = await User.findOne({ where: { username: name } });

    console.log("i came here into the sql loop");

    if (list_1 === null  || list_1 === undefined){
        return res.status(400).json({ msg: " User Not Found" });
    }
    else{
   
    var  {username,password} =  list_1;

const verified = bcrypt.compareSync(pass,password);
const vUser = (username === name) ? true : false;
   
    if ( vUser && verified ){


      const file = req.file;
      const datatypes = ['image/jpeg','image/png','image/jpg'];
      var b = false;

      // if (! req.file.mimetype in datatypes){
      //   return res.sendStatus(409);
      // }
      datatypes.forEach((data_one)=>{
        console.log("i came into for")
        if (data_one === req.file.mimetype){
          console.log("i came into foreach")
          b = true;
        }
      });
      if(!b){
        return res.sendStatus(400);
      }
      console.log(req.file.mimetype);
      console.log(req.params.id);

        const owner_user_id = list_1.id;
        const list_products = await Product.findOne({ where: { id: req.params.id } });

       
        if(list_products === null  || list_products === undefined){
            res.sendStatus(400);
        } 
        if(owner_user_id != list_products.UserId){

          return res.sendStatus(403);

        }

        if( req.file === "null"|| req.file === "undefined"){
        res.sendStatus(400);}

        const productId = req.params.id;
        const s3ObjectLocation = req.file.location;
        console.log(`productId : ${productId}`);
        console.log(`original filename : ${req.file.originalname}`);
        console.log(`file location : ${s3ObjectLocation}`);

    try{
          await Image.create({
          ProductId: productId,
          name: req.file.originalname,
          s3_bucket_path: s3ObjectLocation,
        });
      }
      catch(e){
        return res.sendStatus(400);
      }

      return res.sendStatus(201);
    }
  
        else {
            
            return res.status(401).json({msg: "not valid"});
        }
    }
    

}),


getone: ( async(req,res) => {


  if(req.headers.authorization === undefined){
     return  res.sendStatus(401);
  }

     
      var encoded = req.headers.authorization.split(' ')[1];
      var decoded = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
      var name = decoded.split(':')[0];
      var pass = decoded.split(':')[1];
  const list_1 = await User.findOne({ where: { username: name } });
  if (list_1 === null  || list_1 === undefined){
      return res.status(401).json({ msg: " User Not Found" });
  }
  else{
  var  {username,password} =  list_1;

const verified = bcrypt.compareSync(pass,password);
const vUser = (username === name) ? true : false;
 
  if ( vUser && verified ){

    console.log(req.params);

      const owner_user_id = list_1.id;
      const list_products = await Product.findOne({ where: { id: req.params.productid } });

     
      if(list_products === null  || list_products === undefined){
          return res.sendStatus(400);
      }
      if(owner_user_id != list_products.UserId){
       return res.sendStatus(403);
      }
      const image_data =  await Image.findOne({where: {id:req.params.id}});
      console.log(image_data);
      if(image_data === "null"|| image_data == "undefined" ){
        return res.sendStatus(400);
      }
      if(image_data.ProductId != req.params.productid){
       return  res.sendStatus(403);
      }
     return  res.status(200).json({image_data});


      // const productId = req.params.id;
      // const s3ObjectLocation = req.file.location;
      // console.log(`productId : ${productId}`);
      // console.log(`original filename : ${req.file.originalname}`);
      // console.log(`file location : ${s3ObjectLocation}`);
    
  }

      else {
          
          return res.status(401).json({msg: "not valid"});
      }
  }
  

}),

getAll:  ( async(req,res) => {


  if(req.headers.authorization === undefined){
     return  res.sendStatus(401);
  }

     
      var encoded = req.headers.authorization.split(' ')[1];
      var decoded = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
      var name = decoded.split(':')[0];
      var pass = decoded.split(':')[1];
  const list_1 = await User.findOne({ where: { username: name } });
  if (list_1 === null  || list_1 === undefined){
      return res.status(401).json({ msg: " User Not Found" });
  }
  else{
  var  {username,password} =  list_1;

const verified = bcrypt.compareSync(pass,password);
const vUser = (username === name) ? true : false;
 
  if ( vUser && verified ){

    console.log(req.params);

      const owner_user_id = list_1.id;
      const list_products = await Product.findOne({ where: { id: req.params.productid } });

     
      if(list_products === null  || list_products === undefined){
          return res.sendStatus(400);
      }
      if(owner_user_id != list_products.UserId){
       return res.sendStatus(403);
      }
      const image_data =  await Image.findAll({where: {ProductId:req.params.productid}});
      console.log(image_data);
      if(image_data === "null"|| image_data == "undefined" ){
        return res.sendStatus(400);
      }
     return  res.status(200).json({image_data});


      // const productId = req.params.id;
      // const s3ObjectLocation = req.file.location;
      // console.log(`productId : ${productId}`);
      // console.log(`original filename : ${req.file.originalname}`);
      // console.log(`file location : ${s3ObjectLocation}`);
    
  }

      else {
          
          return res.status(401).json({msg: "not valid"});
      }
  }
  

}),
delete: ( async(req,res) => {


  if(req.headers.authorization === undefined){
     return  res.sendStatus(401);
  }

      var encoded = req.headers.authorization.split(' ')[1];
      var decoded = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
      var name = decoded.split(':')[0];
      var pass = decoded.split(':')[1];
  const list_1 = await User.findOne({ where: { username: name } });
  if (list_1 === null  || list_1 === undefined){
      return res.status(401).json({ msg: " User Not Found" });
  }
  else{
  var  {username,password} =  list_1;

const verified = bcrypt.compareSync(pass,password);
const vUser = (username === name) ? true : false;
 
  if ( vUser && verified ){

    console.log(req.params);

      const owner_user_id = list_1.id;
      const list_products = await Product.findOne({ where: { id: req.params.productid } });

     
      if(list_products === null  || list_products === undefined){
          return res.sendStatus(400);
      }
      if(owner_user_id != list_products.UserId){
       return res.sendStatus(403);
      }
      const image_data =  await Image.findOne({where: {id:req.params.imageid}});
      console.log(image_data);

      if(image_data === "null"|| image_data == "undefined" ){
        return res.sendStatus(400);
      }
      const s3Location = image_data.s3_bucket_path.split("/").pop();

      const s3 = new aws.S3 ({
        region: process.env.region,
        secretAccessKey: process.env.secretAccessKey,
        accessKeyId: process.env.accessKeyId
        
    })
      var params = { Bucket: process.env.bucketname, Key: s3Location };
      s3.deleteObject(params, async (error, data) => {
        if (error) {
          
          return res.sendStatus(400);
        } else {
          console.log(`message in successful deletion` + data);
          const d_image = await Image.destroy({where: {id:req.params.imageid}});
          console.log(`deleted image --- ${d_image}`);
          if (!d_image) {
            return res.sendStatus(400);
          } 
            return res.sendStatus(200);
          
        }
      });

    
  }

      else {
          
          return res.status(401).json({msg: "not valid"});
      }
  }
  

}),
deleteAll : ( async(req,res) => {


  if(req.headers.authorization === undefined){
     return  res.sendStatus(401);
  }

      var encoded = req.headers.authorization.split(' ')[1];
      var decoded = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
      var name = decoded.split(':')[0];
      var pass = decoded.split(':')[1];
  const list_1 = await User.findOne({ where: { username: name } });
  if (list_1 === null  || list_1 === undefined){
      return res.status(401).json({ msg: " User Not Found" });
  }
  else{
  var  {username,password} =  list_1;

const verified = bcrypt.compareSync(pass,password);
const vUser = (username === name) ? true : false;
 
  if ( vUser && verified ){

    console.log(req.params);

      const owner_user_id = list_1.id;
      const list_products = await Product.findOne({ where: { id: req.params.productid } });

     
      if(list_products === null  || list_products === undefined){
          return res.sendStatus(400);
      }
      if(owner_user_id != list_products.UserId){
       return res.sendStatus(403);
      }
      
      const image_data = await Image.findAll({ where: { ProductId: req.params.productid } });

      console.log(typeof image_data);

      if(image_data.length == 0||image_data == "null"|| image_data == "undefined"|| typeof image_data === "null" || typeof image_data === "undefined" ){
        return res.sendStatus(400);
      }
    let imgIds = [];
		let s3Locations = [];

    // for(i in image_data){
    //   console.log("I am here in the image data");
    //   console.log(i);
    //   imgIds.push(i.id);
    //   s3Locations.push((i.s3_bucket_path).split("/").pop());
    // }

    image_data.forEach((image)=> {
      s3Locations.push(image.s3_bucket_path.split("/").pop());
      imgIds.push(image.id)
    });
    const s3 = new aws.S3 ({
      region: process.env.region,
      secretAccessKey: process.env.secretAccessKey,
      accessKeyId: process.env.accessKeyId
      
  })

    const objects = s3Locations.map((key)=> ({Key : key}));
    var params = { Bucket: process.env.bucketname, Delete : { Objects : objects} };
    s3.deleteObjects(params, async (error, data) => {
        if (error) {
          return res.sendStatus(400);
        } else {
          console.log(`message in successful deletion` + data);
        imgIds.forEach(async(idimg)=>{
         try{await Image.destroy({where: {id:idimg}});}
         catch(e){return res.sendStatus(400);}
          }
        );
          // console.log(`deleted image --- ${d_image}`);
          // if (!d_image) {
          //   return res.sendStatus(400);
          // } 
          //   return res.sendStatus(200);
          
        }

      });

      return res.sendStatus(200);

  }

      else {
          
          return res.status(401).json({msg: "not valid"});
      }
  }
  

})
};


