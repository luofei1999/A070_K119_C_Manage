import request from '@/utils/request'

// 查询患者列表列表
export function listDoctor_patient(query) {
  return request({
    url: '/patient/doctor_patient/list',
    method: 'get',
    params: query
  })
}

// 查询患者列表详细
export function getDoctor_patient(id) {
  return request({
    url: '/patient/doctor_patient/' + id,
    method: 'get'
  })
}

// 新增患者列表
export function addDoctor_patient(data) {
  return request({
    url: '/patient/doctor_patient',
    method: 'post',
    data: data
  })
}

// 修改患者列表
export function updateDoctor_patient(data) {
  return request({
    url: '/patient/doctor_patient',
    method: 'put',
    data: data
  })
}

// 删除患者列表
export function delDoctor_patient(id) {
  return request({
    url: '/patient/doctor_patient/' + id,
    method: 'delete'
  })
}
