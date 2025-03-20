import request from '@/utils/request'

// 查询设备信息列表
export function listDevices_manage(query) {
  return request({
    url: '/devices/devices_manage/list',
    method: 'get',
    params: query
  })
}

// 查询设备信息详细
export function getDevices_manage(id) {
  return request({
    url: '/devices/devices_manage/' + id,
    method: 'get'
  })
}

// 新增设备信息
export function addDevices_manage(data) {
  return request({
    url: '/devices/devices_manage',
    method: 'post',
    data: data
  })
}

// 修改设备信息
export function updateDevices_manage(data) {
  return request({
    url: '/devices/devices_manage',
    method: 'put',
    data: data
  })
}

// 删除设备信息
export function delDevices_manage(id) {
  return request({
    url: '/devices/devices_manage/' + id,
    method: 'delete'
  })
}

// 查询分组下拉树结构
export function groupTreeSelect() {
  return request({
    url: '/devices/devices_manage/devicesGroupTree',
    method: 'get'
  })
}
