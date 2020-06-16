var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReservationSchema = new Schema(
  {
    start_date: {type: Date, required: true},
    end_date: {type: Date, required: true},
    customer: {type: Schema.Types.ObjectId, ref: 'Customer', required: true},
    car: {type: Schema.Types.ObjectId, ref: 'Car', required: true},
    reservation_no: {type: Number, required: true},
  }
);

// Virtual for book's URL
ReservationSchema
.virtual('url')
.get(function () {
  return '/catalog/reservation/' + this._id;
});

ReservationSchema
.virtual('reserve_hours')
.get(function (){
    var reserve_hours = (moment(this.end_date) - moment(this.start_date))/3600000;
    return (reserve_hours);
});

//Export model
module.exports = mongoose.model('Reservation', ReservationSchema);