import request from '@/utils/request'
// 先写html css 再写ajax
// 查询企业的部门列表
export const getDepartmentsList = () => {
  return request({
    url: '/company/department'
  })
}
// 根据ID删除部门
export const delDepartment = (id) => {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}
