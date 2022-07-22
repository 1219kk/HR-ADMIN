<template>
  <div>
    <el-button
      type="primary"
      size="mini"
      @click="
        roleDialogVisible = true;
        isEdit = false;
        form = {};
      "
      >新增角色</el-button
    >
    <el-table :data="roleList" border>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column
        label="角色名"
        prop="name"
        width="160px"
        sortable
      ></el-table-column>
      <el-table-column
        label="描述"
        prop="description"
        sortable
      ></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="showRightDialog(scope.row.id)"
            >分配权限</el-button
          >
          <el-button type="text" @click="showRoleDialog(scope.row)"
            >修改</el-button
          >
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" justify="end">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="paramsObj.page"
        :page-size="paramsObj.pagesize"
        :page-sizes="[2, 3, 4, 5, 6]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </el-row>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="rightVisible">
      <el-tree
        v-if="rightVisible"
        ref="myTree"
        :data="permissions"
        :props="{ label: 'name' }"
        default-expand-all
        show-checkbox
        :default-checked-keys="selectPermissions"
        node-key="id"
      >
      </el-tree>
      <template #footer>
        <el-button type="primary" @click="save">确定</el-button>
        <el-button @click="rightVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 新增修改 -->
    <el-dialog
      :title="isEdit ? '修改' : '新增'"
      :visible.sync="roleDialogVisible"
      close="reset"
    >
      <el-form
        v-if="roleDialogVisible"
        ref="myForm"
        label-width="80px"
        :rules="rules"
        :model="form"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onClick">确定</el-button>
        <el-button @click="roleDialogVisible = false">取消</el-button>
      </template></el-dialog
    >
  </div>
</template>

<script>
import { getRoleList, delRole, addRole, editRole } from '@/api/setting'
import { getPermissions, getPermissionsById, assignPermission } from '@/api/permission'
import { tranferListToTree } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1, // 默认第一页数据
        pagesize: 4// 每页数量
      },
      roleList: [],
      total: null,
      rightVisible: false,
      getPermissions: [],
      permissions: [],
      selectPermissions: [],
      id: null,
      roleDialogVisible: false,
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  created () { this.getRoleList() },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      this.roleList = res.rows
      this.total = res.total // 分页
    },
    // 数据
    handleCurrentChange (page) {
      console.log(page)
      this.paramsObj.page = page
      this.getRoleList()
    },
    // 每页数量
    handleSizeChange (pagesize) {
      this.paramsObj.pagesize = pagesize
      this.getRoleList()
    },
    // 删除
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        // 删除当前这一页最后一页 应该返回上一页
        if (this.roleList.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        }
        // console.log(res)
        this.getRoleList()
      })
    },
    // 分配权限
    async showRightDialog (id) {
      this.id = id
      const res = await getPermissions()
      this.permissions = tranferListToTree(res, '0')
      console.log(res)
      const res1 = await getPermissionsById(id)
      this.selectPermissions = res1.permIds
      console.log(res1)
      this.rightVisible = true
    },
    async save () {
      // console.log(
      //   this.$refs.myTree.getCheckedKeys()
      // )
      // 角色id
      // 权限id数组
      await assignPermission(this.id, this.$refs.myTree.getCheckedKeys())
      this.rightVisible = false // 弹出层关闭
      // console.log(res)
    },
    onClick () {
      // 二次校验
      this.$refs.myForm.validate(async bool => {
        if (!bool) return this.$message.error('表单数据非法')
        if (this.isEdit) {
          await editRole(this.form)
        } else {
          await addRole(this.form)
        }
        // 重置
        this.getRoleList()
        // console.log('发送ajax')
        this.rightVisible = false // 弹出层关闭
        this.roleDialogVisible = false
      })
    },
    reset () {
      this.$refs.myForm.resetFields()
    },
    showRoleDialog (row) {
      this.isEdit = true
      this.roleDialogVisible = true
      // this.form = { ...row } // 浅拷贝
    }
  }
}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
