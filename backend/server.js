import express from "express"
import cors from 'cors'
import devices from './api/devices.router.js'

const app = express()

// determine what express gonna use.
app.use(cors())
//app.use(express.json()) //body parser
app.use(express.json());

// every route on this backend starts with (api/v1/devices)
app.use('/api/v1/devices', devices)

// route does not exists
app.use('*', (req, res) => res.status(404).json({error: 'not found'}))

export default app;