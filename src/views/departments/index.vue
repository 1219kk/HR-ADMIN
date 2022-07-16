<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="用户管理">
            <!-- 用了一个行列布局 -->
            <TreeItem :node="titleObj"></TreeItem>
            <el-tree :data="data" default-expand-all>
              <!-- 使用 scoped slot 会传入两个参数node和data，分别表示当前节点的 Node 对象和当前节点的数据 -->
              <template v-slot="scoped">
                <TreeItem
                  :node="scoped.node"
                  @delDeparment="getDepartmentsList"
                ></TreeItem>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getDepartmentsList } from '@/api/departments'
import TreeItem from './components/TreeItem.vue'

export default {
  filters: {},
  components: { TreeItem },
  data () {
    return {
      data: [{
        label: '',
        children: [{
          label: ''
        }]
      }],
      titleObj: {}
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getDepartmentsList()
  },
  methods: {
    async getDepartmentsList () {
      const res = await getDepartmentsList()
      console.log(res)
      function transferListTree (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = transferListTree(list, item.id)
          }
        })
        return list1
      }
      this.data = transferListTree(res.depts, '')
      this.titleObj = res.depts[0]
      // console.log(res1)
      // this.data = res1
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
