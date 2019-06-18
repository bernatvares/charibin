'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  departure: { type: String },
  destination: { type: String },
  fake: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  price: Number,
  discount: Number,
  duration: Number,
  deselectionPrice: Number,
  timeSelection: { 
    defaultPrice: Number,
    time1: Number,
    time2: Number,
    time3: Number,
    time4: Number,
    time5: Number,
    time6: Number,
    time7: Number,
    time8: Number,
    time9: Number,
    time10: Number
  },
  scheduledTrips: { type: Schema.Types, ref: 'ScheduledTrip' },
  carrier: { type: String },
  type: { type: String },
  deleted: { type: Boolean, default: false },
  tickets: { type: [Schema.Types.ObjectId], ref: 'Ticket' },
  createdAt: { type: Date, default: Date.now },
  isFromAPI: { type: Boolean, default: true }
});

module.exports = mongoose.model('Trip', tripSchema);
