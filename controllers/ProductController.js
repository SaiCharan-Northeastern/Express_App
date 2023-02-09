const {models : {Product}} =  require('../models');
const bcrypt = require("bcrypt");
const {models : {User}} =  require('../models');




module.exports = {

    create: async(req,res) => {


        if(req.headers.authorization === undefined){
           return  res.sendStatus(400);
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
            return res.status(400).json({ msg: " User Not Found" });
        }
        else{
       
        var  {username,password} =  list_1;

        const verified = bcrypt.compareSync(pass,password);
       const vUser = (username === name) ? true : false;
       
        if ( vUser && verified ){


            const{name,description,sku,manufacturer,quantity} = req.body;
            if(typeof req.body.id !== "undefined" || typeof req.body.date_added !== "undefined"|| typeof req.body.date_last_updated !== "undefined"){
                return res.sendStatus(400);
            }
            const owner_user_id = list_1.id;
              
                    if(typeof(req.body.quantity) !== "number") {
                        return res.sendStatus(400);
                    }
                    if(req.body.quantity < 0 ){
                        return res.sendStatus(400);
                    }


                    if(name === "null" || sku === "null" || description === "null" || manufacturer === "null" ){
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
                  return res.status(400).json({msg: "duplicate sku"});
                }
               

                const data = await Product.findOne({ where: { sku : sku } });

                return res.status(201).json({"id": data.id , "name": data.name, "description": data.description, "sku": sku, "manufacturer": manufacturer,
            "quantity" : quantity, "date_added" : data.createdAt, "date_last_updated": data.updatedAt, "owner_user_id": data.UserId }) 
               
                }
            
            
            else {
                
                return res.status(401).json({msg: "not valid"});
            }
        }
        
    
}, 


get: async (req,res)=>{



    const search_id = req.params.id;

    console.log(search_id);

    const list_fetched =  await Product.findOne({ where: { id: search_id } });

    if(list_fetched === null || typeof list_fetched === "undefined") {
        return res.sendStatus(400);

    }
    else {
       
        return res.status(200).json({"id": list_fetched.id , "name": list_fetched.name, "description": list_fetched.description, "sku": list_fetched.sku, "manufacturer": list_fetched.manufacturer,
        "quantity" : list_fetched.quantity, "date_added" : list_fetched.createdAt, "date_last_updated": list_fetched.updatedAt, "owner_user_id": list_fetched.UserId })

       

        
    }

},


update: async (req,res)=>{


    if(req.headers.authorization === undefined){
        return  res.sendStatus(400);
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

        console.log(typeof req.body.date_added); 
        if(typeof req.body.date_added !== "undefined" || typeof req.body.date_last_updated !== "undefined" || typeof req.body.id !== "undefined" ){
            return res.sendStatus(400);
        }
        
        const search_sku = req.body.sku;

        const list_sku = await Product.findOne({where: {sku:search_sku}});
        if(list_sku === null){

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
            res.sendStatus(204);
        }
        catch(e){
            res.sendStatus(400);
        }

        }
        else {
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
                res.sendStatus(204);
            }
            catch(e){
                res.sendStatus(400);
            }
        }

    }

            else{
                res.sendStatus(403);
            }

    }
    else{
        res.sendStatus(401);
    }





}
},

patch : async (req,res) =>{

    if(req.headers.authorization === undefined){
        return  res.sendStatus(400);
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

        if(typeof req.body.quantity !== "undefined" && typeof(req.body.quantity) !== "number") {
            return res.sendStatus(400);
        }
        if(req.body.quantity < 0 ){
            return res.sendStatus(400);
        }

        let {name,description,sku,manufacturer,quantity} = req.body

        if( typeof name === "undefined" && typeof sku === "undefined" && typeof description === "undefined" && typeof manufacturer === "undefined" && typeof quantity === "undefined"){
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
                    res.sendStatus(204);
                }
                catch(e){
                    res.sendStatus(400);
                }
            }
            else {
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
                    res.sendStatus(204);
                }
                catch(e){
                    res.sendStatus(400);
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
                res.sendStatus(400);
            }
    

        }

    }

            else{
                res.sendStatus(403);
            }

    }
    else{
        res.sendStatus(401);
    }

     }


},



delete: async (req,res)=>{


    if(req.headers.authorization === undefined){
        return  res.sendStatus(400);
     }
 
        
         var encoded = req.headers.authorization.split(' ')[1];
         // decode it using base64
         var decoded = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
         var name = decoded.split(':')[0];
         var pass = decoded.split(':')[1];

     
     const list_1 = await User.findOne({ where: { username: name } });


   
     if(list_1 === null || list_1 === undefined){
        return res.sendStatus(400);
    }
        var  {username,password} =  list_1;

 const verified = bcrypt.compareSync(pass,password);
 const vUser = (username === name) ? true : false;
const list_prod = await Product.findOne({ where: { id: req.params.id } });
if(list_prod === null || list_prod === undefined){
    return res.sendStatus(404);
}
        if(verified && vUser){
            
            if (list_prod.UserId === list_1.id){
                try{await list_prod.destroy();
                    res.sendStatus(204);
                }catch(e){
                    res.sendStatus(400);
                }

                
            }
            else{
                return res.sendStatus(403);
            }


        }
        else{
            return res.sendStatus(401);
        }






}

};