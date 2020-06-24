import $http from './index'

const baseUrl = '/channel'

export const list = () =>
  $http({
    url: $http.adornUrl(baseUrl + '/list'),
    method: 'get',
    params: $http.adornParams({})
  })

export const toCreate = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/create'),
    method: 'get',
    params: $http.adornParams(params)
  })

export const create = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/create'),
    method: 'post',
    data: $http.adornData(params)
  })

export const toUpdate = id =>
  $http({
    url: $http.adornUrl(baseUrl + '/update'),
    method: 'get',
    params: $http.adornParams({})
  })

export const update = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/update'),
    method: 'post',
    data: $http.adornData(params)
  })
