require('dotenv').config();

const Car = require('../models/car');
const Reservation = require('../models/reservation');

const AWS = require('aws-sdk');
const async = require('async');

const office_info = require('../public/db/office.json');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_accessKeyId,
    secretAccessKey: process.env.AWS_secretAccessKey,
    region: 'us-west-1'
});

var style = ['All', 'Small', 'SUV', 'Luxury', 'Truck'];

exports.search_menu_get = function(req, res, next) {
    
    Car.updateMany({available_date: {$lt: new Date()}}, {$set: {status: 'Available'}}, 
    function(err) {

        if(!err)
        res.render('search', {title: 'SEARCH CAR', style_list: style});
});
}

exports.search_post =  [

    (req, res, next) => {
    
    let reserv = new Reservation(
        {
            start_date: req.body.dateFrom,
            end_date: req.body.dateTo,
            customer: null,
            car: null,
            reservation_no: null,
        }
    )
    
    let errors = [
        {msg: '',
        param: 'dateFrom'},
        {msg: '',
        param: 'dateTo'},
        {msg: '',
        param: 'location'},
        {msg: false,
        param: 'check'},
    ];
    
    if(req.body.dateFrom > req.body.dateTo) {
        console.log("first check");
        errors[0].msg = 'Start date should be prior to End date';
        errors[3].msg = true;
    }

    if(req.body.dateFrom == '') {
        errors[0].msg = "Date should be specified";
        errors[3].msg = true;
    }    
    
    if(req.body.dateTo == '') {
        errors[1].msg = "Date should be specified";
        errors[3].msg = true;
    }
    
    let checkOffice = false;

    office_info.forEach((office) => {
        
        console.log(office.address);
        console.log(req.body.location);

        if(office.address == req.body.location) {
            checkOffice = true;
            return;
        }
    });
    
    if(checkOffice == false) {
        errors[2].msg = "It is not our office address. please find again."
        errors[3].msg = true;
    }

    if(errors[3].msg  == true)
    {
        console.log("final check");
        let res_info = {
            start: req.body.dateFrom,
            end: req.body.dateTo,
            location: req.body.location,
            style: req.body.style
        };

        res.render('search', {title: 'SEARCH CAR', res_info: res_info, style_list: style, errors: errors});
        return;
    }     
    
    if(req.body.style == "All")
    {

    async.parallel({
        
        cars: function(callback) {
                Car.find({status:'Available'})
             .where('available_date')
             .gte(reserv.start_date)
             .lt(reserv.end_date)
             
             .exec(callback);
             
            },
        }, function(err, results) {
            if(err) {return next(err);}
            if(results==null) {
                var err = new Error('Car not found');
                err.status = 404;
                return next(err);
            }
            
            res.render('car_list', {title: 'AVAILABLE LIST', data_list: JSON.stringify(results.cars)});
            
        });
    }

    else {

        async.parallel({
        
            cars: function(callback) {
                    Car.find({status:'Available', style: req.body.style})
                 .where('available_date')
                 .gte(reserv.start_date)
                 .lt(reserv.end_date)
                 
                 .exec(callback);
                 
                },
            }, function(err, results) {
                if(err) {return next(err);}
                if(results==null) {
                    var err = new Error('Car not found');
                    err.status = 404;
                    return next(err);
                }
                
                res.render('car_list', {title: 'AVAILABLE LIST', data_list: JSON.stringify(results.cars)});
                
            });
    
    }

}
]

exports.data_list = function(req, res, next) {

    var list = JSON.parse(req.query.data_list);

    if(req.query.flag == 'all') {
        
        res.render('datatable', {reservFlag: "yes", data_list: list});
    }

    else if(req.query.flag == 'year') {

        function compare(a, b) {
            let comparison  = 0;
            if (a.product_year > b.product_year) {
                comparison = 1;
            }
            else if (a.product_year < b.product_year) {
                comparison = -1;
            }
            return comparison;
        }

        let sortList = list.sort(compare);
        res.render('datatable', {reservFlag: "yes", data_list: sortList});

    }

    else if(req.query.flag == 'price') {
        
        function compare(a, b) {
            let comparison  = 0;
            if (a.price > b.price) {
                comparison = 1;
            }
            else if (a.price < b.price) {
                comparison = -1;
            }
            return comparison;
        }

        let sortList = list.sort(compare);
        res.render('datatable', {reservFlag: "yes", data_list: sortList});

    }

    else if(req.query.flag == 'suv') {

        let newList = [];
        
        for(var i=0; i<list.length; i++)
        {
            if(list[i].style == "SUV")
            {
                newList.push(list[i]);
            }
        }
        
        res.render('datatable', {reservFlag: "yes", data_list: newList});

    }

    else if(req.query.flag == 'small') {

        let newList = [];
        
        for(var i=0; i<list.length; i++)
        {
            if(list[i].style == "Small")
            {
                newList.push(list[i]);
            }
        }
        
        res.render('datatable', {reservFlag: "yes", data_list: newList});

    }

    else if(req.query.flag == 'truck') {

        let newList = [];
        
        for(var i=0; i<list.length; i++)
        {
            if(list[i].style == "Truck")
            {
                newList.push(list[i]);
            }
        }
        
        res.render('datatable', {reservFlag: "yes", data_list: newList});

    }

    else if(req.query.flag == 'luxury') {

        let newList = [];
        
        for(var i=0; i<list.length; i++)
        {
            if(list[i].style == "Luxury")
            {
                newList.push(list[i]);
            }
        }
        
        res.render('datatable', {reservFlag: "yes", data_list: newList});

    }
}