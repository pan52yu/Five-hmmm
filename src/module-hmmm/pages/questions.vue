<template>
  <div class='container'>
    <el-card class="cardList" shadow="always">
      <el-row :gutter="20">
        <el-col :span="21">
          <div class="grid-content bg-purple">
            <p>说明：目前支持学科和关键字条件筛选</p>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <el-button class="el-icon-edit addBtn" size="small" type="success"> &nbsp;新增试题</el-button>
          </div>
        </el-col>
      </el-row>
      <el-form ref="form" class="form">
        <el-row :gutter="20">
          <el-col :span="6" class="option">
            <el-form-item class="two" label="学科">
              <el-select v-model="formData.subjectID" placeholder="请选择" @change="changeSub">
                <el-option
                  v-for="item in subjectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="option">
            <el-form-item label="二级目录">
              <el-select v-model="formData.catalogID" placeholder="请选择">
                <el-option
                  v-for="item in catalogList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="option">
            <el-form-item label="标签">
              <el-select v-model="formData.tags" placeholder="请选择">
                <el-option
                  v-for="item in tagsList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="inputInput">
            <el-form-item label="关键字">
              <el-input v-model="formData.keyword" placeholder="根据题干搜索"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" class="option">
            <el-form-item label="试题类型">
              <el-select v-model="formData.questionType" placeholder="请选择">
                <el-option
                  v-for="item in questionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="option">
            <el-form-item class="two" label="难度">
              <el-select v-model="formData.difficulty" placeholder="请选择">
                <el-option
                  v-for="item in difficultyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="option">
            <el-form-item label="方向">
              <el-select v-model="formData.direction" placeholder="请选择">
                <el-option
                  v-for="item in directionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="option">
            <el-form-item label="录入人">
              <el-select v-model="formData.creatorID" placeholder="请选择">
                <el-option
                  v-for="item in userSimpleList"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" class="inputInput">
            <el-form-item label="题目备注">
              <el-input v-model="formData.remarks"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="inputInput">
            <el-form-item label="企业简称">
              <el-input v-model="formData.shortName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="optionCity">
            <el-form-item label="城市">
              <el-select v-model="formData.province" placeholder="请选择" @change="provinceCity">
                <el-option
                  v-for="item in provincesList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <el-select v-model="formData.city" class="optionCity2" placeholder="请选择">
                <el-option
                  v-for="item in cityList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="searchBtn">
            <el-button size="small" @click="close">清除</el-button>
            <el-button size="small" type="primary" @click="searchBtn">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-alert
        :closable="false"
        class="form"
        show-icon
        type="info">
        <template #title>
          <span>数据一共{{ tableData.length }}条</span>
        </template>
      </el-alert>
      <el-table
        :cell-style="{'text-align': 'center'}"
        :data="tableData"
        :header-cell-style="{'text-align': 'center','border-bottom':'2px solid #e8e8e8'}"
        class="form"
        style="width: 100%">
        <el-table-column
          label="试题编号"
          prop="number"
          width="180">
        </el-table-column>
        <el-table-column
          label="学科"
          prop="subject"
          width="120">
        </el-table-column>
        <el-table-column
          label="目录"
          prop="catalog"
          width="120">
        </el-table-column>
        <el-table-column
          :formatter="formatterType"
          label="题型"
          prop="questionType"
          width="120">
        </el-table-column>
        <el-table-column
          label="题干"
          prop="question"
          width="300">
          <template v-slot="{row}">
            <p v-html="row.question">{{ row.question }}</p>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          label="录入时间"
          prop="addDate"
          width="200">
        </el-table-column>
        <el-table-column
          :formatter="formatterDifficulty"
          label="难度"
          prop="difficulty"
          width="120">
        </el-table-column>
        <el-table-column
          label="录入人"
          prop="creator"
          width="180">
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="{row}">
            <el-button circle class="el-icon-view btn-view" size="small" @click="preview(row)"></el-button>
            <el-button circle class="el-icon-edit btn-edit" size="small"></el-button>
            <el-button circle class="el-icon-delete btn-delete" size="small" @click="dele(row)"></el-button>
            <el-button circle class="el-icon-check btn-check" size="small" @click="check(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="formData.page"
        :page-size="formData.pagesize"
        :page-sizes="[5, 10, 20, 50]"
        :total="total"
        background
        layout="prev, pager, next, sizes,jumper"
        style="margin-top: 20px; text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>
    <questions-preview :currentItem="currentItem" :dialogVisible.sync="dialogVisible"></questions-preview>
  </div>
</template>

<script>
import { simple } from '@/api/hmmm/subjects'
import { simples } from '@/api/hmmm/directorys'
import { simpl } from '@/api/hmmm/tags'
import { userSimple } from '@/api/base/users'
import { citys, provinces } from '@/api/hmmm/citys'
import { choiceAdd, detail, list, remove } from '@/api/hmmm/questions'
import QuestionsPreview from '@/module-hmmm/components/questions-preview'

export default {
  components: { QuestionsPreview },
  data () {
    return {
      dialogVisible: false,
      total: null,
      tableData: [],
      pages: {},
      formData: {
        pagesize: 5,
        page: 1,
        subjectID: '', // 学科
        difficulty: '', // 难度
        questionType: '', // 试题类型
        tags: '', // 标签
        province: '', // 城市
        city: '', // 区级
        keyword: '', // 关键字
        remarks: '', // 备注
        shortName: '', // 企业简称
        direction: '', // 方向
        creatorID: '', // 录入人
        catalogID: '' // 二级目录
      },
      subjectList: [],
      catalogList: [],
      tagsList: [],
      questionList: [
        {
          label: '单选',
          value: '1'
        },
        {
          label: '多选',
          value: '2'
        },
        {
          label: '简答',
          value: '3'
        }
      ],
      difficultyList: [
        {
          label: '简单',
          value: '1'
        },
        {
          label: '一般',
          value: '2'
        }, {
          label: '困难',
          value: '3'
        }
      ],
      // 'o2o', '外包服务', '企业服务', '互联网金融', '企业咨询', '互联网', '电子商务', '其他'
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
      userSimpleList: [],
      provincesList: [],
      cityList: [],
      currentItem: {}
    }
  },
  created () {
    this.list()
    this.simple()
    this.userSimple()
    this.provincesList = provinces()
  },
  methods: {
    // 日期格式化
    dateFormat (row, column, cellValue, index) {
      console.log(row, column, cellValue, index)
      const daterc = row[column.property]
      if (daterc != null) {
        var date = new Date(daterc)
        var year = date.getFullYear()
        /* 在日期格式中，月份是从0开始，11结束，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        // 拼接
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
      }
    },
    // 删除
    dele (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await remove(row)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.list()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 加入精选
    check (curr) {
      console.log(curr)
      this.$confirm('此操作将该题目加入精选, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        // curr.push(choiceState:0)
        await choiceAdd({
          id: curr.id,
          choiceState: 1
        })
        await this.list()
        this.$message({
          type: 'success',
          message: '加入精选成功!'
        })
      }).catch(() => {
        console.log(111)
      })
    },
    // 预览
    async preview (current) {
      this.dialogVisible = true
      const res = await detail({
        id: current.id
      })
      this.currentItem = res.data
    },
    // 清除
    close () {
      this.formData = {
        subjectID: '', // 学科
        difficulty: '', // 难度
        questionType: '', // 试题类型
        tags: '', // 标签
        province: '', // 城市
        city: '', // 区级
        keyword: '', // 关键字
        remarks: '', // 备注
        shortName: '', // 企业简称
        direction: '', // 方向
        creatorID: '', // 录入人
        catalogID: '' // 二级目录
      }
      this.list()
    },
    // 表格难度格式化
    formatterDifficulty (a, b, cellValue) {
      const useType = this.difficultyList.find((item) => item.value === cellValue)?.label
      return useType || ''
    },
    // 表格题型格式化
    formatterType (a, b, cellValue) {
      const useType = this.questionList.find((item) => item.value === cellValue)?.label
      return useType || ''
    },
    // 城市
    provinceCity (val) {
      console.log(val)
      this.cityList = citys(val)
    },
    // 录入人
    async userSimple () {
      const res = await userSimple()
      console.log(res)
      this.userSimpleList = res.data
    },
    // 学科选择
    async changeSub (val) {
      const res = await simples({ subjectID: val })
      const { data } = await simpl({ subjectID: val })
      this.tagsList = data
      this.catalogList = res.data
    },
    // 学科列表
    async simple () {
      const res = await simple()
      this.subjectList = res.data
    },
    // 表格列表
    async list () {
      const formList = {}
      for (const key in this.formData) {
        if (this.formData[key]) {
          formList[key] = this.formData[key]
        }
      }
      const res = await list(formList)
      this.tableData = res.data.items
      this.total = res.data.counts
    },
    // 每页多少条
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.formData.pagesize = val
      this.list()
    },
    // 当前页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.formData.page = val
      this.list()
    },
    searchBtn () {
      this.list()
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  .cardList {
    margin: 10px;

    /deep/ .el-card__body {
      padding: 10px;
    }

    .grid-content {
      p {
        margin-left: 10px;
        font-size: 12px;
        color: #ffc6da;
      }
    }

    .addBtn {
      margin-top: 10px;
    }

    .option {
      /deep/ .el-input__inner {
        width: 180px;
      }

      .two {
        margin-left: 30px;
      }
    }

    .form {
      margin: 20px;
    }

    .inputInput {
      .el-form-item {
        display: flex;
      }

      /deep/ .el-input__inner {
        width: 180px;
      }
    }

    .optionCity {
      /deep/ .el-input__inner {
        width: 90px;
      }

      .optionCity2 {
        /deep/ .el-input__inner {
          width: 87px;
          margin-left: 5px;
        }
      }
    }

    .btn-view {
      color: #83aeff;
      background-color: #ecf5ff;
      border: solid 1px #b3d8ff;
    }

    .btn-check {
      color: #ecbe90;
      background-color: #fdf6ec;
      border: solid 1px #f6e0bf;
    }

    .btn-delete {
      color: #f57c7b;
      background-color: #fef0f0;
      border: solid 1px #fac5c5;
    }

    .btn-edit {
      color: #7dc967;
      background-color: #f0f9eb;
      border: solid 1px #c8e9b8;
    }
  }
}
</style>
