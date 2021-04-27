let markingTable = [
  {title: '考核训练名称', dataIndex: 'trainingTitleName', align: 'center'},
  {title: '开始时间', dataIndex: 'beginTime', align: 'center', scopedSlots: {customRender: 'beginTime'}},
  {title: '考核训练时长', dataIndex: 'timeList', align: 'center', scopedSlots: {customRender: 'trainingTime'}},
  // {title: '依照规划', dataIndex: 'trainingPlanEntity', align: 'center', scopedSlots: {customRender: 'design'}},
  // {title: '监考人', dataIndex: 'supervisorsEntity', align: 'center', scopedSlots: {customRender: 'invigilator'}},
  {title: '操作', scopedSlots: {customRender: 'tags'}, align: 'center', key: 'tags'},
]

export {markingTable}