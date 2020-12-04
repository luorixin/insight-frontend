import $http from './index'

const baseUrl = '/user'

export const list = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/list'),
    method: 'get',
    params: $http.adornParams(params)
  })
