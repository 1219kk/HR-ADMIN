<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="共1条记录">
        <template #right>
          <el-button type="danger" size="mini">普通excel导出</el-button>
          <el-button type="info" size="mini">复杂表头excel导出</el-button>
          <el-button type="success" size="mini">excel导入</el-button>
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
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmployee"
          ></el-table-column>
          <!-- 2 -->
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="scope">
              {{ scope.row.formOfEmployment | formatFormType }}
            </template>
          </el-table-column>

          <el-table-column label="部门" prop="departmentName"></el-table-column>
          <el-table-column
            label="入职时间"
            prop="timeOfEntry"
            width="100px"
          ></el-table-column>
          <el-table-column label="状态" prop="enableState"></el-table-column>
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
    formatFormType (id) {
      return employees.hireType.find(item => item.id === id).value
    }
  },
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1,
        size: 4
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
      return employees.hireType.find(item => item.id === cellValue - 0).value
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
