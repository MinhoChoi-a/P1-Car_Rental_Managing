var Car = require('../models/car');

const AWS = require('aws-sdk');
var async = require('async');

const s3 = new AWS.S3({
    accessKeyId: "AKIA5DWR6HFBO4UKBPE3",
    secretAccessKey: "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",
    region: 'us-west-1'
});

const validator = require('express-validator');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

exports.car_detail = function(req, res, next) {

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
            
        var params = {"Bucket": 'test-s3-may', 
        "Key": results.car.image_id};

        s3.getObject(params, function(err, file) {
            if(!err) {
            
            console.log(file.Body);
            let url = "data:image/jpeg;base64,"+ encode(file.Body)
            res.render('car_detail', {title: "INFORMATION", cars: results.car, link:url});
            }
        });
    });
};

function encode(data) {
    var res = (Buffer.from(data).toString('base64'));
    return res;
}


exports.car_register_get = function(req, res, next) {

    var style = ['Small', 'SUV', 'Luxury', 'Truck'];
    var status = ['Available', 'Lease', 'Maintanence'];

    var startYear = 2000;
    var yearList = [];

    for(var i = new Date().getFullYear(); i > startYear; i--)
    {
        yearList.push(i);
    }

    res.render('car_form', {title: 'REGISTER CAR', style_list: style, status_list: status, years: yearList});
};

exports.car_register_post = [
        
        body('name').isLength({min:1}).trim().withMessage('Name must be specified.'),
        body('price').isNumeric({ min: 0.00, max: 1000.00 }).withMessage('Price must be correct.'),
        body('location').isLength({min:1}).trim().withMessage('Location must be specified.'),
        //body('price').matches(/^(?=.*\d)[0-9]$/, "i").withMessage('Price must be correct.'),

        sanitizeBody('name').escape(),
        sanitizeBody('price').escape(),
        sanitizeBody('location').escape(),
        sanitizeBody('dateA').toDate(),
        
        (req, res, next) => {
            
            const errors = validationResult(req);
            
            console.log(req.file.mimetype);
            console.log(req.body);

            if(req.file === undefined)
            {
                console.log(req.body);
                
                var uploadError = "File must be uploaded";
                
                var car = new Car(
                    { name: req.body.name,
                      product_year: req.body.year,
                      style: req.body.style,
                      price: req.body.price,
                      image_id: null,
                      location: req.body.location,
                      status: req.body.status,
                      available_date: req.body.dateA
                     });
                
                var style = ['Small', 'SUV', 'Luxury', 'Truck'];
                var status = ['Available', 'Lease', 'Maintanence'];
                var startYear = 2000;
                var yearList = [];
                
                for(var i = new Date().getFullYear(); i > startYear; i--)
                {
                    yearList.push(i);
                }
                
                res.render('car_form', {title: 'REGISTER CAR', car_info:car, style_list: style, status_list: status, years: yearList, errors: errors.array(), uploadError:uploadError});
                   return;
            }
            
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
            
            var car = new Car(
                { name: req.body.name,
                  product_year: req.body.year,
                  style: req.body.style,
                  price: req.body.price,
                  image_id: fileName,
                  location: req.body.location,
                  status: req.body.status,
                  available_date: req.body.dateA
                 });
            
            var style = ['Small', 'SUV', 'Luxury', 'Truck'];
            var status = ['Available', 'Lease', 'Maintanence'];
            var startYear = 2000;
            var yearList = [];
                        
            for(var i = new Date().getFullYear(); i > startYear; i--)
            {
                yearList.push(i);
            }

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
        }
    ];

exports.car_update_get = function(req, res, next) {
    
        var style = ['Small', 'SUV', 'Luxury', 'Truck'];
        var status = ['Available', 'Lease', 'Maintanence'];

        var startYear = 2000;
        var yearList = [];

        for(var i = new Date().getFullYear(); i > startYear; i--)
        {
        yearList.push(i);
        }
        

    async.parallel({
        cars: function(callback) {
            Car.findById(req.params.id)
                .exec(callback)
        },

    }, function(err, results) {
        if(err) {return next(err);}
        if(results.cars==null) {
            var err = new Error('Car not found');
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

    sanitizeBody('name').escape(),
    sanitizeBody('price').escape(),
    sanitizeBody('location').escape(),
    sanitizeBody('dateA').toDate(),
    
    
    (req, res, next) => {
        
        const errors = validationResult(req);
        
        console.log(req.body);
        console.log(req.body.dateA);

        var style = ['Small', 'SUV', 'Luxury', 'Truck'];
        var status = ['Available', 'Lease', 'Maintanence'];
        var startYear = 2000;
        var yearList = [];

        for(var i = new Date().getFullYear(); i > startYear; i--)
        {
            yearList.push(i);
        }

        if(req.file !== undefined)
        {
            if(errors.isEmpty()) 
            {
                const file = req.file;
        
                const uniqueSuffix = Date.now();
                const fileName = file.fieldname + '-' + uniqueSuffix +'-' + file.originalname;
            
                const myFile = file.originalname.split(".");
                const fileType = myFile[myFile.length - 1];
            
                var params = {
                Bucket: "test-s3-may",
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read"
                };
                
                var car = new Car(
                    { name: req.body.name,
                      product_year: req.body.year,
                      style: req.body.style,
                      price: req.body.price,
                      image_id: fileName,
                      location: req.body.location,
                      status: req.body.status,
                      available_date: req.body.dateA,
                      _id: req.params.id
                     });

                async.parallel({
                    cars: function(callback) {
                        Car.findById(req.params.id)
                            .exec(callback)
                    },
                }, async (err, results) => {
                    if(err) {return next(err);}
                    else {
                        var paramsDel = {"Bucket": 'test-s3-may', 
                                "Key": results.cars.image_id};
                        
                        var updated_car = await Car.findByIdAndUpdate(req.params.id, car, {});

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
                var car = new Car(
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
                        var car = new Car(
                            { name: req.body.name,
                            product_year: req.body.year,
                            style: req.body.style,
                            price: req.body.price,
                            image_id: results.cars.image_id,
                            location: req.body.location,
                            status: req.body.status,
                            available_date: req.body.dateA,
                            _id: req.params.id
                            });
    
                        var updated_car = await Car.findByIdAndUpdate(req.params.id, car, {});
                        res.redirect(updated_car.url);
                    } catch (error) {
                        return console.error(error);
                    } 
                   
                    })
                }
            
            else
            {
                var car = new Car(
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
            
        var params = {"Bucket": 'test-s3-may', 
        "Key": results.car.image_id};

        s3.deleteObject(params, function(err, file) {
            if(!err) {
            Car.findByIdAndRemove(req.params.id, function deleteCar(err){
                if(err) {return next(err);}
                    res.redirect('/main/car/register'); 
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
