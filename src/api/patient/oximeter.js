import request from '@/utils/request'

// 查询血氧仪列表
export function listOximeter(query) {
  return request({
    url: '/patient/oximeter/list',
    method: 'get',
    params: query
  })
}

// 查询血氧仪详细
export function getOximeter(oximeterId) {
  return request({
    url: '/patient/oximeter/' + oximeterId,
    method: 'get'
  })
}

// 新增血氧仪
export function addOximeter(data) {
  return request({
    url: '/patient/oximeter',
    method: 'post',
    data: data
  })
}

// 修改血氧仪
export function updateOximeter(data) {
  return request({
    url: '/patient/oximeter',
    method: 'put',
    data: data
  })
}

// 删除血氧仪
export function delOximeter(oximeterId) {
  return request({
    url: '/patient/oximeter/' + oximeterId,
    method: 'delete'
  })
}
