module.exports = (sequelize , DataTypes) =>{
    const Image = sequelize.define("Image",{
    id: {
        type : DataTypes.INTEGER,
        readOnly: true,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        readOnly: true,
    },
    s3_bucket_path:{
        type: DataTypes.STRING,
        allowNull: false,
        readOnly: true,
    }
    },
    {
    createdAt:'date_created',
    updatedAt: false,
   
    });
    return Image;
    };