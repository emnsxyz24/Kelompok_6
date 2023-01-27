const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    jumlah: {
        type: Number,
        required: true
    },
    harga: {
        type: Number,
        required: true
    },
    diskon: {
        type: Number,
        required: true
    },
    gambar: {
        type: String,
        required: true
    },
    isCheck: {
        type: Boolean,
        required: true
    }
});

const TokoSchema = new mongoose.Schema({
    toko: {
        type: String,
        required: true
    },
    barang: [ItemSchema],
    isCheck: {
        type: Boolean,
        required: true
    }
});

const DataToko = mongoose.model('data_toko', TokoSchema);

// Export the models
module.exports = { DataToko };
