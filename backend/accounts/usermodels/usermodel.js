const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        UserID: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
        FirstName: { type: DataTypes.STRING, allowNull: false },
        MiddleName: { type: DataTypes.STRING, allowNull: false },
        LastName: { type: DataTypes.STRING, allowNull: false },
        DefaultAddressID: { type: DataTypes.INTEGER, allowNull: false },
        DefaultPhoneID: { type: DataTypes.INTEGER, allowNull: false },
    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false, 
        defaultScope: {
            // exclude password hash by default
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }        
    };


    

    return sequelize.define('Users', attributes,options);
}