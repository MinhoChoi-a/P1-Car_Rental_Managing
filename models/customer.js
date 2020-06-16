var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CustomerSchema = new Schema(
  {
    name: {type: String, required: true},
    birth_date: {type: Date, required: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true},
  }
);

// Virtual for book's URL
CustomerSchema
.virtual('url')
.get(function () {
  return '/catalog/customer/' + this._id;
});

CarSchema
.virtual('birth_date_age')
.get(function (){
    var birth_year = moment(this.birth_date).format('YYYY');
    var today_year = moment(Date.now()).format('YYYY');
  
    return (today_year - birth_year);
});

//Export model
module.exports = mongoose.model('Customer', CarSchema);