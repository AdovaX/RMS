const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        AddressID: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
        Address: { type: DataTypes.STRING, allowNull: false },
        Town: { type: DataTypes.STRING, allowNull: false },
        State: { type: DataTypes.STRING, allowNull: false },
        CountryID: { type: DataTypes.INTEGER, allowNull: false },
        PostCode: { type: DataTypes.STRING, allowNull: false },
    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false           
    };


    

    return sequelize.define('Addresses', attributes,options);
}