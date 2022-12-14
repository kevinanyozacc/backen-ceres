const Router = require('express'),
  organic_certifier = require('../controllers/organic_certifier'),
  cors   = require("cors"),
  router = Router();

//enable cors
router.use(cors({
	origin: process.env.ORIGIN
}));
//banner disabled
router.disable('x-powered-by');

router.get('/:id', organic_certifier.getByID);

module.exports = router;
