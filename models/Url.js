const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  urlCode: String,
  clicks: {          // 👈 THIS MUST EXIST
    type: Number,
    default: 0
  },
  date: {
    type: String,
    default: Date.now
  }
});

module.exports = mongoose.model('Url', UrlSchema);