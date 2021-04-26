const dataUrl = "10.10.0.147:10103"
const fileUrl = "10.10.0.147:10280"

const maps = "10.10.0.147:8000"
const mqttIp = '10.10.0.147'
const mqttPort = 8083
const pcmWebsocket = '10.10.0.147:10104'

// ====== 只需修改上面
const config = {
  url: {
    MQTT_IP: mqttIp,
    MQTT_PORT: mqttPort,
    // 数据接口
    VUE_APP_GRAPHQL_HTTP_LINK: 'http://' + dataUrl + '/graphql',
    VUE_APP_GRAPHQL_WS_LINK: 'ws://' + dataUrl + '/subscriptions',
    // 数据复盘用
    websocket: 'ws://' + dataUrl + '/websocket/',
    // 音频用
    websocket2: 'ws://' + pcmWebsocket + '/websocketIotServer/',
    // 文件用
    // 版本====1S
    // upFileUrl: 'http://' + fileUrl + '/api/file/upload',
    // fileUrl: 'http://' + fileUrl + '/api/file/getFile/',
    // mapUrl:'http://' + maps + '/api/file/getFile/',
    // fileList: 'http://' + fileUrl + '/api/file/fileList',
    // delFile: 'http://' + fileUrl + '/api/file/delFile',
    // createFolder: 'http://' + fileUrl + '/api/file/createFolder',
    // 版本====1E
    // 版本====2S(老版本文件服务器)
    upFileUrl: 'http://' + fileUrl + '/upload',
    fileUrl: 'http://' + fileUrl + '/getFile/',
    fileList: 'http://' + fileUrl + '/fileList',
    delFile: 'http://' + fileUrl + '/delFile',
    createFolder: 'http://' + fileUrl + '/createFolder',
    // map不太一样
    mapUrl:'http://' + maps + '/api/file/getFile/',
    // 版本====2E
    // 地图
    map: {
      lon: "106.379390",
      lat: "29.534726",
      height: "13000",
      topographicMap: `http://${maps}/api/map/tile?source=openstreatmap_transport&x={x}&y={y}&z={z}`,
      contourMap: `http://${maps}/api/map/tile?source=striograph&x={x}&y={y}&z={z}`,
      elevationMaps: `http://${maps}/api/map/dem`,
    },
  },
  common: {
    pageNum: ['5', '10', '20', '50', '100'],
    messageMaxCount: 3,
    headers: {
      headers: {'Content-Type': 'multipart/form-data'}
    }
  },
};
