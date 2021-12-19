import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let rules

export default class RulesDAO {
    static async injectDAO(conn) {
        if (rules) {
            return;
        }
        try {
            rules = await conn.db(process.env.DEVICES_NS).collection('rules')
        } catch (e) {
            console.error(
                `Unable to connect to the DB, handle in RulesDAO: ${e}`
            )
        }
    }

    static async AddRule(device_id, data_source, tracking_data, check_interval, action) {
        try {
            const ruleDoc = {
                device_id: ObjectId(device_id),
                data_source: data_source,
                tracking_data: tracking_data,
                check_interval: check_interval,
                action: action
            }
            return await rules.insertOne(ruleDoc)
        } catch (e) {
            console.error(`Unable to post new rule: ${e}`)
            return { error: e }
        }
    }

    static async updateRule(_id, data_source, tracking_data, info) {
        try {
            const updateResponse = await rules.updateOne(
                {_id: ObjectId(_id)},
                { $set: {data_source: data_source, tracking_data: tracking_data, info: info}}
            )
            return updateResponse
        } catch (e) {
            console.error(`Unable to update rule: ${e}`)
            return { error: e }
        }
    }

    static async deleteRule(ruleId) {
        try {
            const deleteResponse = await rules.deleteOne({
                _id: ObjectId(ruleId),
            })
            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete rule: ${e}`)
            return { error: e }
        }
    }
}