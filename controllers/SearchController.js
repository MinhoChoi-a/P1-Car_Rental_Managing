const Car = require('../models/car');
const Reservation = require('../models/reservation');

const AWS = require('aws-sdk');
const async = require('async');

const awsKey = require('../credential/AWS');

const s3 = new AWS.S3({
    accessKeyId: awsKey.access.accessKeyId,
    secretAccessKey: awsKey.access.secretAccessKey,
    region: 'us-west-1'
});

var style = ['All', 'Small', 'SUV', 'Luxury', 'Truck'];

exports.search_menu_get = function(req, res, next) {
    
    Car.updateMany({available_date: {$lt: new Date()}}, {$set: {status: 'Available'}}, 
    function(err, affected, resp) {
        res.render('search', {title: 'SEARCH CAR', style_list: style});
});
}

exports.search_post =  [

    /**
    body('location').escape(),
    body('style').escape(),
    body('dateFrom').toDate(),
    body('dateTo').toDate(),
     */
    
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