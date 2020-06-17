const mongoose = require('mongoose');
const moment =require('moment');

const Schema = mongoose.Schema;

var CarSchema = new Schema(
  {
    name: {type: String, required: true},
    product_year: {type: Number, required: true},
    style: {type: String, required: true, enum:['Small', 'SUV', 'Luxury', 'Truck'], default: 'Small'},
    price: {type: Number, required: true},
    image_id: {type: String, required: true},
    location: {type: String, required: true},
    status: {type: String, required: true, enum:['Available', 'Lease', 'Maintanence'], default: 'Available'},
    available_date: {type: Date},
    }
);

// Virtual for book's URL
CarSchema
.virtual('url')
.get(function () {
  return '/car/' + this._id;
});

CarSchema
.virtual('product_year_formatted')
.get(function (){
  return moment(this.product_year).format('YYYY');
});

CarSchema
.virtual('available_date_formatted')
.get(function (){
  return this.available_date? moment(this.available_date).format('YYYY-MM-DD'): '';
});


//Export model
module.exports = mongoose.model('Car', CarSchema);