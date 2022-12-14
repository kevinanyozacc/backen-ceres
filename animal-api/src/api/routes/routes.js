const Router = require('express'),
	  animal = require('../controllers/animal'),
      cors   = require("cors"),
	  router = Router();

//enable cors
router.use(cors({
	origin: process.env.ORIGIN
}));
//banner disabled
router.disable('x-powered-by');

router.get('/events/:id', animal.getEventsByID);
router.post('/events', animal.saveEvent);
router.get('/earring/:id', animal.getByEarringID);
router.get('/farm/:id', animal.getByFarmID);
router.get('/:id', animal.getByID);

module.exports = router;
