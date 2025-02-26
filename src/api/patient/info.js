import request from '@/utils/request'

// 查询患者资料列表
export function listInfo(query) {
  return request({
    url: '/patient/info/list',
    method: 'get',
    params: query
  })
}

// 查询患者资料详细
export function getInfo(patientId) {
  return request({
    url: '/patient/info/' + patientId,
    method: 'get'
  })
}

// 新增患者资料
export function addInfo(data) {
  return request({
    url: '/patient/info',
    method: 'post',
    data: data
  })
}

// 修改患者资料
export function updateInfo(data) {
  return request({
    url: '/patient/info',
    method: 'put',
    data: data
  })
}

// 删除患者资料
export function delInfo(patientId) {
  return request({
    url: '/patient/info/' + patientId,
    method: 'delete'
  })
}
