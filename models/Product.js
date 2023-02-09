module.exports = (Sequelize, DataTypes) => { 

    const Product = Sequelize.define('Product',{

        name: {
            type: DataTypes.STRING,
            allowNull: false
       },
        description: {
            type: DataTypes.STRING,
            allowNull: false
       },
        sku: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
       },
        manufacturer: {
            type: DataTypes.STRING,
            allowNull: false
       },
        quantity:   {
            type: DataTypes.INTEGER,
            allowNull: false
       },
       createdAt: { type: DataTypes.DATE, 
        field: 'date_added' },
       updatedAt: { type: DataTypes.DATE,
         field: 'date_last_updated' }

    },
    {
        freezeTableName: true,

    });

    return Product;

    
}