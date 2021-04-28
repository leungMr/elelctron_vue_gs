let mongoose = require('mongoose')
let Schema = mongoose.Schema
const userSchema = new Schema({
  userId: String,
  username: String
});
const userToDevSchema = new Schema({
  deviceId: String,
  user: [userSchema]
});
let jsonFileToTrainSchema = new Schema({
  // email:{
  //   type:String,
  //   required:true,
  //   unique:true
  // },
  beginTime: String,
  endTime: String,
  examDesignId: String,
  toputoNodes: String,
  // communications:userToDevSchema
  // communications:Array
  communications: [
    {
      deviceId: String,
      user: {
        userhahah: {
          type: String,
        },
        username: String
      }
    }
  ]
})
module.exports = mongoose.model('jsonFileToTrain', jsonFileToTrainSchema, 'jsonFileToTrain')

