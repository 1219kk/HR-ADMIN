<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      accept="image/jpg,image/png,image/jpeg,image/gif"
      :limit="limit"
      :on-change="handelChange"
      :class="{ hidden: filesList.length === limit }"
      :file-list="filesList"
      :http-request="handleRequest"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-progress :percentage="percent"></el-progress>
    <el-dialog :visible.sync="dialogVisible" title="预览">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDnW8at11qW3Qfopy29NekkdQ5Jy2EXlv3',
  SecretKey: 'wV1ODzeVskckondJqV9f5MUUUJ6kMq67'
})
console.log(cos)
export default {
  filters: {},
  components: {},
  props: {
    limit: {
      type: Number,
      default: 1
    }

  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      filesList: [],
      percent: 0
    }
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    handleRemove (file) {
      this.filesList = this.filesList.filter(item => item.uid !== file.uid)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      console.log(file)
    },
    // 图片个数 上传的list
    handelChange (file, filesList) {
      console.log(filesList)
      this.filesList = filesList
    },
    handleRequest (obj) {
      var that = this// 把外面this赋值给that这个变量
      // 用腾讯云cos上传
      console.log(obj)
      cos.putObject({
        Bucket: 'sky1219-1313062417', /* 创建的储存桶名字 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 ap- */
        Key: Date.now() + '~' + obj.file.name, /* 随便写的名字 */
        StorageClass: 'STANDARD', /* 不改*/
        Body: obj.file, // 上传文件对象
        onProgress: function (progressData) {
          // that 可以拿到外面的this
          that.percent = Math.ceil(progressData.loaded / progressData.total * 100)
          // console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        console.log(err || data)
        this.src = data.Location
      })
    }
  }

}
</script>

<style scoped lang="scss">
/* // 原理：hidden类名是动态绑定 */
.hidden ::v-deep .el-upload--picture-card {
  display: none;
}
</style>
