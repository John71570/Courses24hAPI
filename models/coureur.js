/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('coureur', {
    coureur_id: {
      type: DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true
    },
    coureur_prenom: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    coureur_nom: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    coureur_date_naissance: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    coureur_equipe: {
      type: DataTypes.STRING(128),
      allowNull: true,
      references: {
        model: 'equipe',
        key: 'equipe_id'
      }
    },
    coureur_etudiant: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    coureur_certificat: {
      type: "BLOB",
      allowNull: true
    },
    coureur_certificat_valide: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    coureur_paiement: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    coureur_taille_tee_shirt: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    coureur_commentaire: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    coureur_telephone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    coureur_email: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'coureur'
  });
};
