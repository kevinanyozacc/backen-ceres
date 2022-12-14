const Router = require('express'),
	  centrobenef = require('../controllers/centrobenef'),
      cors   = require("cors"),
	  router = Router();

//enable cors
router.use(cors({
	origin: process.env.ORIGIN
}));
//banner disabled
router.disable('x-powered-by');

router.get('/auth/:id', centrobenef.getAuthorizationByID);
router.get('/csti/:id', centrobenef.getCSTIByID);
router.get('/:id', centrobenef.getByID);

module.exports = router;