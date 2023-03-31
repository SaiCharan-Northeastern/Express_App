const {models : {Product}} =  require('../models');
const bcrypt = require("bcrypt");
const {models : {User}} =  require('../models');
const StatsD = require('node-statsd');
const logger = require('../logger.js');
const statsd = require('./index.js')



module.exports = {

    create: async(req,res) => {

        statsd.increment('endpoint_all');
        statsd.increment('endpoint_productCreate');
        if(req.headers.authorization === undefined){
            logger.info('no auth header for create product');
           return  res.sendStatus(401);
        }
    
           
            var encoded = req.headers.authorization.split(' ')[1];
            // decode it using base64
            var decoded = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
            var name = decoded.split(':')[0];
            var pass = decoded.split(':')[1];

        
        const list_1 = await User.findOne({ where: { username: name } });

        console.log("i came her into the sql loop");
        console.log(list_1);


        if (list_1 === null  || list_1 === undefined){
            logger.info("user not found");
            return res.status(401).json({ msg: " User Not Found" });
        }
        else{
       
        var  {username,password} =  list_1;

        const verified = bcrypt.compareSync(pass,password);
       const vUser = (username === name) ? true : false;
       
        if ( vUser && verified ){


            const {name,description,sku,manufacturer,quantity} = req.body;


            if(typeof req.body.id !== "undefined" || typeof req.body.date_added !== "undefined"|| typeof req.body.date_last_updated !== "undefined"){
                return res.sendStatus(400);
            }
            const owner_user_id = list_1.id;
              
                    if(typeof(req.body.quantity) !== "number") {
                        logger.info("quantity not a number");
                        return res.sendStatus(400);
                    }
                    if(req.body.quantity < 0 || req.body.quantity > 100 ){
                        logger.info("quantity out of bounds");
                        return res.sendStatus(400);
                    }

                    if(name === "null" || sku === "null" || description === "null" || manufacturer === "null" ){
                        logger.info("mandatory requirements not met");
                     return res.sendStatus(400);
                    }

                    if(name.trim() === ""|| sku.trim()=== ""|| description.trim() === ""|| manufacturer.trim() === ""){
                        logger.info("mandatory requirements not met");
                        return res.sendStatus(400);
                    }
                   
        
                try{
    
                await Product.create ({
                 
                       name,
                       description,
                       sku,
                       manufacturer,
                       quantity,
                       UserId: owner_user_id
                    });
                
               
                }
                catch(e){
                    logger.error("error creating prod");
                  return res.status(400).json({msg: "duplicate sku"});
                }
               

                const data = await Product.findOne({ where: { sku : sku } });
                logger.info("product created  -->");

                return res.status(201).json({"id": data.id , "name": data.name, "description": data.description, "sku": sku, "manufacturer": manufacturer,
            "quantity" : quantity, "date_added" : data.createdAt, "date_last_updated": data.updatedAt, "owner_user_id": data.UserId }) 
               
                }
            
            
            else {

                logger.info("not verified");
                return res.status(401).json({msg: "not valid"});
            }
        }
        
    
}, 


get: async (req,res)=>{


    statsd.increment('endpoint_all');
    statsd.increment('endpoint_getProd');
    const search_id = req.params.id;

    console.log(search_id);

    const list_fetched =  await Product.findOne({ where: { id: search_id } });

    if(list_fetched === null || typeof list_fetched === "undefined") {
        logger.info("product not found")
        return res.sendStatus(400);

    }
    else {

        logger.info("product found -->")
        return res.status(200).json({"id": list_fetched.id , "name": list_fetched.name, "description": list_fetched.description, "sku": list_fetched.sku, "manufacturer": list_fetched.manufacturer,
        "quantity" : list_fetched.quantity, "date_added" : list_fetched.createdAt, "date_last_updated": list_fetched.updatedAt, "owner_user_id": list_fetched.UserId })

       

        
    }

},


update: async (req,res)=>{

    statsd.increment('endpoint_all');
    statsd.increment('endpoint_putProd');

    if(req.headers.authorization === undefined){
        logger.info("product not found")
        return  res.sendStatus(401);
     }
 
        
         var encoded = req.headers.authorization.split(' ')[1];
         // decode it using base64
         var decoded = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
         var name = decoded.split(':')[0];
         var pass = decoded.split(':')[1];

         const search_code = req.params.id;

         const list_1 =  await Product.findOne({where: { id:search_code}});
        


     if (list_1 === null  || list_1 === undefined){
         return res.sendStatus(400);
     }
     else{

        const list_user = await User.findOne({where: {username: name}});

        if(list_user === null || list_user === undefined){
            return res.sendStatus(400);
        }
            var  {username,password} =  list_user;

     const verified = bcrypt.compareSync(pass,password);
    const vUser = (username === name) ? true : false;

    if (verified && vUser) {


        if (list_1.UserId === list_user.id){

        if(typeof(req.body.quantity) !== "number") {
            return res.sendStatus(400);
        }
        if(req.body.quantity < 0 ){
            return res.sendStatus(400);
        }

        const{name,description,sku,manufacturer,quantity} = req.body

        if( typeof name === "undefined" || typeof sku === "undefined" || typeof description === "undefined" || typeof manufacturer === "undefined" ){
         return res.sendStatus(400);
        }

        
        if(typeof req.body.date_added !== "undefined" || typeof req.body.date_last_updated !== "undefined" || typeof req.body.id !== "undefined" ){
            return res.sendStatus(400);
        }
        
        const search_sku = req.body.sku;

        const list_sku = await Product.findOne({where: {sku:search_sku}});
        if(list_sku === undefined || list_sku === null){

        try{
            await Product.update(
                {
                    name: req.body.name,
                    description: req.body.description,
                    sku: req.body.sku,
                    quantity: req.body.quantity,
                    manufacturer: req.body.manufacturer

                },
                {
                  where: { id: search_code },
                }
              );
           logger.info("product updated -->");
            res.sendStatus(204);
        }
        catch(e){
            logger.error("product auth failed")
            res.sendStatus(400);
        }

        }
        else {
            console.log(req.params.id,list_sku.id);
            if(req.params.id == list_sku.id){
            try{
                await Product.update(
                    {
                        name: req.body.name,
                        description: req.body.description,
                        sku: req.body.sku,
                        quantity: req.body.quantity,
                        manufacturer: req.body.manufacturer
    
                    },
                    {
                      where: { id: search_code },
                    }
                  );
                logger.info("product updated -->");
                return res.sendStatus(204);
            }
            catch(e){
                logger.error("product auth with id failed-->");
                res.sendStatus(400);
            }

        }
    
    else{
        logger.warn("prod nor found");
        res.sendStatus(400);
    }
        }

    }

            else{
                logger.error("forbidden based on id")
                res.sendStatus(403);
            }

    }
    else{
        logger.error("auth failed user details");
        res.sendStatus(401);
    }





}
},

patch : async (req,res) =>{

    statsd.increment('endpoint_all');
    statsd.increment('endpoint_patchProd');



    if(req.headers.authorization === undefined){
        logger.info("basic auth required");
        return  res.sendStatus(401);
     }
 
        
         var encoded = req.headers.authorization.split(' ')[1];
         // decode it using base64
         var decoded = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
         var name = decoded.split(':')[0];
         var pass = decoded.split(':')[1];

         const search_code = req.params.id;

         const list_1 =  await Product.findOne({where: { id:search_code}});
        


     if (list_1 === null  || list_1 === undefined){
        logger.warn("no product found");
         return res.sendStatus(400);
     }
     else{

        const list_user = await User.findOne({where: {username: name}});

        if(list_user === null || list_user === undefined){
            logger.warn("no user found");
            return res.sendStatus(400);
        }
            var  {username,password} =  list_user;

     const verified = bcrypt.compareSync(pass,password);
    const vUser = (username === name) ? true : false;

    if (verified && vUser) {


        if (list_1.UserId === list_user.id){

        if(typeof req.body.quantity !== "undefined" && typeof(req.body.quantity) !== "number") {
            logger.warn("quantity type not number");
            return res.sendStatus(400);
        }
        if(req.body.quantity < 0 && req.body.quantity > 100 ){
            logger.warn("quantity out of bound");
            return res.sendStatus(400);
        }

        let {name,description,sku,manufacturer,quantity} = req.body

        if( typeof name === "undefined" && typeof sku === "undefined" && typeof description === "undefined" && typeof manufacturer === "undefined" && typeof quantity === "undefined"){
            logger.warn("mandatory items not found");
            return res.sendStatus(400);
        }

        if(typeof req.body.date_added !== "undefined" || typeof req.body.date_last_updated !== "undefined" || typeof req.body.id !== "undefined" ){
            return res.sendStatus(400);
        }
        if(typeof req.body.name === "undefined"){
            name = list_1.name;
        }
        if(typeof req.body.description === "undefined"){
            description = list_1.description;
        }
        if(typeof req.body.quantity === "undefined"){
            quantity = list_1.quantity;
        }
        if(typeof req.body.manufacturer === "undefined"){
            manufacturer = list_1.manufacturer;
        }
        
        if(typeof req.body.sku !== "undefined"){
            sku = req.body.sku;
            const search_sku = req.body.sku;
            const list_dups = await Product.findOne({where: {sku:search_sku}});

            if(list_dups === null) {
                sku = search_sku;
                try{
                    await Product.update(
                        {
                            name: req.body.name,
                            description: req.body.description,
                            sku: req.body.sku,
                            quantity: req.body.quantity,
                            manufacturer: req.body.manufacturer
        
                        },
                        {
                          where: { id: search_code },
                        }
                      );
                    logger.info("product updated");
                    res.sendStatus(204);
                }
                catch(e){
                    logger.error("error while updating");
                    res.sendStatus(400);
                }
            }
            else {

               if(req.params.id == list_dups.id){
                try{
                    await Product.update(
                        {
                            name: req.body.name,
                            description: req.body.description,
                            quantity: req.body.quantity,
                            manufacturer: req.body.manufacturer
        
                        },
                        {
                          where: { id: search_code },
                        }
                      );
                      logger.info("Product updated");
                    res.sendStatus(204);
                }
                catch(e){
                    logger.warn("no product found");
                    res.sendStatus(400);
                }
            }
            else{
                logger.warn("no product found");
                return res.sendStatus(400);
            }
            }
        }
        else{
            try{
                await Product.update(
                    {
                        name: name,
                        description: description,
                        quantity: quantity,
                        manufacturer: manufacturer
    
                    },
                    {
                      where: { id: search_code },
                    }
                  );
                res.sendStatus(204);
            }
            catch(e){
                logger.error("error updating");
                res.sendStatus(400);
            }
    

        }

    }

            else{
                logger.error("Access error");
                res.sendStatus(403);
            }

    }
    else{
        logger.error("Auth failed");
        res.sendStatus(401);
    }

     }


},



delete: async (req,res)=>{

    statsd.increment('endpoint_all');
    statsd.increment('endpoint_deleteProd');


    if(req.headers.authorization === undefined){
        logger.warn("no auth");
        return  res.sendStatus(401);
     }
 
        
         var encoded = req.headers.authorization.split(' ')[1];
         // decode it using base64
         var decoded = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
         var name = decoded.split(':')[0];
         var pass = decoded.split(':')[1];

     
     const list_1 = await User.findOne({ where: { username: name } });


   
     if(list_1 === null || list_1 === undefined){
        logger.error("product not found");
        return res.sendStatus(400);
    }
        var  {username,password} =  list_1;

 const verified = bcrypt.compareSync(pass,password);
 const vUser = (username === name) ? true : false;
const list_prod = await Product.findOne({ where: { id: req.params.id } });
if(list_prod === null || list_prod === undefined){
    logger.error("product not found")
    return res.sendStatus(404);
}
        if(verified && vUser){
            
            if (list_prod.UserId === list_1.id){
                try{await list_prod.destroy();
                    logger.info("product deleted --->")
                    res.sendStatus(204);
                }catch(e){
                    logger.error("product deletion error")
                    res.sendStatus(400);
                }

                
            }
            else{
                logger.error("access error")
                return res.sendStatus(403);
            }


        }
        else{
            logger.error("username and password mismatch found")
            return res.sendStatus(401);
        }






}

};