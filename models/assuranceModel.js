const mongoose = require("mongoose");

const alamatSchema = mongoose.Schema({
    jalan: {type: String, required: true},
    kelurahan: {type: String, required: true},
    kecamatan: {type: String, required: true},
    kota: {type: String, required: true},
    provinsi: {type: String, required: true}
});

const assuranceSchema = mongoose.Schema({
    alamat: alamatSchema, 
    nik: {
        type: Number,
        required: true
    },
    foto_ktp: {
        type: String,
        required: true
    }
});

const assuranceModel = mongoose.model('assurance', assuranceSchema);
module.exports = assuranceModel;
