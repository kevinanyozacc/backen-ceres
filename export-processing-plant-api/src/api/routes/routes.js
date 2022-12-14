const Router = require('express'),
export_processing_plant = require('../controllers/export_processing_plant'),
      cors   = require("cors"),
	  router = Router();

//enable cors
router.use(cors({
	origin: process.env.ORIGIN
}));
//banner disabled
router.disable('x-powered-by');

router.get('/:id', export_processing_plant.getByID);

module.exports = router;
