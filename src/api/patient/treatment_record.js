import request from '@/utils/request'

// 查询治疗记录列表
export function listTreatment_record(query) {
  return request({
    url: '/patient/treatment_record/list',
    method: 'get',
    params: query
  })
}

// 查询治疗记录详细
export function getTreatment_record(id) {
  return request({
    url: '/patient/treatment_record/' + id,
    method: 'get'
  })
}

// 新增治疗记录
export function addTreatment_record(data) {
  return request({
    url: '/patient/treatment_record',
    method: 'post',
    data: data
  })
}

// 修改治疗记录
export function updateTreatment_record(data) {
  return request({
    url: '/patient/treatment_record',
    method: 'put',
    data: data
  })
}

// 删除治疗记录
export function delTreatment_record(id) {
  return request({
    url: '/patient/treatment_record/' + id,
    method: 'delete'
  })
}
