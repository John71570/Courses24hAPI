var express = require('express');
var router = express.Router();
var passport = require('passport');
var sequelize = require('../config/config-database').sequelize;
var Categorie = sequelize.import('../models/categorie');
var Equipe = sequelize.import('../models/equipe');
var Coureur = sequelize.import('../models/coureur');
Equipe.hasMany(Coureur, {foreignKey: 'coureur_equipe', sourceKey: 'equipe_id'});
Equipe.belongsTo(Categorie, {foreignKey: 'equipe_categorie', sourceKey: 'categorie_id'});
var sha256 = require('sha256');
var uuidv4 = require('uuid/v4');
const fs = require('fs');

router.get('/all/all', function(req, res, next) {

	Equipe.findAll({ raw: true, include: [{model: Coureur},{model: Categorie}], order:[['equipe_nom','DESC']]})
		.then( coureur => {
			if (coureur) {
				res.status(200);
				res.send(coureur);
			} else {
				res.status(202);
				res.send({
					"error": "NotFound",
					"code": 404,
					"message": "Aucun coureur pour cette équipe"
				});
			}
		})
		.catch( err => {
			res.status(500);
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Problem pour trouver les coureurs de l'équipe : "+err
			});
		});

});

router.get('/all/equipe/:id', function(req, res, next) {

	Coureur.findAll({ raw: true, where: { coureur_equipe: req.params.id } })
		.then( coureur => {
			if (coureur) {
				res.status(200);
				res.send(coureur);
			} else {
				res.status(202);
				res.send({
					"error": "NotFound",
					"code": 404,
					"message": "Aucun coureur pour cette équipe"
				});
			}
		})
		.catch( err => {
			res.status(500);
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Problem pour trouver les coureurs de l'équipe : "+err
			});
		});

});

router.get('/:id', function(req, res, next) {

	Coureur.findOne({ raw: true, where: { coureur_id: req.params.id } })
		.then( coureur => {
			if (coureur) {
				res.status(200);
				res.send(coureur);
			} else {
				res.status(202);
				res.send({
					"error": "NotFound",
					"code": 404,
					"message": "Le coureur n'existe pas"
				});
			}
		})
		.catch( err => {
			res.status(500);
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Probleme pour mettre à jour l'équipe : "+err
			});
		});

});

router.post('/', function(req, res, next) {

	Coureur.findOne({ where: {
			coureur_nom: req.body.coureur.coureur_nom,
			coureur_prenom: req.body.coureur.coureur_prenom,
			coureur_date_naissance: req.body.coureur.coureur_date_naissance,
		}})
		.then( result => {
			//If raw does not exist yet
			if(result == null){
				//Save the new role
				var coureurJSON = req.body.coureur;
				coureurJSON.coureur_id =  uuidv4();
				coureurJSON.coureur_certificat_valide = 0;
				coureurJSON.coureur_paiement = 0;

				Coureur.create(coureurJSON)
					.then( result2 => {
						res.status(201).end();
					})
					.catch( err =>{
						res.status(500);
						res.send({
							"error": "InternalServerError",
							"code": 500,
							"message": "Création de le coureur impossible : "+err
						});
					});
				//If role exists yet
			}else{
				res.status(202);
				res.send({
					"error": "CoureurAlreadyExist",
					"code": 409,
					"message": "Le coureur existe déjà"
				});
			}
		})
		.catch( err =>{
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Probleme pour vérifier l'existence de le coureur : "+err.message
			});
		});

});

router.put('/:id', function(req, res, next) {

	if(req.is('application/json')){

		Coureur.findOne({ where: {
				coureur_id : req.params.id
			} })
			.then( result =>{

				if (result) {

					result.update(req.body.coureur)
						.then( result2 => {
							res.status(204).end();
						}).catch( err => {
						res.status(500);
						res.send({
							"error": "InternalServerError",
							"code": 500,
							"message": "Problem pour mettre à jour le coureur : "+err
						});
					});

				} else {
					res.status(202);
					res.send({
						"error": "NotFound",
						"code": 404,
						"message": "Le coureur n'existe pas"
					});
				}
			})
			.catch( err =>{
				res.send({
					"error": "InternalServerError",
					"code": 500,
					"message": "Probleme pour vérifier l'existence de le coureur"+err
				});
			});

	}else{
		res.status(406);
		res.send({
			"error": "BadContentType",
			"code": 406,
			"message": "Content-type received: "+req.get('Content-Type')+". Content-type required : application/json"
		});
	}

});

router.put('/certificat/:id', function(req, res, next) {

	if(req.is('application/json')){

		Coureur.findOne({ where: {
				coureur_id : req.params.id
			} })
			.then( result =>{

				if (result) {
					var coureur = req.body.coureur;

					if(result.coureur_certificat_valide != 1) {
						fs.writeFile("public/certificats/" + result.coureur_nom + '_' + result.coureur_prenom + '_' + coureur.coureur_certificat_fichier + '.' + coureur.extension, Buffer.from(coureur.coureur_certificat_buffer), function (err) {
							if (err) {
								return console.log(err);
							}
							console.log("The file was saved!");
						});

						result.update({
							coureur_certificat_valide: 3,
							coureur_certificat_fichier: result.coureur_nom+'_'+result.coureur_prenom+'_'+coureur.coureur_certificat_fichier+'.'+coureur.extension
						})
							.then(result2 => {
								res.status(204).end();
							}).catch(err => {
							res.status(500);
							res.send({
								"error": "InternalServerError",
								"code": 500,
								"message": "Problem pour mettre à jour le coureur : " + err
							});
						});
					}
				} else {
					res.status(202);
					res.send({
						"error": "NotFound",
						"code": 404,
						"message": "Le coureur n'existe pas"
					});
				}
			})
			.catch( err =>{
				res.send({
					"error": "InternalServerError",
					"code": 500,
					"message": "Probleme pour vérifier l'existence de le coureur"+err
				});
			});

	}else{
		res.status(406);
		res.send({
			"error": "BadContentType",
			"code": 406,
			"message": "Content-type received: "+req.get('Content-Type')+". Content-type required : application/json"
		});
	}

});

router.delete('/:id', function(req, res, next) {

	Coureur.destroy({ where: {
			coureur_id : req.params.id,
		}})
		.then( result => {
			if (result > 0) {
				res.status(204).end();
			} else {
				res.status(202);
				res.send({
					"error": "NotFound",
					"code": 404,
					"message": "Le coureur n'existe pas"
				});
			}
		})
		.catch(err => {
			res.status(500);
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Probleme pour supprimer le coureur : "+err.message
			});
		});
});

module.exports = router;