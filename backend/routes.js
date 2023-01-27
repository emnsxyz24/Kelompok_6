const express = require('express');
const router = express.Router();
const { DataToko } = require('./model');

// data_toko routes
// Get all data from data_toko collection
router.get('/data_toko', (req, res) => {
    DataToko.find({}, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// Get data toko by idToko from data_toko collection
router.get('/data_toko/:idToko', (req, res) => {
    DataToko.findOne({ _id: req.params.idToko }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// Post all data to data_toko collection
router.post('/data_toko', (req, res) => {
    const newDataToko = new DataToko(req.body);
    newDataToko.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send('Data added to data_toko collection');
        }
    });
});

// Delete all data from data_toko collection
router.delete('/data_toko', (req, res) => {
    DataToko.deleteMany({}, (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send('Data deleted from data_toko collection');
        }
    });
});

// Delete store from data_toko collection
router.delete('/data_toko/:idToko', (req, res) => {
    DataToko.deleteOne({ _id: req.params.idToko }, (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send('Toko deleted from data_toko collection');
        }
    });
});

// Delete 1 item in the store from data_toko collection
// $pull operator is used to remove all array elements that match a specified condition
router.delete('/data_toko/:idToko/:idItem', (req, res) => {
    DataToko.updateOne({ _id: req.params.idToko }, { $pull: { barang: { _id: req.params.idItem } } }, (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send('Item deleted from data_toko collection');
        }
    });
});

// Put/Edit toko data from data_toko collection
router.patch('/data_toko/:idToko', (req, res) => {
    var update = {};
    for (var key in req.body) {
        update[key] = req.body[key];
    }
    DataToko.findOneAndUpdate({ _id: req.params.idToko }, { $set: update }, { $unset: update }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(data);
        }
    });
});

// Put/Edit item data in the store from data_toko collection
router.patch('/data_toko/:idToko/:idItem', (req, res) => {
    var update = {};
    for (var key in req.body) {
        update["barang.$." + key] = req.body[key];
    }
    DataToko.findOneAndUpdate({ _id: req.params.idToko, "barang._id": req.params.idItem }, { $set: update }, { $unset: update }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send('Item data updated in data_toko collection');
        }
    });
});

module.exports = router;
