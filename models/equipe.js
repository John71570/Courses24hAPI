/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('equipe', {
    equipe_id: {
      type: DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true
    },
    equipe_nom: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    equipe_mdp: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    equipe_categorie: {
      type: DataTypes.STRING(128),
      allowNull: true,
      references: {
        model: 'categorie',
        key: 'categorie_id'
      }
    },
    equipe_valide: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    equipe_sel: {
      type: DataTypes.STRING(512),
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
    tableName: 'equipe'
  });
};
