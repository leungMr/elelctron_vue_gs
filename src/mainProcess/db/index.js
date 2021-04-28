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
      // console.log(chunk.toString());
      // console.log("数据库服务开启成功")
      resolve(chunk.toString())
    });
    // 失败
    spawnObj.stderr.on('data', (data) => {
      console.log("失败二零")
      console.log(data.toString());
    });
    // 子进程关闭
    spawnObj.on('close', function (code) {
      console.log("在这里执行；额")
      resolve(code.toString())
    })



    global.startMongodbPid = spawnObj.pid

  })
}


//构建一个Promise实例，用于管理数据库连接
module.exports = new Promise(async (resolve, reject) => {
  //2.连接数据库
  await startMongodbService()
  mongoose.connect(`mongodb://${DB_URL}/${DB_NAME}`, {useNewUrlParser: true})

  //3.监听连接状态
  mongoose.connection.on('open', (err) => {
    if (!err) {
      console.log(`位于${DB_URL}上的${DB_NAME}数据库连接成功`)
      resolve()
    } else {
      reject(err)
      console.log(cmdPath)
    }
  })
})
