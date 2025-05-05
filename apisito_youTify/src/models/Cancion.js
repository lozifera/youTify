const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Cancion', {
        id_cancion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        path: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        fileName: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        audioPath:{
            type: DataTypes.STRING(200),
            allowNull: false
        },
        audioFileName: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        id_albun: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
        
    }, {
        tableName: 'cancion',
        timestamps: false
    });
};   