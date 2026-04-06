const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');

const Url = require('../models/Url');


// 🔹 EXISTING CODE (keep this)
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = config.get('baseUrl');

  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base url');
  }

  const urlCode = shortid.generate();

  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });

      if (url) {
        return res.json(url);
      } else {
        const shortUrl = baseUrl + '/' + urlCode;

        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date()
        });

        await url.save();
        return res.json(url);
      }
    } catch (err) {
      res.status(500).json('Server error');
    }
  } else {
    res.status(401).json('Invalid long url');
  }
});


// 🔥 ADD THIS BELOW (analytics route)
router.get('/stats/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (!url) return res.status(404).json("Not found");

    res.json({
      longUrl: url.longUrl,
      shortUrl: url.shortUrl,
      clicks: url.clicks,
      createdAt: url.date,
      lastClicked: url.lastClicked
    });

  } catch (err) {
    res.status(500).json("Server error");
  }
});


module.exports = router;