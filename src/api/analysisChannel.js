import $http from './index'

const baseUrl = '/analysis/channel'

export const assist = () =>
  $http({
    url: $http.adornUrl(baseUrl + '/assist'),
    method: 'get',
    params: $http.adornParams({})
  })

export const list = () =>
  $http({
    url: $http.adornUrl(baseUrl + '/list'),
    method: 'get',
    params: $http.adornParams({})
  })

export const trafficBreakdown = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/traffic/breakdown'),
    method: 'post',
    data: $http.adornData(params)
  })

export const trafficSource = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/traffic/source'),
    method: 'post',
    data: $http.adornData(params)
  })

export const trafficTrend = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/traffic/trend'),
    method: 'post',
    data: $http.adornData(params)
  })

export const conversionPath = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/conversion/paths'),
    method: 'post',
    data: $http.adornData(params)
  })

export const assistAnalysis = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/assist/analysis'),
    method: 'post',
    data: $http.adornData(params)
  })

export const regions = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/regions'),
    method: 'post',
    data: $http.adornData(params)
  })

export const campaigns = () =>
  $http({
    url: $http.adornUrl(baseUrl + '/campaigns'),
    method: 'get',
    params: $http.adornParams({})
  })
