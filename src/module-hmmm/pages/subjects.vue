<template>
  <div class="listBox">
    <el-card>
      <!-- 上面搜索区域 -->
      <el-row type="flex" :gutter="20" justify="space-between">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-form>
            学科名称
            <el-input
              style="width: 200px"
              size="small"
              v-model.trim="formDate.subjectName"
              placeholder="根据用户名搜索"
            ></el-input>
          </el-form>
        </el-col>
        <!-- 搜索取消按钮 -->
        <el-col>
          <el-button size="small" @click="clearBtn">清除</el-button>
          <el-button size="small" type="primary" @click="usersBtnOk">{{
              $t('table.search')
            }}
          </el-button>
        </el-col>
        <!-- 新增用户按钮 -->
        <el-col :span="3">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="small"
            @click="addClick"
          >新增学科
          </el-button
          >
        </el-col>
      </el-row>
      <!-- 记录提示栏 -->
      <el-row>
        <el-alert
          class="info"
          title="共11条记录"
          type="info"
          show-icon
          :closable="false"
        >
        </el-alert>
      </el-row>

      <!-- 表格区域 -->
      <el-row>
        <template>
          <el-table
            :data="listTableData"
            stripe
            style="width: 100%"
            :header-cell-style="{
              backgroundColor: '#f4f4f5',
              color: '#909399',
              'border-bottom': '2px solid #e8e8e8'
            }"
          >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="subjectName" label="学科名称">
            </el-table-column>
            <el-table-column prop="username" label="创建者"></el-table-column>
            <el-table-column width="180px" label="创建日期">
              <template v-slot="{ row }">
                {{ row.addDate | parseTimeByString }}
              </template>
            </el-table-column>
            <el-table-column width="120px" label="前台是否显示">
              <template v-slot="{ row }">
                <span v-if="row.isFrontDisplay === 1">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column prop="twoLevelDirectory" label="二级目录">
            </el-table-column>
            <el-table-column prop="tags" label="标签"></el-table-column>
            <el-table-column prop="totals" label="题目数量"></el-table-column>
            <el-table-column label="操作" width="280px">
              <template v-slot="{ row }">
                <el-link
                  :underline="false"
                  type="primary"
                  @click="$router.push({name:'subjects-directorys',params:{status:'true',id:row.id}})"
                >学科分类
                </el-link
                >
                <el-link
                  :underline="false"
                  type="primary"
                  @click="$router.push({name:'subjects-tags',params:{status:'true',id:row.id}})"
                >学科标签
                </el-link
                >
                <el-link :underline="false" type="primary" @click="editBtn(row)"
                >修改
                </el-link
                >
                <el-link
                  :underline="false"
                  type="primary"
                  @click="delBtn(row.id)"
                >删除
                </el-link
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-row>
      <!-- 分页器区域 -->
      <el-row type="flex" justify="center">
        <el-pagination
          background
          @size-change="usersHandleSizeChange"
          @current-change="usersHandleCurrentChange"
          :current-page="formDate.page"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="formDate.pagesize"
          layout=" prev, pager, next, sizes, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 新增、修改学科弹层 -->
    <subjects-add
      @getList="getList"
      :subjectsDialogShow.sync="subjectsDialogShow"
      :currentObject="currentObject"
    ></subjects-add>
  </div>
</template>

<script>
import { list, remove } from '@/api/hmmm/subjects.js'
import subjectsAdd from '../components/subjects-add.vue'
// import { parseTimeByString } from '@/filters'
export default {
  components: { subjectsAdd },
  name: 'List',
  data() {
    return {
      currentObject: {},
      subjectsDialogShow: false,
      total: 0,
      formDate: {
        pagesize: 10,
        page: 1,
        subjectName: ''
      },
      listTableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await list(this.formDate)
      // console.log(res)
      if (res.status !== 200) {
        return this.$message.error('获取学科列表失败')
      }
      this.listTableData = res.data.items
      // console.log(this.listTableData)
      this.total = res.data.counts
    },
    clearBtn() {
      this.formDate.subjectName = ''
      this.getList()
    },
    usersBtnOk() {
      this.getList()
    },
    addClick() {
      this.currentObject = {
        id: null,
        isFrontDisplay: true
      }
      this.subjectsDialogShow = true
    },
    usersHandleSizeChange(page) {
      this.formDate.pagesize = page
      this.getList()
    },
    usersHandleCurrentChange(page) {
      this.formDate.page = page
      this.getList()
    },
    editBtn(row) {
      row.isFrontDisplay === 1
        ? (row.isFrontDisplay = true)
        : (row.isFrontDisplay = false)
      this.currentObject = row
      this.subjectsDialogShow = true
    },
    async delBtn(id) {
      const res = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }
      ).catch(() => {
        this.$message.info('已取消操作')
      })
      if (res === 'confirm') {
        await remove({ id: id })
        this.$message.success('删除成功')
        this.getList()
      }
    }
  }
}
</script>

<style scoped lang="less">
.listBox {
  margin: 20px;
}

.info {
  margin: 20px 0;
}

.el-link {
  margin-right: 10px;
}
</style>
