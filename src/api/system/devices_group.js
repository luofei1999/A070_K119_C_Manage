import request from '@/utils/request'

// 查询设备分组列表
export function listDevices_group(query) {
  return request({
    url: '/system/devices_group/list',
    method: 'get',
    params: query
  })
}

// 查询设备分组详细
export function getDevices_group(groupId) {
  return request({
    url: '/system/devices_group/' + groupId,
    method: 'get'
  })
}

// 查询部门列表（排除节点）
export function listGroupExcludeChild(groupId) {
  return request({
    url: '/system/devices_group/list/exclude/' + groupId,
    method: 'get'
  })
}

// 新增设备分组
export function addDevices_group(data) {
  return request({
    url: '/system/devices_group',
    method: 'post',
    data: data
  })
}

// 修改设备分组
export function updateDevices_group(data) {
  return request({
    url: '/system/devices_group',
    method: 'put',
    data: data
  })
}

// 删除设备分组
export function delDevices_group(groupId) {
  return request({
    url: '/system/devices_group/' + groupId,
    method: 'delete'
  })
}
