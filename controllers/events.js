
const {EventModel} = require('../db/models')
const {ActorModel} = require('../db/models')
const {RepoModel} = require('../db/models');
const { resolve } = require('bluebird');


const getAllEvents = async (req, res) => {

	await EventModel.findAll({
		include: [ActorModel, RepoModel],
		attributes: {exclude: ['actorId', 'repoId'] },
		order: [
			['id', 'ASC']
		]
	})
	.then(events => {
		if(!events){
			res.status(404).send("No record found !");
		}
		return res.status(200).send(events);
		})
		.catch(error => {
		res.status(500).send(error);
		})
};

const addEvent = async (req, res) => {
	const {actor, repo} = req.body
	let eventDetail = {
		id: req.body.id,
		type: req.body.type,
		created_at: req.body.created_at,
		actorId: actor.id,
		repoId: repo.id,
	}

	await EventModel.findByPk(req.body.id)
	.then(async evnt => {

		if(evnt) return res.status(400).send('Event ID Exists');
		
		const createEvent = async () => { 

			await EventModel.create(eventDetail)
			.then(event => {
				
				return res.status(201).send({});
			})
		}

		const createActor = new Promise(async(resolve, reject) => {
		// async () => { 
			const actorExist = await ActorModel.findByPk(actor.id)

			if (actorExist) return resolve('exists'); 

		await ActorModel.create(actor)
		.then( actor => {
			resolve(eventDetail.actorId = actor.id)
		})
	})
	
		const createRepo = new Promise(async(resolve, reject) => {
		// async () => { 
			const repoExist = await RepoModel.findByPk(repo.id)

			if (repoExist) return resolve('exists');
		await RepoModel.create(repo)
		.then( repo => {
			resolve(eventDetail.repoId = repo.id)
		})
	})
	 
	try {
	await Promise.all([createActor, createRepo])
		.then((result) => {
			// if (eventDetail.actorId != null )
			resolve(createEvent())
			// return 
		})
	}catch(error) {
			res.status(500).send(error);
			}
	

	})
	
};


const getByActor = async (req, res) => {

	const actorID = req.params.actorID

	await ActorModel.findByPk(actorID)
	.then(async actor =>{
		if (!actor) return res.status(404).send('Actor not found !');

		await EventModel.findAll({ 
			where: { actorId: actorID},
			include: [ActorModel, RepoModel],
			attributes: {exclude: ['actorId', 'repoId'] },
			order: [
				['id', 'ASC']
			]
		})
		.then((events) => {

			return res.status(200).send(events);
		})
		.catch(error => {
			res.status(500).send(error);
			})
	})
};


const eraseEvents = async (req, res) => {

	await EventModel.destroy({where: {}})
	.then(async () =>{
		await ActorModel.destroy({where: {}})
		await RepoModel.destroy({where: {}})
		return res.status(200).send({})
		// send("All Events Deleted !");
	})
	.catch(error => {
		res.status(500).send(error);
		})
};

module.exports = {
	getAllEvents: getAllEvents,
	addEvent: addEvent,
	getByActor: getByActor,
	eraseEvents: eraseEvents
};

















