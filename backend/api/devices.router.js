import express from 'express'

import DevicesCtrl from './devices.controller.js'
import RulesCtrl from './rules.controller.js'


const router = express.Router();

// buraya mongo'daki kayitli tum cihazlari getirecegiz.
/*router.get('/', (req, res) => {
    const str = [{
        "name": "MMEY",
        "msg": "FirstReact",
        "username": "wenes"
    }];
    res.end(JSON.stringify(str));
});
*/

// buraya mongo'daki kayitli tum cihazlari getirecegiz.
router.route('/').get(DevicesCtrl.apiGetDevices)
router.route("/id/:id").get(DevicesCtrl.apiGetDeviceById)

// -------RULE CRUD-------
router.route('/newrule').post(RulesCtrl.apiPostRule)
router.route('/updaterule').put(RulesCtrl.apiUpdateRule)
router.route('/deleterule').delete(RulesCtrl.apiDeleteRule)
// -------RULE CRUD-------


// -------CIHAZ CRUD-------
// yeni cihaz eklemek icin POST req. frontend modal olabilir.
// name, device_id, project_access_id, project_secret alir.
router.route('/newdevice').post(DevicesCtrl.apiPostDevice)

// cihazi guncellemek icin PUT req. modal icerisinde cagirilabilir.
router.route('/updatedevice').put(DevicesCtrl.apiUpdateDevice)

// cihazi silmek icin DEL req. modal icerisine
router.route('/deletedevice').delete(DevicesCtrl.apiDeleteDevice)
// -------CIHAZ CRUD-------


// -------CIHAZ KONTROL-------
// cihazin su anki durumunu (on/off) gormek icin.
// cardview icinde cihaz su anda online vs. gosterebiliriz.
router.route('/devicestatus').post(DevicesCtrl.apiGetDeviceStatus)

// cihaz kontrol. send_commands
router.route('/sendcommand').post(DevicesCtrl.apiSendCommandToDevice)

// cihazi 'on' duruma getirmek icin.
router.route('/turnondevice').get(DevicesCtrl.apiTurnOnDevice)
//router.route('/turnondevice').get(new_deneme)

// cihazi 'off' duruma getirmek icin.
//router.route('/turnoffdevice').get(DevicesCtrl.apiTurnOffDevice)

// base url: http://localhost:4000/api/v1/devices --> deneme
router.route('/deneme').get((req, res) => res.send('hello there'))

// module.exports = router;

/*router.post('/addTweet', (req, res) => {
    res.end('NA');
});
*/

export default router;