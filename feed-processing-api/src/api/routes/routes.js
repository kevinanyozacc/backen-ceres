const Router = require('express'),
	  solsanitario = require('../controllers/solsanitario'),
      cors   = require("cors"),
	  router = Router();

//enable cors
router.use(cors({
	origin: process.env.ORIGIN
}));
//banner disabled
router.disable('x-powered-by');

router.get('/:id', solsanitario.getByID);

module.exports = router;
