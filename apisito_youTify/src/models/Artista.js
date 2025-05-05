const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Artista', {
        id_artista: {
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
        id_genero: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'artista',
        timestamps: false
    });
};