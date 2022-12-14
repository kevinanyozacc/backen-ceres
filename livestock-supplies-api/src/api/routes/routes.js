const Router = require('express'),
	  vetco = require('../controllers/vetco'),
      cors   = require("cors"),
	  router = Router();

//enable cors
router.use(cors({
	origin: process.env.ORIGIN
}));
//banner disabled
router.disable('x-powered-by');

router.get('/:id', vetco.getByID);

module.exports = router;
