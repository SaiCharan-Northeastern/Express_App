

const {models : {User}} =  require('../models');
const bcrypt = require("bcrypt");
const users = require('../models/users');


module.exports = {

create: async(req,res) => {

if (req.body.password && req.body.username && req.body.firstname && req.body.lastname) {
   
    var {firstname,lastname,username,password} = req.body;
    const listone = await User.findOne({ where: { username: username } });
    if (listone === null) {

        const salt = await bcrypt.genSalt(10);
        password =  await bcrypt.hash(req.body.password,salt);

        await User.create ({
            username,
            password,
            firstname,
            lastname
        });

        const list_get = await User.findOne({ where: { username: username } });
        const {id,createdAt,updatedAt} = list_get
        res.status(201).json({msg: "User created", firstname,lastname,username,id,createdAt,updatedAt});
    }
    else {
        res.status(400).json({msg:"User Already Exists"});
    }
    
}
else {
    res.status(400).json({msg:"Enter all the required fields"});
}

},


verify: async(req,res) => {

   
        if(req.headers.authorization === undefined){
            res.status(401).send('Please provide WWW-Authorization using basic in headers with base 64 encoding');
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
            return res.status(401).json({ msg: " User Not Found" })
        }
        else {

        var  {username,password} =  list_1;
        const verified = bcrypt.compareSync(pass,password);
        if(username === name){
            if (verified) {
                if(req.params.id == list_1.id){
                    const {username,id,createdAt,updatedAt,firstname,lastname} = list_1
                    return res.status(200).json({ msg: "Login success" ,username,id,firstname,lastname,createdAt,updatedAt}) }  
                else{
                    const id = req.params.id;
                    const id2 = list_1.id;
                    return res.status(403).json({ msg: "Not authorized to see other profiles" })
                    }
                }
            else {
                return res.status(401).json({ msg: "Invalid password" })
            }
        }
        else {
            return  res.status(401).json({ msg: "Invalid username" })
        }
        }
}
},


update: async function (req, res) {

    if(req.headers.authorization === undefined){
        res.status(401).send('Please provide WWW-Authorization using basic in headers with base 64 encoding');
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
        return res.status(401).json({ msg: " User Not Found" })
    }
    else {

    var  {username,password} =  list_1;
    const verified = bcrypt.compareSync(pass,password);
    if(username === name){
        if (verified) {
            if(req.params.id == list_1.id){
                var {username,id,createdAt,updatedAt,firstname,lastname,password} = list_1

                const salt = await bcrypt.genSalt(10);
                password =  await bcrypt.hash(req.body.password,salt);

            //req.username compare with name
            //if diff 400;
            
                await User.update(
                    {
                     password: password,
                     firstname: req.body.firstname,
                     lastname:req.body.lastname
                    },
                    {
                      where: { username: name },
                    }
                  );

                  const list_to_show = await User.findOne({ where: { username: name } });



                return res.status(200).json({ msg: "Login success" ,id,firstname,lastname,createdAt,updatedAt}) }  
            else{
                const id = req.params.id;
                const id2 = list_1.id;
                return res.status(403).json({ msg: "Not authorized to see other profiles" })
                }
            }
        else {
            return res.status(401).json({ msg: "Invalid password" })
        }
    }
    else {
        return  res.status(401).json({ msg: "Invalid username" })
    }
    }
}

    
}

}
/*  User.update({
                          username,
                          password,
                          firstname,
                          lastname
                        },
                        {
                                where: { username: name },
                        });*/