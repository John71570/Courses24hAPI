var express = require('express');
var router = express.Router();
var sequelize = require('../config/config-database').sequelize;
var Categorie = sequelize.import('../models/categorie');
var Equipe = sequelize.import('../models/equipe');
var Coureur = sequelize.import('../models/coureur');
Equipe.hasMany(Coureur, {foreignKey: 'coureur_equipe', sourceKey: 'equipe_id'});
Equipe.belongsTo(Categorie, {foreignKey: 'equipe_categorie', sourceKey: 'categorie_id'});


/* GET home page. */

router.get('/', function(req, res, next) {
	res.redirect('/connexion');
});

router.get('/admin', function(req, res, next) {
	if(req.session.user){
		res.render('admin');
	}else{
		res.redirect('/');
	}
});

router.get('/admin/coureurs', function(req, res, next) {

	if(req.session.user){
		Equipe.findAll({ raw: true, include: [{model: Coureur},{model: Categorie}], order:[['equipe_nom','DESC']]})
			.then( coureur => {
				if (coureur) {
					res.render('coureurs', { coureurs: coureur });
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
	}else{
		res.redirect('/');
	}

});

router.get('/admin/equipes', function(req, res, next) {

	if(req.session.user){
		var promiseCategories = Categorie.findAll({ raw: true, order:[['categorie_nom','DESC']] });
		var promiseEquipe = Equipe.findAll({ raw: true, include: [{model: Categorie}] });
		var promiseCoureur = Equipe.findAll({ raw: true, include: [{model: Coureur},{model: Categorie}], order:[['equipe_nom','DESC']]});

		var promises = [];
		var promisess = [];

		Promise.all([promiseCategories, promiseCoureur, promiseEquipe, promises])
			.then( result => {
				if (result[0]) {
					result[0].forEach((elem, index)=>{
						promises.push(sequelize.query('SELECT COUNT (DISTINCT equipe_id) AS nb FROM equipe WHERE equipe_categorie = :categorie ', { replacements: { categorie: elem.categorie_id }, type: sequelize.QueryTypes.SELECT }));
					});
					result[0].forEach((eleme, index)=>{
						promisess.push(sequelize.query('SELECT COUNT (DISTINCT coureur_id) AS nbc FROM coureur INNER JOIN equipe ON equipe.equipe_id = coureur.coureur_equipe WHERE equipe.equipe_categorie = :categorie ', { replacements: { categorie: eleme.categorie_id }, type: sequelize.QueryTypes.SELECT }));
					});
					Promise.all(promises)
						.then(ress =>{
							ress.forEach((ee, i)=>{
								result[0][i]['nb_equipes'] = ee[0]['nb'];
							});
							Promise.all(promisess)
								.then(resss => {
									resss.forEach((ee, i) => {
										result[0][i]['nb_coureurs'] = ee[0]['nbc'];
									});
									res.render('equipes', {coureurs: result[1], categories: result[0], equipes: result[2]});
								})
								.catch(err =>{

								});
						})
						.catch(err =>{

						});

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
	}else{
		res.redirect('/');
	}

});

router.get('/admin/categories', function(req, res, next) {

	if(req.session.user){
		Categorie.findAll({ raw: true })
			.then( categories => {
				if (categories) {
					res.render('categories', { categories: categories });
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
	}else{
		res.redirect('/');
	}

	Categorie.findAll({ raw: true })
		.then( categories => {
			if (categories) {
				res.render('categories', { categories: categories });
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

router.get('/deconnexion', function(req, res, next) {
<<<<<<< HEAD
	if(true){
		req.session.equipe = null;
=======
>>>>>>> cf1f981fea53488b91c6cd4cc60118e08c667cba
		req.session.destroy();
		res.redirect('/');
});

router.get('/connexion', function(req, res, next) {
	if(!req.session.user){
		res.render('connexion');
	}else{
		res.redirect('/admin');
	}
});

router.post('/connexion', function(req, res, next) {

	if(req.body.password == 'pedale@roti24h'){
		req.session.user = 'admin';
		res.redirect('/admin');
	}else{
		req.session.destroy();
		res.redirect('/connexion');
	}

});

module.exports = router;
