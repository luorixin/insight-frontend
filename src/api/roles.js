import $http from './index'

const baseUrl = '/role'

export const list = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/list'),
    method: 'get',
    params: $http.adornParams(params)
  })

export const modules = () =>
  $http({
    url: $http.adornUrl(baseUrl + '/modules'),
    method: 'get',
    params: $http.adornParams({})
  })

export const toUpdate = roleId =>
  $http({
    url: $http.adornUrl(baseUrl + '/update'),
    method: 'get',
    params: $http.adornParams({ roleId: roleId })
  })

export const doUpdate = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/update'),
    method: 'post',
    data: $http.adornData(params)
  })
