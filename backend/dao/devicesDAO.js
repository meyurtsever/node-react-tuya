import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let devices;

export default class DeviceDAO {
    static async injectDAO(conn) {
        if (devices) {
            return;
        }
        try {
            devices = await conn.db(process.env.DEVICES_NS).collection('devices')
        } catch (e) {
            console.error(
                `Unable to connect to the DB, handle in DeviceDAO: ${e}`
            )
        }
    }

    static async getDevices({
        filters = null,
        page = 0,
        devicesPerPage = 10,
    } = {}) {
        let query
        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters["name"] } }
            }
        }

        let cursor

        try {
            cursor = await devices
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { devicesList: [], totalNumDevices: 0 }
        }

        const displayCursor = cursor.limit(devicesPerPage).skip(devicesPerPage * page)

        try {
            const devicesList = await displayCursor.toArray()
            const totalNumDevices = await devices.countDocuments(query)
      
            return { devicesList, totalNumDevices }
        } catch (e) {
            console.error(
              `Unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return { devicesList: [], totalNumDevices: 0 }
        }
    }

    static async apiGetDeviceByID(id) {
        try {
          const pipeline = [
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
                  {
                      $lookup: {
                          from: "rules",
                          let: {
                              id: "$_id",
                          },
                          pipeline: [
                              {
                                  $match: {
                                      $expr: {
                                          $eq: ["$device_id", "$$id"],
                                      },
                                  },
                              },
                              {
                                  $sort: {
                                      date: -1,
                                  },
                              },
                          ],
                          as: "rules",
                      },
                  },
                  {
                      $addFields: {
                          rules: "$rules",
                      },
                  },
              ]
          return await devices.aggregate(pipeline).next()
        } catch (e) {
          console.error(`Something went wrong in getDeviceByID: ${e}`)
          throw e
        }
      }

    // project id ve secret, .env icerisinde olabilir.
    static async addDevice(name, device_id, project_access_id, project_secret) {
        try {
            const deviceDoc = {
                name: name,
                device_id: device_id,
                project_access_id: project_access_id,
                project_secret: project_secret,
            }
            return await devices.insertOne(deviceDoc)
        } catch (e) {
            console.error(`Unable to post new device: ${e}`)
            return { error: e }
        }
    }

    static async updateDevice(mongo_id, name, device_id, project_access_id, project_secret) {
        try {
            const updateResponse = await devices.updateOne(
                {_id: ObjectId(mongo_id)},
                {$set: { name: name, device_id: device_id, project_access_id: project_access_id, project_secret: project_secret } },
            )
            return updateResponse
        } catch (e) {
            console.error(`Unable to update device: ${e}`)
            return { error: e }
        }
    }

    static async deleteDevice(mongo_id) {
        try {
            const deleteResponse = await devices.deleteOne({
                _id: ObjectId(mongo_id),
            })
            return deleteResponse

        } catch (e) {
            console.error(`Unable to delete device: ${e}`)
        }
    }
}