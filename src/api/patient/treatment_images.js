import request from '@/utils/request'

// 查询治疗图片列表
export function listTreatment_images(query) {
  return request({
    url: '/patient/treatment_images/list',
    method: 'get',
    params: query
  })
}

// 查询治疗图片详细
export function getTreatment_images(id) {
  return request({
    url: '/patient/treatment_images/' + id,
    method: 'get'
  })
}

// 新增治疗图片
export function addTreatment_images(data) {
  return request({
    url: '/patient/treatment_images',
    method: 'post',
    data: data
  })
}

// 修改治疗图片
export function updateTreatment_images(data) {
  return request({
    url: '/patient/treatment_images',
    method: 'put',
    data: data
  })
}

// 删除治疗图片
export function delTreatment_images(id) {
  return request({
    url: '/patient/treatment_images/' + id,
    method: 'delete'
  })
}
