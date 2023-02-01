
module.exports = (Sequelize, DataTypes) => { 

    const User = Sequelize.define('user',{

        username: DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        password: DataTypes.STRING
    },{
        freezeTableName: true
    });
    return User;
}







