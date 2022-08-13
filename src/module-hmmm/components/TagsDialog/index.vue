<template>
  <el-dialog
    title="提示"
    @close="close"
    :visible="dialogVisible"
    width="30%">
    <el-form :model="dialogList" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item v-if="!status" label="所属学科">
        <el-select v-model="dialogList.subjectID" placeholder="请选择" value="">
          <el-option v-for="item in subjectList" :key="item.id" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目录名称" prop="name">
        <el-input placeholder="请输入目录名称" v-model="dialogList.tagName"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="editTags">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import { add, update } from '@/api/hmmm/tags'

export default {
  name: 'TagsDialog',
  props: {
    currentId: {
      type: Number || null,
    },
    status: {
      type: Boolean,
      default: true
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    dialogList: {
      type: Object
    },
    subjectList: {
      type: Array
    }
  },
  data() {
    return {
      rules: {
        name: ''
      }
    }
  },
  created() {
  },
  methods: {
    close() {
      this.$emit('update:dialogVisible', false)
      this.$emit('getArticles')
    },
    async editTags() {
      try {
        if (this.dialogList.id) {
          await update(this.dialogList)
          this.$message.success('修改成功')
        } else {
          if (this.status === true) {
            this.dialogList.subjectID = this.currentId
          }
          await add({ ...this.dialogList, id: null })
          this.$message.success('新增成功')
        }
      } catch (e) {
        this.$message.error(e.message || '操作失败')
      }
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style lang="less" scoped></style>
