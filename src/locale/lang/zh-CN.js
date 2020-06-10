export default {
  test: '测试',
  logo: 'iNsights',
  language: '简体中文',
  common: {
    noResult: '没有结果',
    weekly: '每周',
    monthly: '每月',
    monday: '每周一',
    tuesday: '每周二',
    wednesday: '每周三',
    thursday: '每周四',
    friday: '每周五',
    saturday: '每周六',
    sunday: '每周天',
    enable: '启用',
    disabled: '停用',
    event: '活动',
    goal: '目标',
    standard: '标准',
    add: '新增',
    remove: '移除',
    total: '共',
    days: '天',
    exclude: '排除',
    to: '至',
    manual: '手动',
    daily: '每日',
    time: '时间',
    timeZone: '时区',
    overseas: '海外',
    china: '国内',
    save: '保存',
    'save&generate': '保存及生成',
    cancel: '取消',
    confirm: '确认',
    start: '开始日期',
    selPeriod: '请选择日期',
    selOption: '请选择选项',
    end: '结束日期',
    status: '状态',
    active: '已启动',
    paused: '已暂停',
    create: '新建',
    edit: '编辑',
    search: '搜索',
    confirmTitle: '您确定要这样做吗？',
    tip: '提示',
    optSuccess: '操作成功！',
    all: '所有',
    more: '更多',
    subTotel: '合计',
    needUpdate: '系统版本有更新，点击确认加载最新！',
    dateRangeBaiduErr: '日期范围最大不超过365天',
    yes: '是',
    no: '否',
    download: '下载',
    export: '导出',
    vs: 'vs.',
    prev: 'prev.',
    noResultDetail: '( 没有结果 )',
    customise: '定制化'
  },
  login: {
    error: {
      system: '系统错误，请联系管理员！',
      session: '登录已过期，请重新登录！',
      network: '网络出了点问题，请稍后重试！',
      permisson: '请求的资源没有权限！',
      notFound: '请求的资源不存在！',
      innerError: '内部错误，请稍后重试！',
      notInService: '服务器正在维护，请稍等！',
      dataError: '系统数据错误, 请联系运营人员'
    },
    slogan: 'iNsights',
    slogan1: 'CHINA PROGRAMMATIC',
    slogan2: 'PREMIUM MOBILE INVENTORY',
    slogan3: 'ADVANCED TARGETING',
    sloganDetail: 'integrated in one platform',
    welcome: '欢迎来到 ',
    username: '请输入用户名',
    password: '请输入密码',
    submit: '登录'
  },
  header: {
    agency: '代理商',
    advertiser: '广告主',
    signout: '登出',
    allClients: '所有客户',
    recent: '最近',
    search: '搜索客户'
  },
  menu: {
    setup: 'Setup',
    eventSetup: 'Event Setup',
    goalSetup: 'Goal Setup',
    AnalysisSetup: 'Funnel Setup',
    dashboard: 'Dashboard',
    propertySummary: 'Property Summary',
    channelAnalysis: 'Channel Analysis',
    funnelAnalysis: 'Funnel Analysis',
    reports: 'Reports',
    eventReports: 'Event Reports',
    eventLog: 'Event Log',
    downloadReports: 'Download Reports'
  },
  footer: {
    power: '由爱点击提供技术支持。版权所有。',
    icp: 'ICP 14026918 iNsights',
    browsers:
      '(建议采用浏览器: Internet Explorer 9.0+, Chrome 8.0+, Firefox 3.5+, Safari 1.0+)',
    policy: '隐私声明'
  },
  dateRange: {
    last7days: '最近7天',
    last30days: '最近30天',
    last90days: '最近90天',
    today: '今天',
    yesterday: '昨天',
    month: '本月',
    lastmonth: '上个月',
    lastweek: '上周',
    total: '全部时间'
  },
  event: {
    title: '活动',
    create: '活动',
    batch: '批量处理',
    id: '活动ID',
    name: '活动名称',
    trackingType: '追踪类型',
    status: '状态',
    url: 'URL',
    includedGoal: 'Included in Goal Set Up',
    includedFunnel: 'Included in Funnel Set Up',
    lastEvent: 'Last Event',
    action: '操作',
    createTitle: '活动',
    namePlaceholder: '请输入活动名称',
    nature: 'Nature',
    trackingSettings: 'Tracking Settings',
    trackInsight: 'Track by Insight Tag',
    trackInsightTip:
      'Used to track variables for a particular event such as Order No., Customer ID, Sales Amount, etc. This can be installed on specific pages on a website.',
    trackUniversal: 'Track by Universal Tag',
    trackUniversalTip:
      'Used to track complete conversion paths of different media and channels. This can be installed on all pages of a website.',
    insightTagTable: {
      parameter: 'Parameter',
      name: 'Event Name',
      type: 'Type',
      sample: 'Sample',
      remarks: 'Remarks',
      fillName: 'Fill in a tag name',
      remarksContent:
        'Used for counting number of this event Rules: Integer; Greater than or equal to 1',
      addMore: 'Add one more event',
      note: 'NOTE',
      noteDetail:
        'Used for counting number of this event.Please notify your client to replace the default sample value inside the generated insight tag with their actual parameter values for correct tracking.'
    },
    universalTable: {
      filterTypeKeyword: 'Specify keywords appeared in the URL',
      filterTypeRegular: 'Regular expression',
      keywordsPerLine: 'Keywords/Phrases - One per line',
      keywordsPerLineTip:
        'Enter tags. You may enter one tag per line or separate tags by commas.',
      thirdParty: 'Third Party Script',
      thirdPartyTip: 'Enter Third Party Script.'
    },
    removeDup: 'Remove Duplicates',
    removeDupDisable: 'Disable',
    removeDupEnable:
      'Enable (Only the "Text/Key" parameter can be used for de-duplication)',
    removeDupEnableBase: 'Remove duplicates based on:',
    isIncludedGoal: 'Include In Goal Set Up',
    isIncludedFunnel: 'Include In Funnel Set Up'
  },
  goals: {
    title: '目标',
    create: '目标',
    batch: '批量处理',
    id: '目标ID',
    name: '目标名称',
    namePlaceholder: '请输入目标名称',
    status: '事件状态',
    lastUpdate: '最后更新时间',
    action: '操作',
    createTitle: '目标',
    selectConversion: 'Select an event as a conversion goal'
  },
  funnels: {
    title: 'Funnel Setup',
    create: 'Funnel',
    batch: '批量处理',
    id: 'Funnel ID',
    name: 'Funnel Name',
    eventsAndGoal: 'Events and Goal',
    status: '状态',
    lastUpdate: '最后更新时间',
    action: '操作',
    namePlaceholder: '请输入名称',
    selectEvent: 'Select Events',
    selectEventTip:
      'Select event(s) then drag and drop to configure the order of events.',
    addEvents: 'Event(s)',
    eventTable: {
      step: 'Step',
      event: 'Event',
      id: 'Event ID',
      url: 'URL',
      trackType: 'Tracking Type',
      lastEvent: 'Last Event',
      goal: 'Goal'
    },
    selectEvents: 'Select Events'
  },
  eventLog: {
    title: 'Event Log',
    id: 'Event ID',
    view: 'View',
    time: 'Event Time',
    name: 'Event Name',
    from: 'From',
    to: 'To',
    url: 'URL',
    visitorIp: 'Visitor IP'
  },
  property: {
    title: 'Property Summary',
    trafficSnapShot: 'Traffic SnapShot',
    industry: 'Industry',
    product: 'Product',
    goal: 'Goal',
    nature: 'Nature',
    uniqueVisit: 'Unique Visits',
    uniqueVisitTip: 'Unique Visits',
    uniqueVisitors: 'Unique Visitors',
    uniqueVisitorsTip: 'Unique Visitors',
    frequencyVisit: 'Frequency of Visit',
    frequencyVisitTip: 'Frequency of Visit',
    avgPageView: 'Average Page Views',
    avgPageViewTip: 'Average Page Views',
    newVisitors: 'New Visitors',
    newVisitorsTip: 'New Visitors',
    repeatVisitors: 'Repeat Visitors',
    repeatVisitorsTip: 'Repeat Visitors',
    bounceRate: 'Bounce Rate',
    bounceRateTip: 'Bounce Rate',
    avgTimeSpan: 'Average Time Span',
    avgTimeSpanTip: 'Average Time Span',
    performanceSnap: 'Performance SnapShot',
    uniqueConv: 'Unique Conversions',
    uniqueConvTip: 'Unique Conversions',
    outOfConv: 'out of conversions',
    uniqueCustomers: 'Unique Customers',
    uniqueCustomersTip: 'Unique Customers',
    lastMileRatio: 'Last Mile Ratio',
    lastMileRatioTip: 'Last Mile Ratio',
    search: 'Search',
    nonSearch: 'Non-Search',
    timeToConvert: 'Time-to-Convert',
    timeToConvertTip: 'Time-to-Convert',
    fullPath: 'Full-path',
    lastMile: 'Last-mile',
    days: 'days',
    audienceSnap: 'Audience SnapShot',
    regions: 'Regions',
    timeDist: 'Time Distribution',
    timeDistTip: 'Time Distribution'
  },
  audience: {
    analysis: 'Audience Analysis',
    gender: 'Gender',
    ageGroups: 'Age Groups',
    regions: 'Regions',
    regionsTip: 'Regions',
    keywords: 'Keywords',
    allChannels: 'All Channels',
    direct: 'Direct',
    interests: 'Interst Categories',
    channel: 'Channel'
  },
  channel: {
    title: 'Traffic Overview',
    breakdown: 'Traffic Breakdown',
    breakdownTip: 'Traffic Breakdown',
    channel: 'Channel',
    device: 'Device',
    trafficSource: 'Top Traffic Source',
    trafficSourceTip: 'Top Traffic Source',
    trafficTrend: 'Trend of Traffic',
    trafficTrendTip: 'Trend of Traffic',
    assist: 'Assist Analysis',
    assistTip: 'Assist Analysis',
    assistNotice: 'Numbers in red: The best auxiliary media',
    conversionPaths: 'Top Conversion Paths',
    conversionPathsTip: 'Top Conversion Paths',
    goal: 'Goal',
    conversion: 'Conversion',
    campaign: 'Campaign'
  },
  funnelAnalysis: {
    title: 'Funnel Analysis',
    tabTitle: 'Funnel Overview',
    funnel: 'Funnel',
    funnelTip: 'Funnel',
    channels: 'Channels',
    exit: 'Exit',
    breakdown: 'Funnel Breakdown',
    breakdownTip: 'Funnel Breakdown',
    repeatVisitor: 'Repeat Visitor Rate',
    frequencyVisit: 'Frequency of Visits',
    avgPageView: 'Average Page View',
    avgTimeSpan: 'Average Time Span',
    allFunnels: 'All Funnels'
  },
  scheduleReport: {
    create: 'Scheduled Report',
    period: 'Period',
    total: 'Total',
    days: 'day(s)',
    exclude: 'Exclude',
    to: 'To',
    emailNotify: 'Email Notification',
    reportName: 'Report Name',
    generate: 'Generate',
    cancel: 'Cancel'
  },
  downloadReport: {
    title: 'Download Reports',
    name: 'Report Name',
    genTime: 'Generated Time',
    status: 'Status',
    action: 'Action'
  },
  errorInfo: {
    emptyInput: '请输入一些东西'
  },
  multilayer: {
    search: '查询',
    dimensions: '维度',
    metrics: '指标',
    events: '活动',
    goals: '目标',
    all: ' (全部)',
    choose_label: '已选择活动',
    left_layer: '活动',
    right_layer: '已选择活动',
    right_layer_events: '已选择活动',
    right_layer_goals: '已选择目标',
    right_layer_columns: '已选择栏',
    noResult: '没有结果',
    noSelects: '暂未选择活动',
    noSelects_events: '没有选择活动',
    noSelects_goals: '没有选择目标',
    noSelects_columns: '没有已选择栏',
    rangeErr0: '至少 ',
    rangeErr1: '最多 ',
    rangeErr2: ' 活动 '
  },
  errorPage: {
    ops: '出错了!',
    notexist: '对不起，您访问的页面不存在',
    tip1: '你可以选择回到 ',
    tip2: '上一页',
    tip3: ' 或者回到 ',
    tip4: '首页',
    tip5: '想获取额外的帮助，请联系我们 ',
    tip6: '首页'
  }
}
