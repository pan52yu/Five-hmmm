<template>
  <div class='container'>
    <el-card class="addQuestions" shadow="always">
      试题录入
      <el-divider></el-divider>
      <el-form ref="form" :model="formData" :rules="rules" class="form">
        <el-form-item class="select" label="学科:" prop="subjectID">
          <el-select v-model="formData.subjectID" placeholder="请选择" @change="subjectChange">
            <el-option
              v-for="item in subjectList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="select" label="目录:" prop="catalogID">
          <el-select v-model="formData.catalogID" placeholder="请选择">
            <el-option
              v-for="item in catalogList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="select" label="企业:" prop="enterpriseID">
          <el-select v-model="formData.enterpriseID" placeholder="请选择">
            <el-option
              v-for="item in enterpriseList"
              :key="item.id"
              :label="item.company"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="citySelect" label="城市:" prop="province">
          <el-select v-model="formData.province" placeholder="请选择" @change="provinceCity">
            <el-option
              v-for="item in provincesList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-select v-model="formData.city" placeholder="请选择">
            <el-option
              v-for="item in cityList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="select" label="方向:" prop="direction">
          <el-select v-model="formData.direction" placeholder="请选择">
            <el-option
              v-for="item in directionList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="select" label="题型:" prop="questionType">
          <el-radio v-model="formData.questionType" label="1">单选</el-radio>
          <el-radio v-model="formData.questionType" label="2">多选</el-radio>
          <el-radio v-model="formData.questionType" label="3">简答</el-radio>
        </el-form-item>
        <el-form-item class="select" label="难度:" prop="difficulty">
          <el-radio v-model="formData.difficulty" label="1">简单</el-radio>
          <el-radio v-model="formData.difficulty" label="2">一般</el-radio>
          <el-radio v-model="formData.difficulty" label="3">困难</el-radio>
        </el-form-item>
        <el-form-item class="quill" label="题干:" prop="question">
          <quill-editor
            ref="myQuillEditor"
            v-model="formData.question"
            :options="editorOption"
          />
        </el-form-item>
        <el-form-item v-if="formData.questionType != '3'" class="selectXx" label="选项:">
          <el-row v-for="(item,index) in formData.options" :key="index" style="margin-bottom: 10px;">
            <el-col style="display:flex; align-items: center">
              <el-radio v-if="formData.questionType === '1'" v-model="itemB" :label="item.code" @change="radioChange">{{
                  item.code
                }}：
              </el-radio>
              <el-checkbox v-else v-model="item.isRight">{{ item.code }}：</el-checkbox>
              <el-input v-model="item.title"></el-input>
              <el-upload
                :show-file-list="false"
                action="https://jsonplaceholder.typicode.com/posts/"
                class="avatar-uploader">
                <div class="updateImg">上传图片</div>
                <!--      <img v-if="imageUrl" :src="imageUrl" class="avatar">-->
                <i class="el-icon-circle-close"></i>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
        <div v-if="formData.questionType != '3'">
          <el-button :disabled="formData.questionType === '1'" style="margin-left: 75px;" type="danger" @click="addBtn">
            +增加选项与答案
          </el-button>
        </div>
        <el-form-item class="select" label="解析视频:" style="margin-top: 10px;">
          <el-input v-model="formData.videoURL"></el-input>
        </el-form-item>
        <el-form-item class="quill" label="答案解析:" prop="answer">
          <quill-editor
            ref="myQuillEditor"
            v-model="formData.answer"
            :options="editorOption"
          />
        </el-form-item>
        <el-form-item class="textarea" label="题目备注:">
          <el-input
            v-model="formData.remarks"
            :rows="5"
            placeholder="请输入内容"
            type="textarea">
          </el-input>
        </el-form-item>
        <el-form-item class="select" label="试题标签:">
          <el-select v-model="tagVal" multiple placeholder="请选择试题标签" @change="seleChange">
            <el-option
              v-for="item in tagsList"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button v-if="$route.query.id" style="margin-left: 140px;" type="success" @click="editOk">确认修改</el-button>
      <el-button v-else style="margin-left: 140px;" type="primary" @click="btnOk">确认提交</el-button>
    </el-card>
  </div>
</template>

<script>
import { simple } from '@/api/hmmm/subjects'
import { simples } from '@/api/hmmm/directorys'
import { simpl } from '@/api/hmmm/tags'
import { list } from '@/api/hmmm/companys'
import { citys, provinces } from '@/api/hmmm/citys'
import { add, detail, update } from '@/api/hmmm/questions'

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序列表，无序列表
  ['blockquote', 'code-block'], // 引用，代码块
  ['image', 'link'] // 上传图片、上传视频
]
export default {
  data () {
    return {
      tagVal: null,
      itemB: '',
      radio: null,
      radioOptions: [],
      provincesList: [],
      subjectList: [],
      catalogList: [],
      tagsList: [],
      cityList: [],
      enterpriseList: [],
      directionList: [
        {
          label: 'o2o',
          value: 'o2o'
        },
        {
          label: '外包服务',
          value: '外包服务'
        },
        {
          label: '企业服务',
          value: '企业服务'
        },
        {
          label: '互联网金融',
          value: '互联网金融'
        },
        {
          label: '企业咨询',
          value: '企业咨询'
        },
        {
          label: '互联网',
          value: '互联网'
        },
        {
          label: '电子商务',
          value: '电子商务'
        },
        {
          label: '其他',
          value: '其他'
        }
      ],
      formData: {
        answer: '', // 答案解析  带HTML标签
        catalogID: null, // 目录
        city: '', // 区级
        difficulty: '1', // 难度
        direction: '', // 方向
        enterpriseID: null, // 企业
        options: [
          { isRight: false, code: 'A', title: '', img: '' },
          { isRight: false, code: 'B', title: '', img: '' },
          { isRight: false, code: 'C', title: '', img: '' },
          { isRight: false, code: 'D', title: '', img: '' }
        ], // 选项
        province: '', // 城市
        question: '', // 题干 带html标签
        questionType: '1', // 题型
        remarks: '', // 备注
        subjectID: null, // 学科
        tags: '', // 标签
        videoURL: '' // 视频
      },
      rules: {
        subjectID: [
          {
            required: true,
            message: '请选择学科'
          }
        ],
        catalogID: [
          {
            required: true,
            message: '请选择目录'
          }
        ],
        enterpriseID: [
          {
            required: true,
            message: '请选择企业'
          }
        ],
        province: [
          {
            required: true,
            message: '请选择城市'
          }
        ],
        direction: [
          {
            required: true,
            message: '请选择方向'
          }
        ],
        answer: [
          {
            required: true,
            message: '请輸入答案解析'
          }
        ],
        question: [
          {
            required: true,
            message: '请輸入题干'
          }
        ],
        questionType: [
          {
            required: true,
            message: '请选择题型'
          }
        ],
        difficulty: [
          {
            required: true,
            message: '请选择難度'
          }
        ]
      },
      value: '',
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
      },
      radioA: ['A', 'B', 'C', 'D', 'E', 'F', 'J', 'H', 'I'],
      val: '',
      editList: {}
    }
  },
  methods: {
    async editOk () {
      await this.$refs.form.validate()
      await update(this.formData)
      await this.$router.push('list')
      this.$message.success('修改成功')
    },
    seleChange (val) {
      this.val = val.join(',')
      console.log(this.tagVal)
      console.log(this.val)
      this.formData.tags = this.val
    },
    async btnOk () {
      await this.$refs.form.validate()
      await add(this.formData)
      await this.$router.push('list')
      this.$message.success('添加试题成功')
    },
    radioChange (val) {
      console.log(val)
      this.formData.options.forEach(item => {
        item.isRight = item.code === val
      })
    },
    addBtn () {
      const index = this.formData.options.length
      this.formData.options.push({ isRight: false, code: this.radioA[index], title: '', img: '' })
    },
    async list () {
      const res = await list({
        pagesize: 10000
      })
      console.log(res)
      this.enterpriseList = res.data.items
    },
    async simple () {
      const res = await simple()
      console.log(res)
      this.subjectList = res.data
    },
    async subjectChange (val) {
      const res = await simples({
        subjectID: val
      })
      const { data } = await simpl({
        subjectID: val
      })
      this.tagsList = data
      this.catalogList = res.data
    },
    provinceCity (val) {
      console.log(val)
      this.cityList = citys(val)
    },
    async editCurr () {
      if (this.$route.query.id) {
        console.log(11243)
        const res = await detail({
          id: this.$route.query.id
        })
        console.log(res)
        this.formData = res.data
      }
    }
  },
  created () {
    this.editCurr()
    this.simple()
    this.list()
    this.provincesList = provinces()
    console.log(this.$route.query.id)
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
        margin-left: 30px;

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

      .avatar-uploader /deep/ .el-upload {
        width: 100px;
        height: 50px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        //overflow: hidden;
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

    .textarea {
      /deep/ .el-textarea {
        width: 400px;
      }
    }

    /deep/ .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
    }

    /deep/ .updateImg {
      width: 100px;
      height: 60px;
      text-align: center;
      margin-top: 6px;
    }

    /deep/ .el-icon-circle-close {
      position: absolute;
      top: -4px;
      right: -8px;
      font-size: 18px;
      color: rgb(153, 153, 153);
    }

    /deep/ .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
  }

}
</style>
