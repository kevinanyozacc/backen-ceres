const Router = require('express'),
	  search = require('../controllers/search'),
      cors   = require("cors"),
	  router = Router();

//enable cors
router.use(cors({
	origin: process.env.ORIGIN
}));
//banner disabled
router.disable('x-powered-by');

router.get('/stats', search.getStats);
router.get('/company', search.getCompany);
router.get('/farm', search.getFarm);
router.get('/animal/predio-padron', search.getAnimalFromPredioPadron);
router.get('/animal/san-indet-animal-detalle', search.getAnimalFromSanIndetAnimalDetalle);

module.exports = router;
