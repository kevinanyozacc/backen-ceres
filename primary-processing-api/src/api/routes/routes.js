const Router = require('express'),
	  primary_processing = require('../controllers/primary_processing'),
      cors   = require("cors"),
	  router = Router();

//enable cors
router.use(cors({
	origin: process.env.ORIGIN
}));
//banner disabled
router.disable('x-powered-by');

router.get('/:id', primary_processing.getByID);

module.exports = router;
