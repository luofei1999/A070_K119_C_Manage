import request from '@/utils/request'

// 查询订阅管理列表
export function listSubscriptions_manage(query) {
  return request({
    url: '/devices/subscriptions_manage/list',
    method: 'get',
    params: query
  })
}

// 查询订阅管理详细
export function getSubscriptions_manage(id) {
  return request({
    url: '/devices/subscriptions_manage/' + id,
    method: 'get'
  })
}

// 新增订阅管理
export function addSubscriptions_manage(data) {
  return request({
    url: '/devices/subscriptions_manage',
    method: 'post',
    data: data
  })
}

// 修改订阅管理
export function updateSubscriptions_manage(data) {
  return request({
    url: '/devices/subscriptions_manage',
    method: 'put',
    data: data
  })
}

// 删除订阅管理
export function delSubscriptions_manage(id) {
  return request({
    url: '/devices/subscriptions_manage/' + id,
    method: 'delete'
  })
}
