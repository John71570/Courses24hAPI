var express = require('express');
var router = express.Router();
var passport = require('passport');
var sequelize = require('../config/config-database').sequelize;
var Coureur = sequelize.import('../models/coureur');
var sha256 = require('sha256');
var uuidv4 = require('uuid/v4');

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
					"message": "La catégorie n'existe pas"
				});
			}
		})
		.catch( err => {
			res.status(500);
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Problem pour mettre à jour l'équipe : "+err
			});
		});

});

router.post('/', function(req, res, next) {

	Coureur.findOne({ where: {
			coureur_nom: req.body.coureur.coureur_nom,
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
							"message": "Création de le coureur impossible :"+err
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

router.delete('/:id', function(req, res, next) {

	Coureur.destroy({ where: {
			coureur_id : req.params.coureur_id,
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