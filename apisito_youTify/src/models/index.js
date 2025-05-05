const { sequelize } = require('../config/db.config');
const Cancion = require('./Cancion')(sequelize);
const Albun = require('./Albun')(sequelize);
const Artista = require('./Artista')(sequelize);
const Genero = require('./Genero')(sequelize);

Genero.hasMany(Artista, {
    foreignKey: 'id_genero',
    sourceKey: 'id_genero',
        as: 'artistas',      
});
Artista.hasMany(Albun, {
    foreignKey: 'id_artista',
    sourceKey: 'id_artista',
        as: 'albunes',      
});
Albun.hasMany(Cancion, {
    foreignKey: 'id_albun',
    sourceKey: 'id_albun',
        as: 'canciones',      
});


Artista.belongsTo(Genero, {
    foreignKey: 'id_genero',
        as: 'artistas',      
});
Albun.belongsTo(Artista, {
    foreignKey: 'id_artista',
        as: 'albunes',      
});
Cancion.belongsTo(Albun, {
    foreignKey: 'id_albun',
        as: 'canciones',      
});

module.exports = {
    Albun,
    Artista,
    Cancion,
    Genero,
    Sequelize: sequelize.Sequelize,
};