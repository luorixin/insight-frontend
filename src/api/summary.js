import $http from './index'

const baseUrl = '/analysis/summary'

export const list = () =>
  $http({
    url: $http.adornUrl(baseUrl + '/list'),
    method: 'get',
    params: $http.adornParams({})
  })

export const performance = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/performance/snapshot'),
    method: 'post',
    data: $http.adornData(params)
  })

export const traffic = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/traffic/snapshot'),
    method: 'post',
    data: $http.adornData(params)
  })

export const distribution = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/time/distribution'),
    method: 'post',
    data: $http.adornData(params)
  })

export const regions = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/regions'),
    method: 'post',
    data: $http.adornData(params)
  })
