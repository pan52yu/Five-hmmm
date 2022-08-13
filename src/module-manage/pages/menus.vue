<template>
  <div class="menusBox">
    <el-card>
      <el-row style="margin-bottom: 20px" type="flex" justify="end">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="small"
          @click="menusAddClick"
          >添加菜单
        </el-button>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        :header-cell-style="{
          'background-color': '#fafafa',
          'border-bottom': '2px solid #e8e8e8'
        }"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'childs' }"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="title" label="标题" width="220">
          <template v-slot="{ row }">
            <i v-if="row.is_point" class="el-icon-view"></i>
            <i
              v-else-if="row.childs && !row.points"
              class="el-icon-folder-opened"
            ></i>
            <i v-else class="el-icon-document-remove"></i>
            {{ row.title }}
          </template>
        </el-table-column>
        <el-table-column prop="code" label="权限点代码"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              @click="edit(row)"
              type="primary"
              plain
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="remove(row)"
              type="danger"
              plain
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建、修改菜单弹层 -->
    <el-dialog title="创建菜单" :visible="dialogShow" @close="close">
      <el-form
        ref="formRef"
        :rules="formRules"
        :model="tableData"
        label-width="100px"
      >
        <el-form-item label="权限组名称">
          <el-radio-group v-model="tableData.is_point">
            <el-radio label="菜单"></el-radio>
            <el-radio label="权限点"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="活动区域">
          <el-select v-model="tableData.region">
            <el-option label="区域一" value="shanghai">主导航</el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="权限代码" prop="code">
          <el-input v-model="tableData.code"></el-input>
        </el-form-item>
        <el-form-item label="权限标题" prop="title">
          <el-input v-model="tableData.title"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="end">
        <el-button size="small">取消</el-button>
        <el-button size="small" type="primary">确定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { list, remove } from '@/api/base/menus'

export default {
  name: 'Menus',
  data () {
    return {
      dialogShow: false,
      tableData: [],
      formRules: {
        code: [{ required: true, message: '请输入权限代码', trigger: 'blur' }],
        title: [{ required: true, message: '请输入权限标题', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      const { data } = await list()
      console.log(data)
      this.tableData = data
      this.tableData = this.treeData(data)
    },
    // 处理列表树形数据
    treeData (arr) {
      const tree = []
      // eslint-disable-next-line no-unused-expressions
      arr?.forEach((item) => {
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
    close () {
      this.dialogShow = false
    },
    // 添加菜单
    menusAddClick () {
      console.log('我要添加菜单')
      this.dialogShow = true
    },
    // 编辑用户
    edit (row) {
      console.log('我要编辑用户')
    },
    // 删除用户
    async remove (row) {
      console.log(row)
      try {
        const flag = await this.$confirm(
          '此操作将永久删除该文件, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch((e) => {
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

// /deep/ .el-table .el-table__expand-icon {
//display: none;
// }
.el-table__expand-icon el-table__expand-icon--expanded {
  display: none;
}

// /deep/.el-table__expand-icon el-table__expand-icon--expanded {
//   display: none !important;
// }

/deep/.el-table [class*='el-table__row--level'] .el-table__expand-icon {
  display: none;
}
</style>
