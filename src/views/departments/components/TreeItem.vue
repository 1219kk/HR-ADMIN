<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; padding: 30px 140px; font-size: 14px; width: 100%"
    >
      <el-col>
        <span>{{ node.data ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="onCommand">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!--
      @click.native.stop 阻止冒泡 因为在tree里面写
     -->
    <el-dialog
      :title="title"
      :visible.sync="addDialogVisible"
      width="50%"
      @click.native.stop
      @close="handleAddClose"
    >
      <el-form
        ref="addFormRef"
        label-width="100px"
        :model="addDeparmentForm"
        :rules="rules"
      >
        <!-- 1 -->
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="addDeparmentForm.name"></el-input>
        </el-form-item>
        <!-- 2 -->
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="addDeparmentForm.code"></el-input>
        </el-form-item>
        <!-- 3 -->
        <el-form-item label="部门负责人" prop="manager">
          <!-- <el-input
            v-model="addDeparmentForm.manager"
            placeholder="部门负责人"
          ></el-input> -->
          <el-select
            v-model="addDeparmentForm.manager"
            placeholder="请选择"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 4 -->
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDeparmentForm.introduce"
            type="textarea"
          ></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delDepartment, addDepartment, getDepartmentsList, editDepartment } from '@/api/departments'
import { getSimpleUserList } from '@/api/user'
export default {
  filters: {},
  components: {},
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    const validateName = async (rule, value, callback) => {
      // 拿到所有部门的数据
      const res = await getDepartmentsList()
      if (this.isEdit) {
        // 标题不存在编辑
        const pid = this.node.data.pid// 把当前要编辑的部门父级的id找到了  然后根据这个pid去找所有的兄弟元素
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('名称重复')) : callback
      } else {
        // 待筛选的所有的子部门的pid值
        const id = this.node.data ? this.node.id : ''
        // filter筛选 只要子部门pid和当前部门id一样 说明就是他的子部
        // some 看看有没符合的
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback
      }
    }
    return {
      // 新增Dialog
      addDialogVisible: false,
      // 新增部门
      addDeparmentForm: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: ''// 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3-10之间', trigger: 'blur' },
          { validator: validateName, trigger: 'change' }
        ]
      },
      users: [],
      isEdit: false// 用来判断是在做编辑还是添加
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  created () { },
  methods: {
    async onCommand (key) {
      if (this.users.length === 0) {
        this.getSimpleUserList()
      }
      if (key === 'a') {
        this.addDialogVisible = true
        this.isEdit = false
        this.getSimpleUserList()
        console.log('添加')
      } else if (key === 'b') {
        this.isEdit = true
        this.addDialogVisible = true
        console.log('编辑')
        this.addDeparmentForm = { ...this.node.data }
      } else {
        try {
          await this.$confirm('确定要删除嘛', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          console.log('用户确定了删除')
          await delDepartment(this.node.data.id)
          this.$emit('')
        } catch (err) {
          console.log(err)
          this.$message({
            message: '取消了删除',
            center: true,
            duration: 1000
          })
        }
      }
    },
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      console.log(res)
      this.users = res
    },
    handleAddClose () {
      this.$refs.addFormRef.resetFields()// 表单重置
    },
    async onSubmit () {
      if (this.isEdit) {
        delete this.addDeparmentForm.children // 移除对象的这个属性
        await editDepartment(this.addDeparmentForm)
      } else {
        this.addDeparmentForm.pid = this.node.data ? this.node.data.id : ''
        await addDepartment(this.addDepartmentForm)
      }
      this.addDialogVisible = false
      this.$emit('delDepartment')// 子向父传值
    }

  }
}
</script>

<style scoped lang='scss'>
</style>
