const dbconfig = require('../config/dbconfig');

const Sequelize = require('sequelize');



const sequelize = new Sequelize(dbconfig.DATABASE,dbconfig.USER,dbconfig.PASSWORD,{

    host:dbconfig.HOST,
    dialect: dbconfig.DIALECT
});


const db = {};
db.sequelize = sequelize;
db.models = {};
db.models.User =  require('./users')(sequelize,Sequelize.DataTypes);
db.models.Product =  require('./Product')(sequelize,Sequelize.DataTypes);
db.models.Image = require ('./Image')(sequelize,Sequelize.DataTypes);

db.models.User.hasMany(db.models.Product);
  db.models.Product.belongsTo(db.models.User);

  db.models.Product.hasMany(db.models.Image);
  db.models.Image.belongsTo(db.models.Product);

module.exports = db;


