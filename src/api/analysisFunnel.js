import $http from './index'

const baseUrl = '/analysissfunnel'

export const list = () =>
  $http({
    url: $http.adornUrl(baseUrl + '/list'),
    method: 'get',
    params: $http.adornParams({})
  })

export const detail = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/detail'),
    method: 'post',
    data: $http.adornData(params)
  })

export const breakdown = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/breakdown'),
    method: 'post',
    data: $http.adornData(params)
  })

export const regions = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/regions'),
    method: 'post',
    data: $http.adornData(params)
  })
