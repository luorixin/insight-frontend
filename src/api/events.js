import $http from './index'

const baseUrl = '/event'

const baseLogUrl = '/eventlog'

export const list = () =>
  $http({
    url: $http.adornUrl(baseUrl + '/list'),
    method: 'get',
    params: $http.adornParams({})
  })

export const LogList = params =>
  $http({
    url: $http.adornUrl(baseLogUrl + '/LogList'),
    method: 'get',
    params: $http.adornParams(params)
  })

export const eventLogTable = params =>
  $http({
    url: $http.adornUrl(baseLogUrl + '/eventLogTable'),
    method: 'post',
    data: $http.adornData(params)
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
    url: $http.adornUrl(baseUrl + '/update/' + id),
    method: 'get',
    params: $http.adornParams({})
  })

export const update = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/update'),
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

export const exportXls = params =>
  $http({
    url: $http.adornUrl(baseLogUrl + '/export'),
    method: 'post',
    responseType: 'blob',
    data: $http.adornData(params)
  })

export const batchUpdate = params =>
  $http({
    url: $http.adornUrl(baseUrl + '/batchUpdate'),
    method: 'post',
    data: $http.adornData(params)
  })
