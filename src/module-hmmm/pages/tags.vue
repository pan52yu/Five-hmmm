<template>
  <div class='container'>
    <el-card>
      <el-row class="row" :gutter="10" type="flex" justify="space-between">
        <el-col :span="14">
          <el-form ref="form" :model="formData" label-width="80px">
            <el-row :gutter="10">
              <el-col :span="9">
                <el-form-item label="标签名称" prop="tagName">
                  <el-input v-model="formData.tagName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="状态" prop="state">
                  <el-select v-model="formData.state" placeholder="请选择" value="">
                    <el-option label="启用" value="1"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-button @click="remove">清除</el-button>
                <el-button type="primary" @click="searchArticles">搜索</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-edit" type="success" @click="addSkills">新增标签</el-button>
        </el-col>
      </el-row>
      <el-alert
        type="info"
        :closable="false"
        show-icon>
        <template>
          数据一共{{ total }}条
        </template>
      </el-alert>
      <!--   表格区域   -->
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column type="index" label="序号" width="80px"></el-table-column>
        <el-table-column
          prop="subjectName"
          label="所属学科">
        </el-table-column>
        <el-table-column
          prop="tagName"
          label="标签名称">
        </el-table-column>
        <el-table-column
          prop="username"
          label="创建者">
        </el-table-column>
        <el-table-column
          prop="addDate"
          label="创建日期">
          <template v-slot="{row}">
            {{ row.addDate | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态">
          <template v-slot="scope">
            {{ scope.row.state === 1 ? '已启用' : '已禁用' }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="250">
          <template v-slot="scope">
            <el-button @click="changeState(scope.row)" type="text" size="small"> {{
                scope.row.state === 1 ? '禁用' : '启用'
              }}
            </el-button>
            <el-button :disabled="scope.row.state === 1" @click="modifyArticles(scope.row)" type="text" size="small">
              修改
            </el-button>
            <el-button :disabled="scope.row.state === 1" @click="delArticles(scope.row)" type="text" size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--   分页   -->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="formData.page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="formData.pagesize"
          layout=" prev, pager, next, sizes, jumper"
          background
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!-- 修改新增目录 -->
    <TagsDialog @getArticles="getArticles" :subjectList="subjectList"
                :dialogVisible.sync="dialogVisible" :dialogList="dialogList"
                :title="title"></TagsDialog>
  </div>
</template>

<script>
import { changeState, list, remove } from '@/api/hmmm/tags'
import TagsDialog from '@/module-hmmm/components/TagsDialog'
import { simple } from '@/api/hmmm/subjects'

export default {
  name: 'Tags',
  components: { TagsDialog },
  data () {
    return {
      formData: {
        page: 1,
        pagesize: 10
      },
      total: 0,
      tableData: [],
      dialogVisible: false,
      title: '',
      dialogList: {},
      subjectList: []
    }
  },
  created () {
    this.getArticles()
    this.simple()
  },
  methods: {
    // 学科简单列表
    async simple () {
      const { data } = await simple()
      console.log(data)
      this.subjectList = data
    },
    // 获取文章列表
    async getArticles () {
      const { data } = await list(this.formData)
      this.tableData = data.items
      this.total = data.counts
    },
    // 修改
    modifyArticles (row) {
      console.log(row)
      this.title = '修改目录'
      this.dialogList = row
      this.dialogVisible = true
    },
    //  新增技巧
    addSkills () {
      this.title = '新增目录'
      this.dialogList = {}
      this.dialogVisible = true
    },
    // 改变状态
    async changeState (row) {
      console.log(row.state)
      console.log(row.id)
      try {
        if (row.state === 1) {
          row.state = 0
        } else {
          row.state = 1
        }
        await changeState({ state: row.state, id: row.id })
        await this.getArticles()
        this.$message.success('操作成功')
      } catch (e) {
        console.log(e)
      }
    },
    // 删除
    async delArticles (row) {
      try {
        const flag = await this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(e => {
          console.log(e)
        })
        if (flag === 'confirm') {
          await remove(row)
          this.$message.success('删除成功')
          await this.getArticles()
        }
      } catch (e) {
        this.$message.error('删除失败!')
      }
    },
    // 每页显示条数
    handleSizeChange (newSize) {
      this.formData.pagesize = newSize
      this.getArticles()
    },
    // 分页
    handleCurrentChange (newPage) {
      this.formData.page = newPage
      this.getArticles()
    },
    //  清楚
    remove () {
      this.$refs.form.resetFields()
      this.getArticles()
    },
    //  搜索
    searchArticles () {
      this.getArticles()
    }
  }
}
</script>

<style scoped lang='less'>
.el-card {
  margin: 10px 20px;
  padding: 20px;
  padding-top: 0;
  min-width: 1200px;
}

.page {
  position: relative;
  height: 40px;
}

.el-pagination {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 20px;
}

.row {
  padding-right: 20px;
}

/deep/ .el-card__body {
  padding-right: 0;
}
</style>
