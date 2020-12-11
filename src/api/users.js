import $http from './index'

const baseUrl = '/user'

export const list = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/list'),
    method: 'get',
    params: $http.adornParams(params)
  })

export const perm = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/perm'),
    method: 'get',
    params: $http.adornParams(params)
  })
