const Router = require('express'),
	  registroempresa = require('../controllers/registroempresa'),
      cors   = require("cors"),
	  router = Router();

//enable cors
router.use(cors({
	origin: process.env.ORIGIN
}));
//banner disabled
router.disable('x-powered-by');

router.get('/:id', registroempresa.getByID);

module.exports = router;
