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
      title="新增部门"
      :visible.sync="addDialogVisible"
      width="50%"
      @click.native.stop
    >
      <el-form label-width="100px">
        <!-- 1 -->
        <el-form-item label="部门名称">
          <el-input placeholder="1-50个字符"></el-input>
        </el-form-item>
        <!-- 2 -->
        <el-form-item label="部门编码">
          <el-input placeholder="1-50个字符"></el-input>
        </el-form-item>
        <!-- 3 -->
        <el-form-item label="部门负责人">
          <el-input placeholder="部门负责人"></el-input>
        </el-form-item>
        <!-- 4 -->
        <el-form-item label="部门介绍">
          <el-input placeholder="1-300个字符"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delDepartment } from '@/api/departments'
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
    return {
      // 新增Dialog
      addDialogVisible: false,
      // 新增部门
      addDeparmentForm: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: ''// 部门介绍
      }
    }
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    async onCommand (key) {
      if (key === 'a') {
        this.addDialogVisible = true
        console.log('添加')
      } else if (key === 'b') {
        console.log('编辑')
      } else {
        try {
          await this.$confirm('确定要删除嘛', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          console.log('用户确定了删除')
          await delDepartment(this.node.data.id)
          this.$emit('delDeparment')
        } catch (err) {
          console.log(err)
          this.$message({
            message: '取消了删除',
            center: true,
            duration: 1000
          })
        }
      }
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
