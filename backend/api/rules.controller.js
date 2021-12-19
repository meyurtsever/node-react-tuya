import RulesDAO from '../dao/rulesDAO.js';

export default class RulesController {
    static async apiPostRule(req, res, next) {
        try {
            // hangi cihaza rule ekleniyor? bunu alir.
            const device_id = req.body.device_id
            const data_source = req.body.data_source
            const tracking_data = req.body.tracking_data
            const check_interval = req.body.check_interval
            const action = req.body.action

            const ruleResponse = await RulesDAO.AddRule(
                device_id,
                data_source,
                tracking_data,
                check_interval,
                action
            )
            res.json({status: "new rule added successfully" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateRule(req, res, next) {
        try {
            const _id = req.body._id
            const data_source = req.body.data_source
            const tracking_data = req.body.tracking_data
            const info = req.body.info

            const ruleResponse = await RulesDAO.updateRule(
                _id,
                data_source,
                tracking_data,
                info,
            )
            var { error } = ruleResponse

            if (error) {
                res.status(400).json({ error })
            }

            res.json({ status: "rule updated successfully" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteRule(req, res, next) {
        try {
            const rule_id = req.query.rule_id
            console.log(rule_id)
            const ruleResponse = await RulesDAO.deleteRule(
                rule_id,
            )
            
            var { error } = ruleResponse
            
            if (error) {
                res.status(400).json({ error })
            }
            res.json({ status: "rule deleted successfully" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}