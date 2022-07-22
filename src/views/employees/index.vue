<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="共1条记录">
        <template #right>
          <el-button type="danger" size="mini" @click="exportExcel"
            >普通excel导出</el-button
          >
          <!-- router 路由切换 -->
          <!-- route 获取路由相关参数 指的是当前路由 -->
          <el-button type="info" size="mini" @click="exportExcel1"
            >复杂表头excel导出</el-button
          >
          <el-button
            type="success"
            size="mini"
            @click="$router.push('./import?type=user')"
            >excel导入</el-button
          >
          <el-button type="primary" size="mini">新增员工</el-button>
        </template>
      </PageTool>

      <el-card style:margin-top="10px">
        <el-table border :data="employee">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="姓名"
            sortable
            prop="username"
          ></el-table-column>
          <el-table-column label="头像" prop="staffPhoto">
            <template v-slot="scope">
              <img :src="scope.row.staffPhoto" style="width: 40px" />
            </template>
          </el-table-column>
          <el-table-column
            label="手机号"
            prop="mobile"
            width="120px"
          ></el-table-column>
          <el-table-column label="工号" prop="workNumber"></el-table-column>
          <!-- 1 -->
          <!-- <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmployee"
          ></el-table-column> -->
          <!-- 2 -->
          <!-- <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="scope">
              {{ scope.row.formOfEmployment | formatFormType }}
            </template>
          </el-table-column> -->

          <el-table-column label="部门" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry" width="100px">
            <template v-slot="scope">
              {{ scope.row.timeOfEntry | dateformat }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="enableState">
            <template v-slot="scope">
              <el-switch :value="scope.row.enableState"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300px">
            <template>
              <el-button type="text">查看</el-button>
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text">角色</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployee } from '@/api/employee'
import employees from '@/constant/employees'
export default {
  filters: {

  },
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1,
        size: 5
      },
      employee: [],
      total: null
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getEmployee()
  },
  methods: {
    async getEmployee () {
      const res = await getEmployee(this.paramsObj)
      console.log(res)
      this.employee = res.rows
      this.total = res.total
    },
    // row这一行
    // column当前这一列的相关信息 比如这一列有多宽
    // cellValue单元的值
    // index索引
    formatterEmployee (row, column, cellValue, index) {
      var obj = employees.hireType.find(item => item.id === cellValue - 0)
      if (obj) {
        return employees.hireType.find(item => item.id === cellValue - 0).value
      } else {
        return '未知'
      }
    },
    async exportExcel () {
      // 获取所有的列表数据
      const { rows } = await getEmployee({ page: 1, size: 9999 })
      console.log(rows)
      rows.forEach(item => {
        delete item.password
        delete item.staffPhoto
      })
      // 把列表数据进行加工处理变成二维数组
      var data = []
      rows.forEach(item => {
        data.push(Object.values(item))
      })
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      var tHeader = Object.keys(rows[0]).map(item => { headers[item] })
      // 只有点了 按钮才会导入
      import('@/vendor/Export2Excel').then(excel => {
        // 使用这个插件导出excel
        //   const tHeader = ['编号', '姓名']
        //   const data = [[1, '张三'], [2, '李四']]
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: '人力资源表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    exportExcel1 () {
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const data = [
        ['张三', '13000000', '2019-1-1', '正式', '2019-1-2', '110', 'java部门'],
        ['李四', '13000000', '2019-1-1', '正式', '2019-1-2', '111', 'java部门']
      ]

      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          multiHeader, // 第一行表头 复杂表头
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          merges // 设置合并规则
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
