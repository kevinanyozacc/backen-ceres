const Router = require('express'),
	  sanitario = require('../controllers/sanitario'),
      cors   = require("cors"),
	  router = Router();

//enable cors
router.use(cors({
	origin: process.env.ORIGIN
}));
//banner disabled
router.disable('x-powered-by');

router.get('/:id', sanitario.getByID);

module.exports = router;
