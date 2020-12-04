import $http from './index'

const baseUrl = '/analysismedia'

export const list = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/list'),
    method: 'get',
    params: $http.adornParams(params)
  })

export const trafficBreakdown = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/breakdown'),
    method: 'post',
    data: $http.adornData(params)
  })

export const trafficSource = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/trafficsource'),
    method: 'post',
    data: $http.adornData(params)
  })

export const trafficTrend = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/traffictrend'),
    method: 'post',
    data: $http.adornData(params)
  })

export const regions = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/regions'),
    method: 'post',
    data: $http.adornData(params)
  })
