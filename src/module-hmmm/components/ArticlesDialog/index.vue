<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    @close="close"
    width="50%">
    <div v-if="type === 1">
      <div class="title">
        <h2>{{ dialogList.title }}</h2>
        <div>
          <span>{{ dialogList.createTime }}</span>
          <span>{{ dialogList.username }}</span>
          <span class="el-icon-view"></span>
          <span>{{ dialogList.visits }}</span>
        </div>
      </div>
      <div class="content">
        <p v-html="dialogList.articleBody"></p>
      </div>
    </div>
    <div v-else>
      <el-form :model="dialogList" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="文章标题" prop="title">
          <el-input placeholder="请输入文章标题" v-model="dialogList.title"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" prop="articleBody">
          <quill-editor
            ref="myQuillEditor"
            v-model="dialogList.articleBody"
            :options="editorOption"
          />
        </el-form-item>
        <el-form-item label="视频地址">
          <el-input placeholder="请输入视频地址" v-model="dialogList.videoURL"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="confirmTheChanges">确 定</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { add, update } from '@/api/hmmm/articles'

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序列表，无序列表
  ['blockquote', 'code-block'], // 引用，代码块
  ['image', 'link'] // 上传图片、上传视频
]
export default {
  name: 'ArticlesDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: true,
      default: 1
    },
    dialogList: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      rules: {
        title: [
          {
            required: true,
            message: '请输入文章标题',
            trigger: 'blur'
          }
        ],
        articleBody: [
          {
            required: true,
            message: '请输入文章内容',
            trigger: 'blur'
          }
        ]
      },
      editorOption: {
        placeholder: '',
        theme: 'snow', // 主题 snow/bubble
        modules: {
          toolbar: {
            container: toolbarOptions
          }
        }
      }
    }
  },
  created () {

  },
  methods: {
    close () {
      this.$emit('update:dialogVisible', false)
      this.$emit('getArticles')
    },
    // 确认修改
    async confirmTheChanges () {
      await this.$refs.ruleForm.validate()
      try {
        if (this.type === 2) {
          // 新增操作
          await add({
            ...this.dialogList, id: null
          })
          this.$message.success('新增成功')
        } else { // 修改操作
          await update(this.dialogList)
          this.$message.success('修改成功')
        }
      } catch (e) {
        this.$message.error(e.message || '操作失败')
      }
      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  border-bottom: 1px dashed #ccc;
  padding-bottom: 10px;

  h2 {
    margin: 0 0 5px 0;
    padding: 0;
  }

  span {
    margin-left: 10px;
    margin-top: 10px;
  }
}

.content {
  background: #f5f5f5;
  padding: 10px;
  overflow: hidden;
}

/deep/ .ql-editor {
  min-height: 200px;
}
</style>
