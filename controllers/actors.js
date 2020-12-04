
const {EventModel} = require('../db/models')
const {ActorModel} = require('../db/models')
const {RepoModel} = require('../db/models')
const _ = require('lodash');

const getAllActors = async (req, res) => {
	let actorList = []
	await ActorModel.findAll({raw: true})
	.then(res => {actorList = res;})

	if(actorList.length == 0){
		res.status(404).send("No record found !")
	}

	const collectData = async() => {
		let ctr = 0
		await actorList.forEach(async (element, i, arr) => {
			
		await EventModel.findAndCountAll({
			// include: [{model: ActorModel, as : 'actor' }],
			where:{ actorId : element.id},
			
			// distinct: true,
			// col: 'actorId',
			
		}).then(result => { actorList[i].eventCount = result.count })
		await EventModel.findAll({
			raw: true,
			where:{ actorId: element.id},
			order:[
				['created_at', 'DESC']
			],
			limit:1
		})
		.then( result => {if (actorList[i].eventCount >= 1) actorList[i].timestamp = new Date(result[0].created_at)})
			ctr++; 
         if (ctr === arr.length) {
			sendData();
         }
	})
}		

	const sendData = async () =>{
		const result = await _.orderBy(actorList,['eventCount','timestamp','login'], ['desc','desc','asc'] )
		const reslt = await result.map((el) => { return{ 'id':el.id, 'login':el.login, 'avatar_url':el.avatar_url}})
		return res.status(200).send(reslt)
	}
		
	return collectData()
		.then(async(res) => {
			
		})
		.catch(error => {
		res.status(500).send(error);
		})
	
};

const updateActor = async (req, res) => {
	const actor = req.body

	await ActorModel.findByPk(actor.id)
	.then(async availableactor => {
		if (!availableactor) return res.status(404).send("ID does not exist !");

		if (actor.login !== availableactor.login ) return res.status(400).send("Only avatar update allowed !");

		await ActorModel.update({avatar_url : actor.avatar_url}, {
			where: { id : actor.id }
		})
		.then((updatedActor) => {
			return res.status(200).send({});
		})
		.catch(error => {
			res.status(500).send(error);
			})
	})

};

const getStreak = async (req, res) => {

	let actorList = []
	
	await ActorModel.findAll({raw: true})
	.then(res => {actorList = res})

	
	if(actorList.length == 0){
		res.status(404).send("No record found !");
	}


	const currentStreak = (arr) =>{

		let count = 0
		
		arr.forEach((el, i) => {
			
			let dt1 = new Date(el.created_at + 'Z') 

			if (i < arr.length-1){
			let dt2 = new Date(arr[i+1].created_at + 'Z')
			// if ((dt1 - dt2 >= i * 86400000) && (dt1 - dt2 < (i+1) * 86400000))  count++			// && (new Date() - new Date(el.created_at) < i+1 * 86400000)
			if ((dt1.setUTCHours(0,0,0,0) - dt2.setUTCHours(0,0,0,0)) ===  86400000) count++
		}

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
			
			if (result.length >= 1){
			
				actorList[i].timestamp = await new Date(result[0].created_at)
			}
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
		const reslt = await result.map((el) => { return{ 'id':el.id, 'login':el.login, 'avatar_url':el.avatar_url}})
		// const reslt = await _.map(result, (row) => { return _.omit(row, ['currentStreak','timestamp']) });
		return res.status(200).json(reslt);
	}
		try {
		return collectData()
		.then(async(res) => {
			
		})
		}
		catch(error) {

		res.status(500).send(error);
		}

};


module.exports = {
	updateActor: updateActor,
	getAllActors: getAllActors,
	getStreak: getStreak
};

















