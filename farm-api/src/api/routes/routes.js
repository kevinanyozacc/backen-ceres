const Router = require('express'),
	farm = require('../controllers/farm'),
	ecas = require('../controllers/ecas'),
      cors   = require("cors"),
	  router = Router();

//enable cors
router.use(cors({
	origin: process.env.ORIGIN
}));
//banner disabled
router.disable('x-powered-by');

router.get('/ecas/:id', ecas.getByFarmID);
router.get('/:id', farm.getByID);

module.exports = router;
