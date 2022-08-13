<template>
  <div class="menusBox">
    <el-card>
      <el-row style="margin-bottom: 20px;" type="flex" justify="end">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="small"
          @click="menusAddClick">添加菜单
        </el-button>
      </el-row>
      <el-table
        :header-cell-style="{
          'background-color': '#fafafa',
          'border-bottom': '2px solid #e8e8e8',
        }"
        row-key="id"
        default-expand-all
        :tree-props="{children: 'childs', hasChildren: 'hasChilds'}"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="标题"
          width="220">
          <template v-slot="{row}">
            <i v-if="row.is_point" class="el-icon-view"></i>
            <i v-else-if="row.childs && !row.points" class="el-icon-folder-opened"></i>
            <i v-else class="el-icon-folder"></i>
            {{ row.title }}
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          label="权限点代码">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template v-slot="{row}">
            <el-button @click="edit(row)" type="primary" plain icon="el-icon-edit" circle></el-button>
            <el-button @click="remove(row)" type="danger" plain icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { list, remove } from '@/api/base/menus'

export default {
  name: 'Menus',
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      const { data } = await list()
      this.tableData = data
      this.tableData = this.treeData(data)
    },
    // 处理列表树形数据
    treeData (arr) {
      const tree = []
      // eslint-disable-next-line no-unused-expressions
      arr?.forEach(item => {
        if (item.points) {
          item.childs = item.points
        }
        if (item.childs) {
          item.childs = this.treeData(item.childs)
        }
        tree.push(item)
      })
      return tree
    },
    // 添加菜单
    menusAddClick () {
      console.log('我要添加菜单')
    },
    // 编辑用户
    edit (row) {
      console.log('我要编辑用户')
    },
    // 删除用户
    async remove (row) {
      console.log(row)
      try {
        const flag = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch((e) => {
          console.log(e)
          this.$message.info('已取消删除')
        })
        if (flag === 'confirm') {
          await remove(row)
          await this.getTableData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      } catch (e) {
        console.log(e)
        this.$message({
          type: 'error',
          message: '删除失败!'
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.menusBox {
  margin: 20px;
}

/deep/ .el-table .el-table__expand-icon {
  //display: none;
}
</style>
