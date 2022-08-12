<template>
  <div class='container'>
    <el-dialog
      :visible="dialogVisible"
      title="题目预览"
      width="70%"
      @close="close">
      <el-row :gutter="20">
        <el-col :span="6">
          <p>【题型】：</p>
        </el-col>
        <el-col :span="6">
          <p>【编号】：</p>
        </el-col>
        <el-col :span="6">
          <p>【难度】：</p>
        </el-col>
        <el-col :span="6">
          <p>【标签】：</p>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <p>【学科】：</p>
        </el-col>
        <el-col :span="6">
          <p>【目录】：</p>
        </el-col>
        <el-col :span="6">
          <p>【方向】：</p>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>【题干】：</p>
          <p>选项：（以下选中的选项为正确答案）</p>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>【参考答案】：
            <el-button type="danger">视频答案预览</el-button>
          </p>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>【答案解析】：
          </p>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>【题目备注】：
          </p>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'questions-preview',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    currentItem: {
      type: Object,
      default: () => {
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  .el-divider {
    background-color: #9a9a9a;
    margin: 15px 0;
  }
}
</style>
