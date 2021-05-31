let mongoose = require('mongoose')
let Schema = mongoose.Schema
let examIdToMp3ModalSchema = new Schema({
  examDesignId: String,
  deviceArr: Array,
})
module.exports = mongoose.model('examIdToMp3Modal', examIdToMp3ModalSchema, 'examIdToWav')

