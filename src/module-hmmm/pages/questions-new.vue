<template>
  <div class='container'>
    <el-card class="addQuestions" shadow="always">
      试题录入
      <el-divider></el-divider>
      <el-form class="form">
        <el-form-item class="select" label="学科:">
          <el-select v-model="value" placeholder="请选择">
            <el-option>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="select" label="目录:">
          <el-select v-model="value" placeholder="请选择">
            <el-option>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="select" label="企业:">
          <el-select v-model="value" placeholder="请选择">
            <el-option>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="citySelect" label="城市:">
          <el-select v-model="value" placeholder="请选择">
            <el-option>
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="请选择">
            <el-option>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="select" label="方向:">
          <el-select v-model="value" placeholder="请选择">
            <el-option>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="select" label="题型:">
          <el-radio v-model="radioType" label="1">单选</el-radio>
          <el-radio v-model="radioType" label="2">多选</el-radio>
          <el-radio v-model="radioType" label="3">简答</el-radio>
        </el-form-item>
        <el-form-item class="select" label="难度:">
          <el-radio v-model="radio" label="1">单选</el-radio>
          <el-radio v-model="radio" label="2">多选</el-radio>
          <el-radio v-model="radio" label="3">简答</el-radio>
        </el-form-item>
        <el-form-item class="quill" label="题干:">
          <quill-editor
            ref="myQuillEditor"
            v-model="dialogList.articleBody"
            :options="editorOption"
          />
        </el-form-item>
        <el-form-item class="selectXx" label="选项:">
          <div class="item">
            <el-radio v-model="radio" label="1">A：</el-radio>
            <el-input></el-input>
            <el-upload
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :show-file-list="false"
              action="https://jsonplaceholder.typicode.com/posts/"
              class="avatar-uploader">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="avatar-uploader-icon">上传图片</i>
            </el-upload>
          </div>
          <div class="item">
            <el-radio v-model="radio" label="1">B：</el-radio>
            <el-input></el-input>
          </div>
          <div class="item">
            <el-radio v-model="radio" label="1">C：</el-radio>
            <el-input></el-input>
          </div>
          <div class="item">
            <el-radio v-model="radio" label="1">D：</el-radio>
            <el-input></el-input>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序列表，无序列表
  ['blockquote', 'code-block'], // 引用，代码块
  ['image', 'link'] // 上传图片、上传视频
]
export default {
  data () {
    return {
      value: '',
      radio: '1',
      radioType: '1',
      textarea: '',
      editorOption: {
        placeholder: '',
        theme: 'snow', // 主题 snow/bubble
        modules: {
          toolbar: {
            container: toolbarOptions
          }
        }
      },
      dialogList: {
        articleBody: ''
      }
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  .addQuestions {
    margin: 10px;

    .form {
      margin-left: 70px;

      .citySelect {
        /deep/ .el-input__inner {
          width: 200px;
        }
      }

      .el-form-item {
        display: flex;
      }

      .select {
        /deep/ .el-input__inner {
          width: 400px;
        }
      }

    }

    .el-divider {
      background-color: #edf0f6;
      margin: 15px 0;
    }

    .quill {
      /deep/ .el-form-item__content {
        width: 950px;
      }

      /deep/ .ql-editor {
        width: 100%;
        height: 200px;
      }
    }

    .selectXx {
      .item {
        display: block;
        display: flex;
        align-items: center;
        margin-top: 30px;

        /deep/ .el-form-item__content {
          margin-top: 50px;
          display: flex;
          align-items: center;
        }

        /deep/ .el-radio {
          margin-right: 0;
        }

        /deep/ .el-input__inner {
          width: 250px;
        }
      }

      //.avatar-uploader {
      //
      //}

      .avatar-uploader /deep/ .el-upload {
        width: 100px;
        height: 50px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        margin-left: 5px;
      }

      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }

      .avatar-uploader-icon {
        font-size: 14px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }

      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }
  }

}
</style>
