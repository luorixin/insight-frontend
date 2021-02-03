import $http from './index'

const baseUrl = '/analysisgoal'

export const source = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/source'),
    method: 'post',
    data: $http.adornData(params)
  })

export const trend = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/trend'),
    method: 'post',
    data: $http.adornData(params)
  })
