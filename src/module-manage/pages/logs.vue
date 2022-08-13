<template>
  <div class="logs">
    <el-card>
      <el-alert type="info" show-icon>
        <template>
          共{{ total }}条数据
        </template>
      </el-alert>
      <el-table :header-cell-style="{
          'background-color': '#fafafa',
          'border-bottom': '2px solid #e8e8e8',
          'text-align': 'center'
        }" :cell-style="{
          'text-align': 'center',
          padding: '6px',
          'font-size': '13px',
        }" :data="tableData" style="width: 100%">
        <el-table-column prop="type" label="操作类型" width="280">
        </el-table-column>
        <el-table-column prop="reviewer" label="操作人" width="300">
        </el-table-column>
        <el-table-column prop="title" label="执行结果" width="300">
        </el-table-column>
        <el-table-column prop="display_time" label="操作时间" width="300">
        </el-table-column>
        <el-table-column prop="forecast" label="描述"></el-table-column>
      </el-table>
      <!--   分页   -->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="form.pagesize"
          layout=" prev, pager, next, sizes, jumper"
          background
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { list } from '@/api/example/table'

export default {
  data () {
    return {
      tableData: [], // 表格数据
      // 列表查询参数
      form: {
        page: 1,
        pagesize: 20
      },
      // 总条数
      total: null

    }
  },
  created () {
    this.list()
  },
  methods: {
    // 列表
    async list () {
      try {
        const { data } = await list(this.form)
        console.log(data)
        this.tableData = data.items
        this.total = data.total
      } catch (e) {
        this.$message.error(e.message || '获取列表失败')
      }
    },
    // 每页显示条数
    handleSizeChange (newSize) {
      this.form.pagesize = newSize
      this.getArticles()
    },
    // 分页
    handleCurrentChange (newPage) {
      this.form.page = newPage
      this.getArticles()
    }
  }
}
</script>

<style scoped lang="less">
.logs {
  margin: 20px 20px;
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
</style>
