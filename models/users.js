
module.exports = (Sequelize, DataTypes) => { 

    const User = Sequelize.define('User',{

        username: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        password: DataTypes.STRING,
    },{
        freezeTableName: true
    });

return User;



    
}







