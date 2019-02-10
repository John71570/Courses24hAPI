var express = require('express');
var router = express.Router();
var passport = require('passport');
var sequelize = require('../config/config-database').sequelize;
var Equipe = sequelize.import('../models/equipe');
var Categorie = sequelize.import('../models/categorie');
var sha256 = require('sha256');
var uuidv4 = require('uuid/v4');

router.get('/all', function(req, res, next) {

	Equipe.findAll({ raw: true })
		.then( equipe => {
			if (equipe) {
				res.status(200);
				res.send(equipe);
			} else {
				res.status(202);
				res.send({
					"error": "NotFound",
					"code": 202,
					"message": "Pas d'équipe éxistante"
				});
			}
		})
		.catch( err => {
			res.status(500);
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Probleme pour retrouver les catégories"+err
			});
		});

});

router.get('/all/categorie/:id', function(req, res, next) {

	Equipe.findAll({ raw: true, where: {equipe_categorie: req.params.id} })
		.then( equipe => {
			if (equipe) {
				res.status(200);
				res.send(equipe);
			} else {
				res.status(202);
				res.send({
					"error": "NotFound",
					"code": 202,
					"message": "L'équipe n'existe pas"
				});
			}
		})
		.catch( err => {
			res.status(500);
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Probleme pour vérifier l'existence de l'équipe"+err
			});
		});

});

router.get('/id/:id', function(req, res, next) {

	Equipe.findOne({ raw: true, where: { equipe_id: req.params.id } })
		.then( equipe => {
			if (equipe) {
				res.status(200);
				res.send(equipe);
			} else {
				res.status(202);
				res.send({
					"error": "NotFound",
					"code": 202,
					"message": "L'équipe n'existe pas"
				});
			}
		})
		.catch( err => {
			res.status(500);
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Probleme pour vérifier l'existence de l'équipe"+err
			});
		});

});

router.get('/nom/:nom', function(req, res, next) {

	Equipe.findOne({ raw: true, where: { equipe_nom: req.params.nom } })
		.then( equipe => {
			if (equipe) {
				res.status(200);
				res.send(equipe);
			} else {
				res.status(202);
				res.send({
					"error": "NotFound",
					"code": 202,
					"message": "L'équipe n'existe pas"
				});
			}
		})
		.catch( err => {
			res.status(500);
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Probleme pour vérifier l'existence de l'équipe"+err
			});
		});

});

router.post('/', function(req, res, next) {

	Equipe.findOne({ where: {
			equipe_nom: req.body.equipe.equipe_nom,
		}})
		.then( result => {
			//If raw does not exist yet
			if(result == null){
				//Save the new role
				var equipeJSON = req.body.equipe;
				equipeJSON.equipe_id =  uuidv4();
				equipeJSON.equipe_sel = Date.now();
				equipeJSON.equipe_mdp = sha256.x2(req.body.equipe.equipe_mdp+equipeJSON.equipe_sel);
				equipeJSON.equipe_valide = 0;

				Equipe.create(equipeJSON)
					.then( result2 => {
						res.status(201);
						res.send({
							"code": 201
						});
					})
					.catch( err =>{
						res.status(500);
						res.send({
							"error": "InternalServerError",
							"code": 500,
							"message": "Création de l'équipe impossible :"+err
						});
					});
				//If role exists yet
			}else{
				res.status(202);
				res.send({
					"error": "EquipeAlreadyExist",
					"code": 409,
					"message": "L'équipe existe déjà"
				});
			}
		})
		.catch( err =>{
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Probleme pour vérifier l'existence de l'équipe : "+err.message
			});
		});

});

router.put('/:id', function(req, res, next) {

	if(req.is('application/json')){

		Equipe.findOne({ where: {
				equipe_id : req.params.id
			} })
			.then( result =>{

				if (result) {

					result.update(req.body.equipe)
						.then( result2 => {
							res.status(204).end();
						}).catch( err => {
							res.status(500);
							res.send({
								"error": "InternalServerError",
								"code": 500,
								"message": "Problem pour mettre à jour l'équipe : "+err
							});
						});

				} else {
					res.status(202);
					res.send({
						"error": "NotFound",
						"code": 202,
						"message": "L'équipe n'existe pas"
					});
				}
			})
			.catch( err =>{
				res.send({
					"error": "InternalServerError",
					"code": 500,
					"message": "Probleme pour vérifier l'existence de l'équipe : "+err
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

	Equipe.destroy({ where: {
			equipe_id : req.params.equipe_id,
		}})
		.then( result => {
			if (result > 0) {
				res.status(204).end();
			} else {
				res.status(202);
				res.send({
					"error": "NotFound",
					"code": 404,
					"message": "L'équipe n'existe pas"
				});
			}
		})
		.catch(err => {
			res.status(500);
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Probleme pour supprimer l'équipe : "+err.message
			});
		});
});

module.exports = router;