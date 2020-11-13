
const {EventModel} = require('../db/models')
const {ActorModel} = require('../db/models')
const {RepoModel} = require('../db/models')


const getAllEvents = async (req, res, next) => {

	await EventModel.findAll({
		include: [ActorModel, RepoModel],
		attributes: {exclude: ['actorId', 'repoId'] },
		order: [
			['id', 'ASC']
		]
	})
	.then(events => {
		if(!events){
			res.status(404).send('No record found !')
			//  ({status:"Failed", message:"No record found !"});
		}
		return res.status(200).json({status:"Success", message:"Events Retrieved", data:events});
		})
		.catch(error => {
		res.status(500).send({status:"Failed", message:'DB Error', data:error});
		})
};

const addEvent = async (req, res, next) => {
	const {actor, repo} = req.body
	let eventDetail = {
		id: req.body.id,
		actorId: req.body.actor.id,
		repoId: req.body.repo.id,
		type: req.body.type,
		created_at: req.body.created_at
	}

	await EventModel.findByPk(req.body.id)
	.then(async evnt => {

		if(evnt) return res.status(400).send({status:"Failed", message:'Event ID Exists'});
	
		const createActor = async () => { 
			const actorExist = await ActorModel.findByPk(req.body.actor.id)

			if (actorExist) return; 
		await ActorModel.create(actor)
		.then( actor => {
			return eventDetail.actorId = actor.id
		})
	}
	
		const createRepo = async () => { 
			const repoExist = await RepoModel.findByPk(req.body.repo.id)

			if (repoExist) return;
		await RepoModel.create(repo)
		.then( repo => {
			return eventDetail.repoId = repo.id
		})
	}
	 
		const createEvent = async () => { 

		await EventModel.create(eventDetail)
		.then(event => {
			
			return res.status(201).json({status:"Success", message:"Event Added !", data:event});
		})
	}

	try {
	await Promise.all([createActor(), createRepo()])
		.then((result) => {
			// if (eventDetail.actorId != null )

			return createEvent()
		})
	}catch(error) {
			res.status(500).send({status:"Failed", message:'DB Error', data:error});
			}
	

	})
	
};


const getByActor = async (req, res, next) => {

	const actorID = req.params.actorID

	await ActorModel.findByPk(actorID)
	.then(async actor =>{
		if (!actor) return res.status(404).send('Actor not found !')
		// ({status:"Failed", message:'Actor not found !'});

		await EventModel.findAll({ 
			where: { actorId: actorID},
			include: [ActorModel, RepoModel],
			attributes: {exclude: ['actorId', 'repoId'] },
			order: [
				['id', 'ASC']
			]
		})
		.then((events) => {

			return res.status(200).json({status:"Success", message:"Events Retrieved by actorId !", data:events});
		})
		.catch(error => {
			res.status(500).send({status:"Failed", message:'DB Error', data:error});
			})
	})
};


const eraseEvents = async (req, res, next) => {

	await EventModel.destroy({where: {}})
	.then(() =>{
		return res.status(200).json({status:"Success", message:"All Events Deleted !"});
	})
	.catch(error => {
		res.status(500).send({status:"Failed", message:'DB Error', data:error});
		})
};

module.exports = {
	getAllEvents: getAllEvents,
	addEvent: addEvent,
	getByActor: getByActor,
	eraseEvents: eraseEvents
};

















