let mongoose = require('mongoose')
let Schema = mongoose.Schema
let trainListModalSchema = new Schema({
  beginTime: String,
  endTime: String,
  examDesignId: String,
  toputoNodes: String,
  examState: String,
  communications: Array,
  trainingDesignRelevanceList: Array,
  trainingPlanEntity:Array
})
module.exports = mongoose.model('trainListModal', trainListModalSchema, 'trainList')

