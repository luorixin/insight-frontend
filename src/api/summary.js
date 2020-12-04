import $http from './index'

const baseUrl = '/analysissummary'

export const list = () =>
  $http({
    url: $http.adornUrl(baseUrl + '/list'),
    method: 'get',
    params: $http.adornParams({})
  })

export const performance = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/performance'),
    method: 'post',
    data: $http.adornData(params)
  })

export const traffic = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/traffic'),
    method: 'post',
    data: $http.adornData(params)
  })

export const distribution = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/distribution'),
    method: 'post',
    data: $http.adornData(params)
  })

export const regions = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/regions'),
    method: 'post',
    data: $http.adornData(params)
  })

export const create = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/create'),
    method: 'post',
    data: $http.adornData(params)
  })
