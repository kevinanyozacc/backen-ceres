const Router = require('express'),
	  agricultural_exporter = require('../controllers/agricultural_exporter'),
	  origin_certificate = require('../controllers/origin_certificate'),
      cors   = require("cors"),
	  router = Router();

//enable cors
router.use(cors({
	origin: process.env.ORIGIN
}));
//banner disabled
router.disable('x-powered-by');

router.get('/certificates/farm/:id', agricultural_exporter.getCertificateByFarmID);
router.get('/certificates/export-processing-plant/:id', agricultural_exporter.getCertificatesByPlantID);
router.get('/certificates/agricultural-exporter/:id', agricultural_exporter.getCertificateByID);
router.get('/origin-certificates/:id', origin_certificate.getByFarmID);
router.get('/:id', agricultural_exporter.getByID);

module.exports = router;
