
const {Sequelize, DataTypes } = require('sequelize');

// const {connection} = require('../app.js')

const connection = new Sequelize({
    dialect: 'sqlite',
    storage: './db/db.sqlite'
  });

const EventModel = connection.define('event', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
    },
    type: DataTypes.STRING,
    actorId: DataTypes.INTEGER,
    repoId: DataTypes.INTEGER,
    created_at: { 
        type: DataTypes.DATE,
        defaultValue:  new Date(Date.now()).toISOString()
    },
    
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
// ActorModel.hasMany(EventModel)
// RepoModel.hasMany(EventModel)

connection
  .sync({force: true})
    // logging: console.log
  // })
  // .authenticate()
  .then(() => {
    console.log('Connection to database established successfully.');
    })
    .catch(err => {
    console.log('Unable to connect to the database: ', err);
    })

module.exports = {EventModel, ActorModel, RepoModel};