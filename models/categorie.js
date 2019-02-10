/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('categorie', {
    categorie_id: {
      type: DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true
    },
    categorie_nom: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    categorie_description: {
        type: DataTypes.STRING(512),
        allowNull: false
    },
    categorie_nb_max: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    categorie_complet: {
        type: DataTypes.INTEGER(4),
        allowNull: true,
        defaultValue: '0'
    },
    categorie_type: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    categorie_nb_total: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    categorie_prix_normal: {
      type: "DOUBLE",
      allowNull: true
    },
    categorie_prix_va: {
      type: "DOUBLE",
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'categorie'
  });
};
