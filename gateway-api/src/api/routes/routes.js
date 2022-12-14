const Router                = require('express'),
      users                 = require('../controllers/users'),
      search                = require('../controllers/search'),
      livestock_supplies    = require('../controllers/livestock_supplies'),
      poultry_farm          = require('../controllers/poultry_farm'),
      slaughterhouse        = require('../controllers/slaughterhouse'),
      feed_processing       = require('../controllers/feed_processing'),
      agricultural_supplies = require('../controllers/agricultural_supplies'),
      organic_certifier      = require('../controllers/organic_certifier'),
      primary_processing    = require('../controllers/primary_processing'),
      agricultural_exporter = require('../controllers/agricultural_exporter'),
      livestock_exporter = require('../controllers/livestock_exporter'),
      export_processing_plant = require('../controllers/export_processing_plant'),
      farm                  = require('../controllers/farm'),
      animal                = require('../controllers/animal'),
      cors                  = require('cors'),
      auth                  = require('../middlewares/auth'),
      router                = Router(),
      protected             = Router(),
      semiprotected         = Router();

//enable cors
router.use(cors({
    origin: process.env.ORIGIN
}));

//protected routes
protected.use(auth.protected);
semiprotected.use(auth.semiprotected);

//banner disabled
router.disable('x-powered-by');

//Users
router.post('/login', users.login);
router.patch('/user/grant', protected, users.grantAdmin);
router.get('/user/:user', protected, users.get);
router.get('/user/registered/newly/', protected, users.getNewlyRegistered);
router.post('/signup/public', users.signup_noauth);
router.post('/signup/admin', protected, users.signup_auth);
router.get('/whoami', protected, users.whoami);
//Search
router.get('/search/stats', semiprotected, search.getStats);
router.get('/search/company', semiprotected, search.getCompany);
router.get('/search/animal', semiprotected, search.getAnimal);
router.get('/search/farm', semiprotected, search.getFarm);
//Livestock Supplies
router.get('/livestock-supplies/:id', semiprotected, livestock_supplies.get);
//Pig Farm
router.get('/poultry-farm/:id', semiprotected, poultry_farm.get);
//Slaughterhouse
router.get('/slaughterhouse/auth/:id', semiprotected, slaughterhouse.getAuth);
router.get('/slaughterhouse/csti/:id', semiprotected, slaughterhouse.getCSTI);
router.get('/slaughterhouse/:id', semiprotected, slaughterhouse.get);
//Feed Processing
router.get('/feed-processing/:id', semiprotected, feed_processing.get);
//Agricultural Supplies
router.get('/agricultural-supplies/:id', semiprotected, agricultural_supplies.get);
//OCPO register
router.get('/organic-certifier/:id', semiprotected, organic_certifier.get);
//primary processing
router.get('/primary-processing/:id', semiprotected, primary_processing.get);
//agricultural_exporter
router.get('/agricultural-exporter/certificates/farm/:id', semiprotected, agricultural_exporter.getCertificatesByFarmID);
router.get('/agricultural-exporter/certificates/export-processing-plant/:id', semiprotected, agricultural_exporter.getCertificatesByPlantID);
router.get('/agricultural-exporter/certificates/agricultural-exporter/:id', semiprotected, agricultural_exporter.getCertificates);
router.get('/agricultural-exporter/origin-certificates/:id', semiprotected, agricultural_exporter.getOriginCertificates);
router.get('/agricultural-exporter/:id', semiprotected, agricultural_exporter.get);
//livestock_exporter
router.get('/livestock-exporter/:id', semiprotected, livestock_exporter.get);
//export_processing_plant
router.get('/export-processing-plant/:id', semiprotected, export_processing_plant.get);
//Estate integrator
router.get('/farm/ecas/:id', semiprotected, farm.getECAS);
router.get('/farm/:id', semiprotected, farm.get);
// Animal
router.get('/animal/events/:id', semiprotected, animal.getEvents);
router.get('/animal/farm/:id', semiprotected, animal.getByFarmID);
router.get('/animal/earring/:id', semiprotected, animal.getAnimalByEarring);
router.post('/animal/events', semiprotected, animal.saveEvent);
router.get('/animal/:id', semiprotected, animal.get);
module.exports = router;
