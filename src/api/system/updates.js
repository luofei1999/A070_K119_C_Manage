import request from '@/utils/request'

// 查询应用更新列表
export function listUpdates(query) {
  return request({
    url: '/system/updates/list',
    method: 'get',
    params: query
  })
}

// 查询应用更新详细
export function getUpdates(id) {
  return request({
    url: '/system/updates/' + id,
    method: 'get'
  })
}

// 新增应用更新
export function addUpdates(data) {
  return request({
    url: '/system/updates',
    method: 'post',
    data: data
  })
}

// 修改应用更新
export function updateUpdates(data) {
  return request({
    url: '/system/updates',
    method: 'put',
    data: data
  })
}

// 删除应用更新
export function delUpdates(id) {
  return request({
    url: '/system/updates/' + id,
    method: 'delete'
  })
}
