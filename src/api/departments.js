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
/**
 * 新增部门
 * @param code 编码
 * @returns
 */
export const addDepartment = ({ code, introduce, manager, name, pid }) => {
  return request({
    method: 'POST',
    url: '/company/department',
    data: { code, introduce, manager, name, pid }
  })
}

/**
 * 编辑部门
 * @param {*} data
 * @returns
 */
export const editDepartment = data => {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}
