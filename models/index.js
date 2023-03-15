// const dbconfig = require('../config/dbconfig');
require('dotenv').config();

const Sequelize = require('sequelize');


let arr = process.env.DB_HOST.split(':');

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,
  {
    host:arr[0],
    dialect: process.env.DIALECT
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


