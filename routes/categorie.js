var express = require('express');
var router = express.Router();
var passport = require('passport');
var sequelize = require('../config/config-database').sequelize;
var Categorie = sequelize.import('../models/categorie');
var sha256 = require('sha256');
var uuidv4 = require('uuid/v4');

router.get('/all', function(req, res, next) {

	Categorie.findAll({ raw: true })
		.then( categories => {
			if (categories) {
				res.status(200);
				res.send(categories);
			} else {
				res.status(202);
				res.send({
					"error": "NotFound",
					"code": 404,
					"message": "Pas de catégorie existante"
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

router.get('/:id', function(req, res, next) {

	Categorie.findOne({ raw: true, where: { categorie_id: req.params.id } })
		.then( categorie => {
			if (categorie) {
				res.status(200);
				res.send(categorie);
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
				"message": "Probleme pour vérifier l'existence de la catégorie"+err
			});
		});

});

router.post('/', function(req, res, next) {

	Categorie.findOne({ where: {
			categorie_nom: req.body.categorie.categorie_nom,
		}})
		.then( result => {
			//If raw does not exist yet
			if(result == null){
				//Save the new role
				var categorieJSON = req.body.categorie;
				categorieJSON.categorie_id =  uuidv4();

				Categorie.create(categorieJSON)
					.then( result2 => {
						res.status(201).end();
					})
					.catch( err =>{
						res.status(500);
						res.send({
							"error": "InternalServerError",
							"code": 500,
							"message": "Création de la catégorie impossible :"+err
						});
					});
				//If role exists yet
			}else{
				res.status(202);
				res.send({
					"error": "CategorieAlreadyExist",
					"code": 409,
					"message": "La catégorie existe déjà"
				});
			}
		})
		.catch( err =>{
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Probleme pour vérifier l'existence de la catégorie : "+err.message
			});
		});

});

router.put('/:id', function(req, res, next) {

	if(req.is('application/json')){

		Categorie.findOne({ where: {
				categorie_id : req.params.id
			} })
			.then( result =>{

				if (result) {

					result.update(req.body.categorie)
						.then( result2 => {
							res.status(204).end();
						}).catch( err => {
						res.status(500);
						res.send({
							"error": "InternalServerError",
							"code": 500,
							"message": "Problem pour mettre à jour la catégorie : "+err
						});
					});

				} else {
					res.status(202);
					res.send({
						"error": "NotFound",
						"code": 404,
						"message": "La catégorie n'existe pas"
					});
				}
			})
			.catch( err =>{
				res.send({
					"error": "InternalServerError",
					"code": 500,
					"message": "Probleme pour vérifier l'existence de la catégorie : "+err
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

	Categorie.destroy({ where: {
			categorie_id : req.params.categorie_id,
		}})
		.then( result => {
			if (result > 0) {
				res.status(204).end();
			} else {
				res.status(202);
				res.send({
					"error": "NotFound",
					"code": 404,
					"message": "La catégorie n'existe pas"
				});
			}
		})
		.catch(err => {
			res.status(500);
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Probleme pour supprimer la catégorie : "+err.message
			});
		});
});

module.exports = router;
