<template>
  <!-- 学科新增、修改弹层组件 -->
  <div class="container">
    <el-dialog
      @close="close"
      :visible="subjectsDialogShow"
      :title="`${currentObject.id === null ? '新增' : '修改'} + '学科'`"
    >
      <el-form
        :model="currentObject"
        :rules="rules"
        ref="ruleRef"
        label-width="100px"
      >
        <el-form-item label="学科名称" prop="subjectName">
          <el-input v-model="currentObject.subjectName"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch
            v-model="currentObject.isFrontDisplay"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="end">
        <el-button @click="close" size="mini">取消</el-button>
        <el-button @click="btnOk" size="mini" type="primary">确认</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { add, update } from '@/api/hmmm/subjects.js'
export default {
  name: 'SubjectsAdd',
  props: {
    subjectsDialogShow: {
      type: Boolean,
      default: false
    },
    currentObject: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      rules: {
        subjectName: [
          { required: true, message: '请输入学科名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:subjectsDialogShow', false)
      this.$emit('getList')
      this.$refs.ruleRef.resetFields()
      this.currentObject.subjectName = ''
    },
    async btnOk () {
      try {
        await this.$refs.ruleRef.validate()
        if (this.currentObject.isFrontDisplay === true) {
          this.currentObject.isFrontDisplay = 1
        } else {
          this.currentObject.isFrontDisplay = 0
        }
        if (this.currentObject.id === null) {
          //  新增逻辑
          await add(this.currentObject)
          this.$message.success('新增成功')
        } else {
          // 修改逻辑
          await update(this.currentObject)
          this.$message.success('修改成功')
        }
        this.close()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
