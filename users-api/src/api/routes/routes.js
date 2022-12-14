const Router = require('express'),
	  users  = require('../controllers/users'),
      cors   = require("cors"),
	  router = Router();

//enable cors
router.use(cors({
	origin: process.env.ORIGIN
}));
//banner disabled
router.disable('x-powered-by');

router.get('/', users.get);
router.get('/traceability/', users.getUsersTraceability);
router.get('/auth', users.auth);
router.get('/:id', users.getByID);
router.get('/:id/status', users.getStatus);
router.patch('/:id', users.updateByID);
router.post('/', users.create);

module.exports = router;
