

const {models : {User}} =  require('../models');
const bcrypt = require("bcrypt");
const users = require('../models/users');
const logger = require('../logger.js');
const statsd = require('./index.js')
// const StatsD = require('node-statsd');



module.exports = {

create: async(req,res) => {

    statsd.increment('endpoint_all');
	statsd.increment('endpoint_userCreate');

if (req.body.password && req.body.username && req.body.first_name && req.body.last_name) {
    

    if (req.body.password.trim() === "" || req.body.username.trim() === "" || req.body.first_name.trim() === "" || req.body.last_name.trim() === "" ){
        logger.info("user details are not accepted -- empty values");
        res.sendStatus(400);
    }
   
    var {first_name,last_name,username,password} = req.body;
    const listOne = await User.findOne({ where: { username: username } });

    if(typeof req.body.id !== "undefined"){
        logger.info("id is auto generated");
        return res.sendStatus(400);
       
    }

    if (listOne === null) {

        const salt = await bcrypt.genSalt(10);
        password =  await bcrypt.hash(req.body.password,salt);
        

        await User.create ({
            username,
            password,
            first_name,
            last_name
        });
        logger.info("user created --->");

        const list_get = await User.findOne({ where: { username: username } });
        const {id,createdAt,updatedAt} = list_get
        res.status(201).json({first_name,last_name,username,id,createdAt,updatedAt});
    }
    else {
        res.sendStatus(400);
        logger.info("user already exists -- Username taken");
    }
    
}
else {
    res.sendStatus(400);
    logger.info("user details are not accepted -- empty values");
}

},


verify: async(req,res) => {


try{
statsd.increment('endpoint_all');
statsd.increment('endpoint_userGet');

        if(req.headers.authorization === undefined){
           logger.info("auth required");
           return res.sendStatus(401);
        }
        else
        {
            //grab the encoded value
            var encoded = req.headers.authorization.split(' ')[1];
            // decode it using base64
            var decoded = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
            var name = decoded.split(':')[0];
            var pass = decoded.split(':')[1];

        
        const list_1 = await User.findOne({ where: { username: name } });

        if (list_1 === null || req.body === ""){
            logger.info("No user matches the following username");
            return res.status(401).json({ msg: " User Not Found" })
            
        }
        else {

        var  {username,password} =  list_1;
        const verified = bcrypt.compareSync(pass,password);
        if(username === name){
            if (verified) {
                if(req.params.id == list_1.id){
                    const {username,id,createdAt,updatedAt,first_name,last_name} = list_1
                    return res.status(200).json({username,id,first_name,last_name,createdAt,updatedAt}) }  
                else{
                    logger.info("Access mismatch --> id level check");
                    return res.sendStatus(403);
                    }
                }
            else {
                logger.info("Password mismatch");
                return res.sendStatus(401);
            }
        }
        else {
            logger.info("Username mismatch");
            return  res.sendStatus(401);
           
        }
        }
}
}
catch(e){
logger.warn("error getting user data+"+e);
return res.sendStatus(400);
}},


update: async function (req, res) {


    statsd.increment('endpoint_all');
    statsd.increment('endpoint_updateUser');

    if(req.headers.authorization === undefined){
    logger.info("Auth required");
     return res.sendStatus(401);
    
    }
    else
    {
        //grab the encoded value
        var encoded = req.headers.authorization.split(' ')[1];
        // decode it using base64
        var decoded = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
        var name = decoded.split(':')[0];
        var pass = decoded.split(':')[1];

    
    const list_1 = await User.findOne({ where: { username: name } });

    if (list_1 === null){
        logger.info("User not found");
        return res.sendStatus(400);
        
    }
    else {

    var  {username,password} =  list_1;
    const verified = bcrypt.compareSync(pass,password);

    if(username === name){
        if (verified) {
           if ( typeof req.body.first_name === "undefined" || typeof req.body.last_name === "undefined" || typeof req.body.password === "undefined" || typeof req.body.username === "undefined"){
          return res.sendStatus(400);
           }
            if(req.params.id == list_1.id){
                var {username,id,createdAt,updatedAt,first_name,last_name,password} = list_1

                const salt = await bcrypt.genSalt(10);
                password =  await bcrypt.hash(req.body.password,salt);

            if(req.body.username === list_1.username){
                try{await User.update(
                    {
                     password: password,
                     first_name: req.body.first_name,
                     last_name:req.body.last_name
                    },
                    {
                      where: { username: name },
                    }
                  );
                  logger.info("Userdata updated");
                return res.sendStatus(204);
            }  catch(e){
                logger.warn("error creating user"+e);
                return res.sendStatus(400);
            }
            }
            else {
                return res.sendStatus(400);
            }
        }
               
            else{
                logger.info("Access mismatch ==> id check");
                return res.sendStatus(403);
                }
            }
        else {
            logger.info("Password mismatch");
            return res.sendStatus(401);
        }
    }
    else {
        logger.info("Username mismatch");
        return  res.sendStatus(401);
    }
    }
}

    
}

};