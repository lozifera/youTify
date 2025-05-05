const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Albun', {
        id_albun: {
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
        id_artista: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'albun',
        timestamps: false
    }); 
};
