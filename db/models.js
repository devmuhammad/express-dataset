
const {Sequelize, DataTypes } = require('sequelize');

// const {connection} = require('../app.js')

const connection = new Sequelize({
    dialect: 'sqlite',
    storage: './db/db.sqlite',
    pool: {
        max : 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
  });

const EventModel = connection.define('event', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
    },
    type: DataTypes.STRING,
    created_at: DataTypes.STRING,
    actorId: DataTypes.INTEGER,
    repoId: DataTypes.INTEGER,
    
    // { 
    //     type: DataTypes.DATE,
    //     // defaultValue:  new Date(Date.now()).toISOString()
    // }
    },{
        timestamps: false
    })

const ActorModel = connection.define('actor', {

    id: {
        primaryKey: true,
        unique:true,
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    login: {
        type: DataTypes.CHAR(20),
        unique: true
    },
    avatar_url: DataTypes.STRING

},{
    timestamps: false,
    modelName: 'actor'
})

const RepoModel = connection.define('repo', {

    id: {
        primaryKey: true,
        unique:true,
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: DataTypes.STRING,
    url: DataTypes.STRING

},{
    timestamps: false,
    modelName: 'repo'
})

EventModel.belongsTo(ActorModel, { foreignKey: 'actorId'})
EventModel.belongsTo(RepoModel, { foreignKey: 'repoId'})


module.exports = {EventModel, ActorModel, RepoModel, connection};