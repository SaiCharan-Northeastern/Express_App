const express = require('express');
const router = express.Router();
const User =  require('../controllers/userscontroller');
const Product = require('../controllers/ProductController');
const Image = require('../controllers/ImageController');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');
const uuid = require("uuid").v4;
require('dotenv').config();
const StatsD = require('node-statsd');
const logger = require('../logger.js');
const statsd = require('../controllers/index.js');
// const StatsD = require('node-statsd');
// const logger = require('../App.js');
// const statsd = require('../App.js');

// const BUCKET = "my-unique-bucket-62cb7f9a6334759e"

router.get('/', (req,res)=> {
    res.status(200).json({msg:'show all users'});
});

router.get('/healthz', (req,res)=> {

    try{
		statsd.increment('endpoint_all');
		statsd.increment('endpoint_healthz');
		logger.info('Healthz Received Healthz API call');
        return res.status(200).json({msg:'Heartbeat'});
		
    }
    catch(error){
		logger.warn("Healtz API Error Caught in healthz call"+error);
        return response.sendStatus(400);
    } 

    
});

router.route('/v1/user/:id').get(User.verify);

router.route('/v1/user').post(User.create);

router.route('/v1/user/:id').put(User.update);

router.route('/v1/product').post(Product.create);

router.route('/v1/product/:id').get(Product.get);

router.route('/v1/product/:id').put(Product.update);

router.route('/v1/product/:id').patch(Product.patch);

// router.route('/v1/product/:id').delete(Product.delete);


const s3 = new aws.S3 ({
    region: process.env.S3_REGION,
    secretAccessKey: process.env.secretAccessKey,
    accessKeyId: process.env.accessKeyId
    
})
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.bucketname,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${uuid()}${ext}`);
    }
  })
});


router.route('/v1/product/:id/image').post(upload.single("file"),Image.create);

router.route('/v1/product/:productid/image/:id').get(Image.getone);

router.route('/v1/product/:productid/image').get(Image.getAll);

router.route('/v1/product/:productid/image/:imageid').delete(Image.delete);

router.route("/v1/product/:productid").delete(Image.deleteAll);

router.route('/v1/user/:id').delete(
    (req,res)=>{
        res.status(501).json({msg:"not implemented"})
    }
);

router.route('/v1/user/:id').patch(
    (req,res)=>{
        res.status(501).json({msg:"not implemented"})
    }
);

// const upload = multer({
//     storage: multerS3({
//       s3: s3,
//       acl: "public-read",
//       bucket: BUCKET,
//       key: function (req, file, cb) {
//         console.log(file);
//         cb(null, Date.now().toString()+file.originalname)
//       }
//     })
//   });


//   //test
//   router.post('/upload', upload.single('file'), (req, res)=> {
//     console.log(req.file);
//     res.send("File Uploaded"+ req.file.location+ ' Location!');
//   });







module.exports = router;

