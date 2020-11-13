
const {EventModel} = require('../db/models')
const {ActorModel} = require('../db/models')
const {RepoModel} = require('../db/models')
const _ = require('lodash')

const getAllActors = async (req, res, next) => {
	let actorList = []
	await ActorModel.findAll({raw: true})
	.then(res => {actorList = res;})

	
	if(actorList.length == 0){
		res.status(404).send('No record found !')
		// send({status:"Failed", message:"No record found !"});
	}

	const collectData = async() => {
		let ctr = 0
		await actorList.forEach(async (element, i, arr) => {
			
		await EventModel.findAndCountAll({
			// include: [{model: ActorModel, as : 'actor' }],
			where:{ actorId : element.id},
			
			// distinct: true,
			// col: 'actorId',
			
		}).then(result => {  actorList[i].eventCount = result.count })
		await EventModel.findAll({
			raw: true,
			where:{ actorId: element.id},
			order:[
				['created_at', 'DESC']
			],
			limit:1
		})
		.then( result => {actorList[i].timestamp = result[0].created_at})
			ctr++; 
         if (ctr === arr.length) {
			sendData();
         }
	})
}		

	const sendData = async () =>{
		const result = await _.orderBy(actorList,['eventCount','timestamp','login'], ['desc','desc','asc'] )
		return res.status(200).json({status:"Success", message:"Actors Retrieved", data:result});
	}
		
	return collectData()
		.then(async(res) => {
			
		})
		.catch(error => {
		res.status(500).send({status:"Failed", message:'DB Error', data:error});
		})
	
};

const updateActor = async (req, res, next) => {
	const actor = req.body

	await ActorModel.findByPk(actor.id)
	.then(async availableactor => {
		if (!availableactor) return res.status(404).send('Actor ID does not exist !')
		// .send({status:"Failed", message:"ID does not exist !"});

		if (actor.login !== availableactor.login ) return res.status(400).send({status:"Failed", message:"Only avatar update allowed !"});

		await ActorModel.update({avatar_url : actor.avatar_url}, {
			where: { id : actor.id }
		})
		.then((updatedActor) => {
			return res.status(200).json({status:"Success", message:"Actor Avatar Updated !", data:updatedActor});
		})
		.catch(error => {
			res.status(500).send({status:"Failed", message:'DB Error', data:error});
			})
	})

};

const getStreak = async (req, res, next) => {

	let actorList = []
	await ActorModel.findAll({raw: true})
	.then(res => {actorList = res;})

	
	if(actorList.length == 0){
		res.status(404).send('ActorList empty !')
		// send({status:"Failed", message:"No record found !"});
	}

	const currentStreak = (arr) =>{

		let count = 0
		arr.forEach((el, i) => {
			// if ((new Date().setUTCHours(0,0,0,0) - new Date(el.created_at).setUTCHours(0,0,0,0)) === i * 86400000) count++
			// && (new Date() - new Date(el.created_at) < i+1 * 86400000)
		  if ((new Date() - new Date(el.created_at)) >= i * 86400000  ) count++
		})
		return count
	  } 

	const collectData = async() => {
		let ctr = 0
		await actorList.forEach(async (element, i, arr) => {
			
		
		await EventModel.findAll({
			raw: true,
			where:{ actorId: element.id},
			attributes: {exclude: ['actorId', 'repoId','id','type'] },
			order:[
				['created_at', 'DESC']
			],
		})
		.then(async result => {
			actorList[i].timestamp = result[0].created_at
			actorList[i].currentStreak = await currentStreak(result)
		})
			
		ctr++; 
         if (ctr === arr.length) {
			sendData();
         }
		})
	}	
	const sendData = async () =>{
		const result = await _.orderBy(actorList,['currentStreak','timestamp','login'], ['desc','desc','asc'] )
		return res.status(200).json({status:"Success", message:"Actors Streak Retrieved", data:result});
	}
		try {
		return collectData()
		.then(async(res) => {
			
		})
		}
		catch(error) {

		res.status(500).send({status:"Failed", message:'DB Error', data:error});
		}

};


module.exports = {
	updateActor: updateActor,
	getAllActors: getAllActors,
	getStreak: getStreak
};

















