const spawn = require("child_process").spawn
let mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const DB_NAME = 'gs_db'
const DB_URL = 'localhost:27017'
let cmdPath = process.cwd() + "\\static\\mongodb"

// 开启数据库服务
function startMongodbService() {
  return new Promise((resolve, reject) => {
    let spawnObj = spawn('.\\bin\\mongod.exe', ['--dbpath', '.\\data'], {cwd: cmdPath})
    spawnObj.stdout.on('data', function (chunk) {
      resolve({
        status: 1,
        data: chunk.toString()
      })
    });
    // 失败
    spawnObj.stderr.on('data', (chunk) => {
      resolve({
        status: 0,
        data: chunk.toString()
      })
    });
    // 子进程关闭
    spawnObj.on('close', function (chunk) {
      resolve(chunk.toString())
    })
    global.startMongodbPid = spawnObj.pid
  })
}


// 创建数据库连接
let times = 0
let connectMongodb = () => {
  mongoose.connect(`mongodb://${DB_URL}/${DB_NAME}`, err => {
    if (!err) {
      console.log(`位于${DB_URL}上的${DB_NAME}数据库连接成功`)
    } else {
      console.log("数据库连接失败")
      times++
      console.log(times)
      if (times > 3) return
      connectMongodb()
    }
  })
}
module.exports = async () => {
  await startMongodbService()
  connectMongodb()
}


