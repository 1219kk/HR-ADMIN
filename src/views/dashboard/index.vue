<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <input
      type="file"
      accept="image/jpg,image/png,image/jpeg,image/gif"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDnW8at11qW3Qfopy29NekkdQ5Jy2EXlv3',
  SecretKey: 'wV1ODzeVskckondJqV9f5MUUUJ6kMq67'
})
console.log(cos)
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    // handleChange (e) {
    //   console.log(e.target)
    //   cos.putObject({
    //     Bucket: 'sky1219-1313062417', /* 创建的储存桶名字 */
    //     Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 ap- */
    //     Key: 'sky1219', /* 随便写的名字 */
    //     StorageClass: 'STANDARD', /* 不改*/
    //     Body: e.target.files[0], // 上传文件对象
    //     onProgress: function (progressData) {
    //       console.log(JSON.stringify(progressData))
    //     }
    //   }, function (err, data) {
    //     console.log(err || data)
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
