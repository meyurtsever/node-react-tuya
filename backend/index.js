import app from './server.js'
import mongodb from 'mongodb'
import dotenv from 'dotenv'
import DevicesDAO from './dao/devicesDAO.js'
import RulesDAO from './dao/rulesDAO.js'

dotenv.config()

const MongoClient = mongodb.MongoClient

const PORT = process.env.PORT || 8000

MongoClient.connect(
    process.env.IOTDEVICES_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500 }
    )
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await DevicesDAO.injectDAO(client)
        await RulesDAO.injectDAO(client)
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        })
    })