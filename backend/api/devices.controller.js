import DevicesDAO from '../dao/devicesDAO.js'
//import new_deneme from './new_deneme.cjs'

import { TuyaContext } from '@tuya/tuya-connector-nodejs';
import DeviceDAO from '../dao/devicesDAO.js';

export default class DevicesController {
    static async apiGetDevices(req, res, next) {
        const devicesPerPage = req.query.devicesPerPage ? parseInt(req.query.devicesPerPage, 10) : 10
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.name) {
            filters.name = req.query.name
        }

        const { devicesList, totalNumDevices } = await DevicesDAO.getDevices({
            filters,
            page,
            devicesPerPage,
          })

        let response = {
            devices: devicesList,
            page: page,
            filters: filters,
            entries_per_page: devicesPerPage,
            total_results: totalNumDevices,
        }
        res.json(response)
    }

    static async apiGetDeviceById(req, res, next) {
        try {
            let id = req.params.id || {}
            let device = await DeviceDAO.apiGetDeviceByID(id)
            if (!device) {
                res.status(404).json({ error: 'Device not found by ID' })
                return
            }
            res.json(device)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiPostDevice(req, res, next) {
        try {
            const name = req.body.name
            const device_id = req.body.device_id
            const project_access_id = req.body.project_access_id
            const project_secret = req.body.project_secret

            const DeviceResponse = await DevicesDAO.addDevice(
                name,
                device_id,
                project_access_id,
                project_secret,
            )
            res.json({status: "device added successfully"})
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateDevice(req, res, next) {
        try {
            const mongo_id = req.body.id
            const name = req.body.name
            const device_id = req.body.device_id
            const project_access_id = req.body.project_access_id
            const project_secret = req.body.project_secret

            const DeviceResponse = await DevicesDAO.updateDevice(
                mongo_id,
                name,
                device_id,
                project_access_id,
                project_secret,
            )

            var { error } = DeviceResponse

            if (error) {
                res.status(400).json({ error })
            }

            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteDevice(req, res, next) {
        try {

            const mongo_id = req.body.id
            // const device_id = req.body.device_id
            
            console.log(mongo_id)

            const deviceResponse = await DevicesDAO.deleteDevice(
                mongo_id,
            )
            var { error } = deviceResponse

            if (error) {
                res.status(400).json({ error })
            }

            res.json( { status: "device deleted successfully" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiGetDeviceStatus(req, res) {
        try {
            const context = new TuyaContext({
                baseUrl: 'https://openapi.tuyaeu.com',
                accessKey: req.body.project_access_id,
                secretKey: req.body.project_secret,
            });
            const device_id = req.body.device_id

            const devicedetail  = await context.deviceStatus.status({
                device_id: device_id,
            });

            if (!devicedetail.success) {
                new Error();
            }
            console.log("Device details:", devicedetail);
            // devicedetail json parse...
            
            res.json( { status: devicedetail })

        } catch (e) {
            res.status(500).json({ error: e })
        }
    }

    // keyler (2), device_id, code, value --> 5 param. alir.
    static async apiSendCommandToDevice(req, res) {
        try {
            const context = new TuyaContext({
                baseUrl: 'https://openapi.tuyaeu.com',
                accessKey: req.body.project_access_id,
                secretKey: req.body.project_secret,
              });

            // Send command to device using dev_id, secrets, code and value parameters.
            const commands = await context.request({
                path: `/v1.0/iot-03/devices/${req.body.device_id}/commands`,
                method: 'POST',
                body: {
                "commands":[{"code":req.body.code, "value":req.body.value}]
                }
            });

            if (!commands.success) {
                new Error();
            }
            
            console.log("command details:", commands);
            res.json( { status: commands })

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    // device_id, access_id ve secret gerekli.
    static async apiTurnOnDevice(req, res) {
       /* try {
            const project_access_id = req.body.project_access_id
            const project_secret = req.body.project_secret
            const device_id = req.body.device_id

            console.log(project_access_id)
            console.log(project_secret)
            console.log(device_id)

            const deviceResponse = await new_deneme(project_access_id, 
                                                    project_secret,
                                                    device_id)
            var error = deviceResponse
            if (error) {
                res.status(400).json({ error })
            }
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
        */

        const device_id = "65158722f4cfa23ca021";

        const devicedetail  = await context.deviceStatus.status({
            device_id: device_id,
          });

        if (!devicedetail.success) {
            new Error();
        }
        console.log("Device details:", devicedetail);
        res.json( { status: devicedetail })
    }

}