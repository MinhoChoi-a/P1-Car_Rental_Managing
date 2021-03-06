require('dotenv').config();

const Car = require('../models/car');
const AWS = require('aws-sdk');

const async = require('async');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_accessKeyId,
    secretAccessKey: process.env.AWS_secretAccessKey,
    region: 'us-west-1'
});

const {body, validationResult} = require('express-validator');

let style = ['Small', 'SUV', 'Luxury', 'Truck'];
let status = ['Available', 'Lease', 'Maintanence'];
let startYear = 2000;
let yearList = [];

for(var i = new Date().getFullYear(); i > startYear; i--)
    {
        yearList.push(i);
    }


exports.car_detail = function(req, res, next) {

    async.parallel({
        car: function(callback) {
            Car.findById(req.params.id)
                .exec(callback)
        },

    }, function(err, results) {
        if(err) {return next(err);}
        if(results.car==null) {
            let err = new Error('Car not found');
            err.status = 404;
            return next(err);
        }
            
        var params = {"Bucket": 'test-s3-may', 
        "Key": results.car.image_id};

        s3.getObject(params, function(err, file) {
            if(!err) {
            let url = "data:image/jpeg;base64,"+ encode(file.Body)
            res.render('car_detail', {title: "INFORMATION", cars: results.car, link:url});
            }
            else {
                console.log(err.message);
            }
        });
    });
};

function encode(data) {
    var res = (Buffer.from(data).toString('base64'));
    return res;
}


exports.car_register_get = function(req, res, next) {

    res.render('car_form', {title: 'REGISTER CAR', style_list: style, status_list: status, years: yearList});
};

exports.car_register_post = [
        
        body('name').isLength({min:1}).trim().withMessage('Name must be specified'),
        body('price').isNumeric({ min: 0.00, max: 1000.00 }).withMessage('Price must be correct number'),
        //body('location').isLength({min:1}).trim().withMessage('Location must be specified'),
        
          (req, res, next) => {
            
            let errors = validationResult(req);
            let availableType = ["image/png", "image/jpg", "image/jpeg"];
            let limitSize = 5000000; //5MB
            
            for(var i = new Date().getFullYear(); i > startYear; i--)
            {
                yearList.push(i);
            }
            
            let car = new Car(
                { name: req.body.name,
                  product_year: req.body.year,
                  style: req.body.style,
                  price: req.body.price,
                  image_id: null,
                  location: req.body.location,
                  status: req.body.status,
                  available_date: req.body.dateA
                 });
            
            if(req.file === undefined)
            {
                let uploadError = "File must be uploaded";
            
                res.render('car_form', {title: 'REGISTER CAR', car_info:car, style_list: style, status_list: status, years: yearList, errors: errors.array(), uploadError:uploadError});
                return;
            }
            
            else if(!availableType.includes(req.file.mimetype) || req.file.size > limitSize)
            {
                var uploadError = "Check the file format / size";
                
                res.render('car_form', {title: 'REGISTER CAR', car_info:car, style_list: style, status_list: status, years: yearList, errors: errors.array(), uploadError:uploadError});
                return;
            }

            else 
            {
            const file = req.file;
            
            const uniqueSuffix = Date.now();
            const fileName = file.fieldname + '-' + uniqueSuffix +'-' + file.originalname;
            
            const myFile = file.originalname.split(".");
            //const fileType = myFile[myFile.length - 1];
            
            var params = {
                Bucket: "test-s3-may",
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read"
                };
            
            car.image_id = fileName;
      
                if(!errors.isEmpty()) 
                {
                res.render('car_form', {title: 'REGISTER CAR', car_info:car, style_list: style, status_list: status, years: yearList, errors: errors.array(), file:file});
                return;
                }     

                else 
                {
                    car.save(function (err) {
                    if(err) {return next(err);}
                    s3.upload(params, function(err, data) {
                        if(err) {return next(err);}
                        res.redirect(car.url); 
                        }
                        );
                    });  
                }
        }}
    ];


exports.car_update_get = function(req, res, next) {
    
    async.parallel({
        cars: function(callback) {
            Car.findById(req.params.id)
                .exec(callback)
        },

    }, function(err, results) {
        if(err) {return next(err);}
        if(results.cars==null) {
            let err = new Error('Car not found');
            err.status = 404;
            return next(err);
        }
        res.render('car_form', {title: 'UPDATE CAR', car_info:results.cars, years:yearList, style_list:style, status_list: status});
     
    });    
}


exports.car_update_post = [
        
    body('name').isLength({min:1}).trim().withMessage('Name must be specified.'),
    body('price').isNumeric({ min: 0.00, max: 1000.00 }).withMessage('Price must be correct.'),
    body('location').isLength({min:1}).trim().withMessage('Location must be specified.'),
    //body('price').matches(/^(?=.*\d)[0-9]$/, "i").withMessage('Price must be correct.'),
    
    (req, res, next) => {
        
        let errors = validationResult(req);
        
        let car = new Car(
            { name: req.body.name,
              product_year: req.body.year,
              style: req.body.style,
              price: req.body.price,
              image_id: null,
              location: req.body.location,
              status: req.body.status,
              available_date: req.body.dateA,
              _id: req.params.id
             });

        if(req.file !== undefined)
        {
            if(errors.isEmpty()) 
            {
                let file = req.file;
        
                let uniqueSuffix = Date.now();
                let fileName = file.fieldname + '-' + uniqueSuffix +'-' + file.originalname;
            
                let myFile = file.originalname.split(".");
                let fileType = myFile[myFile.length - 1];
            
                var params = {
                Bucket: "test-s3-may",
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read"
                };
                
                car.image_id = fileName;
                    
                async.parallel({
                    cars: function(callback) {
                        Car.findById(req.params.id)
                            .exec(callback)
                    },
                }, async (err, results) => {
                    if(err) {return next(err);}
                    else {
                        let paramsDel = {"Bucket": 'test-s3-may', 
                                "Key": results.cars.image_id};
                        
                        let updated_car = await Car.findByIdAndUpdate(req.params.id, car, {});

                        s3.deleteObject(paramsDel, function(err, file) {
                            if(err) {return next(err)}
                            s3.upload(params, function(err, data) {
                                if(err) {return next(err)}
                                console.log("go to the next step");
                                res.redirect(updated_car.url);
                            })
                        });
                        
                    }
                });
            }
            
            else {
                
                res.render('car_form', {title: 'UPDATE CAR', car_info:car, style_list: style, status_list: status, years: yearList, errors: errors.array()});
                return;
            }
    }
    else
        {
            if(errors.isEmpty()) 
                {
                    async.parallel({
                    cars: function(callback) {
                        Car.findById(req.params.id)
                            .exec(callback)
                    },
                }, async (err, results) => {
                
                    try {
                        car.image_id = results.cars.image_id;
                        
                        let updated_car = await Car.findByIdAndUpdate(req.params.id, car, {});
                        res.redirect(updated_car.url);
                    } 
                    catch (error) {
                        return console.error(error);
                    } 
                   
                    })
                }
            
            else
            {
                res.render('car_form', {title: 'UPDATE CAR', car_info:car, style_list: style, status_list: status, years: yearList, errors: errors.array()});
                return;
            }     
        }
    }
];

exports.car_delete_post = function(req, res, next) {

    async.parallel({
        car: function(callback) {
            Car.findById(req.params.id)
                .exec(callback)
        },

    }, function(err, results) {
        if(err) {return next(err);}
        if(results.car==null) {
            var err = new Error('Car not found');
            err.status = 404;
            return next(err);
        }
            
        let params = {"Bucket": 'test-s3-may', 
        "Key": results.car.image_id};

        s3.deleteObject(params, function(err, file) {
            if(!err) {
            Car.findByIdAndRemove(req.params.id, function deleteCar(err){
                if(err) {return next(err);}
                    res.redirect('/car/register'); 
            });
            }
        });
    });
}

exports.full_list = function(req, res, next) {
    res.render('car_list', {title: "FULL LIST"});
}

exports.data_list = function(req, res, next) {

    if(req.query.flag == 'all') {
        async.parallel({
            cars: function(callback) {
                Car.find({}, callback);
                
            },
        
        }, function(err, results) {
            if(err) {return next(err);}
            if(results==null) {
                var err = new Error('Car not found');
                err.status = 404;
                return next(err);
            }
        
            res.render('datatable', {data_list: results.cars});
            return;
        });
    }

    else if(req.query.flag == 'year') {

        async.parallel({
            cars: function(callback) {
            Car.find({})
            .sort({product_year: 'ascending'})
            .exec(callback);
        
        },

        }, function(err, results) {
        if(err) {return next(err);}
        if(results==null) {
            var err = new Error('Car not found');
            err.status = 404;
            return next(err);
        }
        res.render('datatable', {data_list: results.cars});

    });
    }

    else if(req.query.flag == 'price') {

        async.parallel({
            cars: function(callback) {
            Car.find({})
            .sort({price: 'ascending'})
            .exec(callback);
        
        },

        }, function(err, results) {
        if(err) {return next(err);}
        if(results==null) {
            var err = new Error('Car not found');
            err.status = 404;
            return next(err);
        }
        res.render('datatable', {data_list: results.cars});

    });
    }

    else if(req.query.flag == 'suv') {

        async.parallel({
            cars: function(callback) {
            Car.find({style:'SUV'})
            .exec(callback);
        
        },

        }, function(err, results) {
        if(err) {return next(err);}
        if(results==null) {
            var err = new Error('Car not found');
            err.status = 404;
            return next(err);
        }
        res.render('datatable', {data_list: results.cars});

    });
    }

    else if(req.query.flag == 'small') {

        async.parallel({
            cars: function(callback) {
            Car.find({style:'Small'})
            .exec(callback);
        
        },

        }, function(err, results) {
        if(err) {return next(err);}
        if(results==null) {
            var err = new Error('Car not found');
            err.status = 404;
            return next(err);
        }
        res.render('datatable', {data_list: results.cars});

    });
    }

    else if(req.query.flag == 'luxury') {

        async.parallel({
            cars: function(callback) {
            Car.find({style:'Luxury'})
            .exec(callback);
        
        },

        }, function(err, results) {
        if(err) {return next(err);}
        if(results==null) {
            var err = new Error('Car not found');
            err.status = 404;
            return next(err);
        }
        res.render('datatable', {data_list: results.cars});

    });
    }

    else if(req.query.flag == 'truck') {

        async.parallel({
            cars: function(callback) {
            Car.find({style:'Truck'})
            .exec(callback);
        
        },

        }, function(err, results) {
        if(err) {return next(err);}
        if(results==null) {
            var err = new Error('Car not found');
            err.status = 404;
            return next(err);
        }
        res.render('datatable', {data_list: results.cars});

    });
    }

}
