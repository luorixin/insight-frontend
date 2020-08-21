export default {
  test: 'test',
  logo: 'iNsights',
  language: 'English',
  common: {
    noResult: 'No Result',
    weekly: 'Weekly',
    monthly: 'Monthly',
    monday: 'Every Monday',
    tuesday: 'Every Tuesday',
    wednesday: 'Every Wednesday',
    thursday: 'Every Thursday',
    friday: 'Every Friday',
    saturday: 'Every Saturday',
    sunday: 'Every Sunday',
    enable: 'Enable',
    disabled: 'Disabled',
    event: 'Event',
    goal: 'Goal',
    standard: 'Standard',
    add: 'Add',
    remove: 'Remove',
    total: 'Total',
    days: 'day(s)',
    hours: 'hr(s)',
    minutes: 'min(s)',
    seconds: 'sec(s)',
    exclude: 'Exclude',
    to: 'To',
    manual: 'Manual',
    daily: 'Daily',
    time: 'Time',
    timeZone: 'Time Zone',
    overseas: 'Overseas',
    china: 'China',
    save: 'Save',
    'save&Generate': 'Save & Generate',
    cancel: 'Cancel',
    confirm: 'Confirm',
    start: 'Start Date',
    selPeriod: 'please select a period',
    selOption: 'please select an option',
    end: 'End Date',
    status: 'Status',
    active: 'Active',
    paused: 'Paused',
    create: 'Create',
    edit: 'Edit',
    search: 'Search',
    confirmTitle: 'Do you sure you want to do this?',
    tip: 'Tips',
    optSuccess: 'Operation succeeded!',
    all: 'All',
    more: 'more',
    subTotel: 'Total: Filtered',
    needUpdate:
      'The system version is updated. Click to confirm the latest loading!',
    dateRangeBaiduErr: 'Date range must less than one year',
    yes: 'Yes',
    no: 'No',
    download: 'Download',
    export: 'Export',
    vs: 'vs.',
    prev: 'prev.',
    noResultDetail: '(There is no result.)',
    customise: 'Customise'
  },
  login: {
    error: {
      system: 'System error, please contact administrator!',
      session: 'Login has expired, please login again!',
      network:
        'There is something wrong with the network. Please try again later!',
      permisson: 'The requested resource does not have permission!',
      notFound: 'The requested resource does not exist!',
      innerError: 'Internal error, please try again later!',
      notInService: 'Server is under maintenance, please wait!',
      dataError: 'System data error, please contact the operator!'
    },
    slogan: 'iNsights',
    slogan1: 'CHINA PROGRAMMATIC',
    slogan2: 'PREMIUM MOBILE INVENTORY',
    slogan3: 'ADVANCED TARGETING',
    sloganDetail: 'integrated in one platform',
    welcome: 'Welcome to ',
    username: 'Enter your user name',
    password: 'Enter your password',
    submit: 'Login'
  },
  header: {
    agency: 'Agency',
    advertiser: 'Advertiser',
    signout: 'Sign Out',
    allClients: 'All Clients',
    recent: 'Recent',
    search: 'Search Clients'
  },
  menu: {
    setup: 'Setup',
    eventSetup: 'Event Setup',
    goalSetup: 'Goal Setup',
    funnelSetup: 'Funnel Setup',
    dashboard: 'Dashboard',
    propertySummary: 'Property Summary',
    channelAnalysis: 'Channel Analysis',
    funnelAnalysis: 'Funnel Analysis',
    reports: 'Reports',
    eventReports: 'Event Log',
    eventLog: 'Event Log',
    downloadReports: 'Download Reports'
  },
  footer: {
    power: 'Powered by iClick. All Rights Reserved. ',
    icp: 'ICP 14026918 iNsights',
    browsers:
      '(Suggested browsers: Internet Explorer 9.0+, Chrome 8.0+, Firefox 3.5+, Safari 1.0+)',
    policy: 'Privacy Policy'
  },
  dateRange: {
    last7days: 'Last 7 Days',
    last30days: 'Last 30 Days',
    last90days: 'Last 90 Days',
    today: 'Today',
    yesterday: 'Yesterday',
    month: 'This Month',
    lastmonth: 'Last Month',
    lastweek: 'Last Week',
    total: 'Total Time'
  },
  event: {
    title: 'Event List',
    create: 'Event',
    batch: 'Batch Processing',
    id: 'Event ID',
    name: 'Event Name',
    trackingType: 'Tracking Type',
    status: 'Status',
    url: 'URL',
    includedGoal: 'Included In Goal Set Up',
    includedFunnel: 'Included In Funnel Set Up',
    lastEvent: 'Last Event',
    action: 'Action',
    createTitle: ' an Event',
    namePlaceholder: 'Please enter event name',
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
        'Used for counting number of this event.Please notify your client to replace the default sample value inside the Generated insight tag with their actual parameter values for correct tracking.'
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
    title: 'Goal Setup',
    create: 'Goal',
    batch: 'Batch Processing',
    id: 'Goal ID',
    name: 'Goal Name',
    namePlaceholder: 'Please enter goal name',
    status: 'Status',
    lastUpdate: 'Last Update',
    action: 'Action',
    createTitle: ' Goal',
    selectConversion: 'Select An Event As A Goal'
  },
  funnels: {
    title: 'Funnel Setup',
    create: 'Funnel',
    batch: 'Batch Processing',
    id: 'Funnel ID',
    name: 'Funnel Name',
    eventsAndGoal: 'Events and Goal',
    status: 'Status',
    lastUpdate: 'Last Update',
    action: 'Action',
    namePlaceholder: 'Please enter funnel name',
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
    performanceSnap: 'Performance Snapshot',
    uniqueConv: 'Conversions',
    uniqueConvTip: 'Conversions',
    outOfConv: 'out of conversions',
    uniqueCustomers: 'Unique Customers',
    uniqueCustomersTip: 'Unique Customers',
    lastMileRatio: 'Last Mile Ratio',
    lastMileRatioTip: 'Last Mile Ratio',
    search: 'Search',
    nonSearch: 'Non-Search',
    timeToConvert: 'Time To Convert',
    timeToConvertTip: 'Time To Convert',
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
    title: 'Channel Analysis',
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
    campaign: 'Campaign',
    topAssist: 'Channel | Media',
    totalAssist: 'Total Assisted',
    total: 'Total'
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
    allFunnels: 'All Funnels',
    allGoals: 'All Goals'
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
    emptyInput: 'Please enter something!'
  },
  multilayer: {
    search: 'Search',
    dimensions: 'Dimensions',
    metrics: 'Metrics',
    events: 'Events',
    goals: 'Goals',
    all: ' (All)',
    left_layer: 'Events',
    right_layer: 'Selected Event(s)',
    choose_label: 'Selected Event(s)',
    right_layer_events: 'Selected Event(s)',
    right_layer_goals: 'Selected Goal(s)',
    right_layer_columns: 'Selected Column(s)',
    noResult: 'No Results',
    noSelects: 'No selected events',
    noSelects_events: 'No selected events',
    noSelects_goals: 'No selected goals',
    noSelects_columns: 'No selected columns',
    rangeErr0: 'at least ',
    rangeErr1: 'Max. ',
    rangeErr2: ' events '
  },
  errorPage: {
    ops: 'Oops!',
    notexist: 'Sorry, the page you requested does not exist.',
    tip1: 'You may return to the ',
    tip2: 'previous page',
    tip3: ' or go to the ',
    tip4: 'home page',
    tip5:
      'To report this issue or for additional support, please contact us at ',
    tip6: 'Home'
  }
}
