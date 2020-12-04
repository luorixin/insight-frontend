import $http from './index'

const baseUrl = '/reports'

export const list = () =>
  $http({
    url: $http.adornUrl(baseUrl + '/list'),
    method: 'get',
    params: $http.adornParams({})
  })

export const create = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/create'),
    method: 'post',
    data: $http.adornData(params)
  })

export const download = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/download/' + params.id),
    method: 'get',
    responseType: 'blob',
    params: $http.adornParams(params)
  })
