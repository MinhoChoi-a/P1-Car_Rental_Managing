var express = require('express');
var router = express.Router();
const multer = require("multer");

var search_controller = require('../controllers/SearchController');
var car_controller = require('../controllers/CarController');

var storage = multer.memoryStorage({
    destination: function (req, file, cb) {
      cb(null, '')
    },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(file.mimetype="err", true); // if validation failed then generate error
  }
};

var upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter
});




/* GET users listing. */
router.get('/search', search_controller.search_menu_get);

router.post('/search/list', search_controller.search_post);

router.get('/search/list/partial', search_controller.data_list);

router.get('/car/list', car_controller.full_list);

router.get('/car/list/partial', car_controller.data_list);

router.get('/car/register',  car_controller.car_register_get);

router.post('/car/register', upload.single('image_file'), car_controller.car_register_post);

router.get('/car/:id', car_controller.car_detail);

router.get('/car/:id/update', car_controller.car_update_get);

router.post('/car/:id/update', upload.single('image_file'), car_controller.car_update_post);

router.get('/car/:id/delete', car_controller.car_delete_post);



module.exports = router;
