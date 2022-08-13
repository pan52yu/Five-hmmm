<template>
  <!-- menusBox盒子 -->
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
    <el-dialog
      :title="`${this.addtableData.id ? '修改' : '添加'}` + '菜单'"
      :visible="dialogShow"
      @close="close"
    >
      <el-form
        ref="formRef"
        :rules="formRules"
        :model="addtableData"
        label-width="100px"
      >
        <el-form-item label="权限组名称">
          <el-radio-group v-model="addtableData.is_point">
            <el-radio :disabled="addtableData.id ? true : false" :label="false"
              >菜单</el-radio
            >
            <el-radio :disabled="addtableData.id ? true : false" :label="true"
              >权限点</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="活动区域">
          <!-- <el-select v-model="selectTreeName">
            <el-option label="主导航" :value="0"></el-option>
            <el-option
              v-for="items in tableData"
              :value="items.id"
              :key="items.id"
              :label="items.title"
              hidden
            ></el-option>
            <el-tree
              :data="tableData"
              :props="defaultProps"
              @node-click="handleNodeClick"
            ></el-tree>
          </el-select> -->

          <el-select
            v-model="selectTreeName"
            :popper-append-to-body="false"
            ref="selectRef"
          >
            <el-option
              :value="selectTree"
              class="setstyle"
              style="overflow: auto; height: 100%"
              disabled
            >
              <el-tree
                default-expand-all
                style="min-height: 150px; max-height: 300px"
                :data="tableData"
                :props="defaultProps"
                ref="tree"
                check-strictly
                :expand-on-click-node="false"
                @node-click="
                  (data, node, item) =>
                    addAdminHandleNodeClick(data, node, item)
                "
              ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="权限代码" prop="code">
          <el-input v-model="addtableData.code"></el-input>
        </el-form-item>
        <el-form-item label="权限标题" prop="title">
          <el-input v-model="addtableData.title"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="end">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" @click="addBtnOk"
          >确定</el-button
        >
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { list, remove, detail, add, update } from '@/api/base/menus'

export default {
  name: 'Menus',
  data () {
    return {
      selectTreeName: '主导航啊',
      selectTree: '',
      defaultProps: {
        label: 'title',
        children: 'childs'
      },
      // editDisabled: false,
      addtableData: {
        code: '',
        id: '',
        is_point: false,
        pid: 0,
        title: ''
      },
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
    addAdminHandleNodeClick (e) {
      console.log(e)
      this.selectTreeName = e.title
      this.addtableData.pid = e.id
      this.$refs.selectRef.blur()
    },
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
      this.addtableData = {
        code: '',
        id: '',
        is_point: false,
        pid: 0,
        title: ''
      }
      // this.editDisabled = false
    },
    // 添加菜单
    menusAddClick () {
      console.log('我要添加菜单')
      this.dialogShow = true
    },
    // 编辑用户
    async edit (row) {
      console.log(row)
      // this.addtableData = row
      const res = await detail({ id: row.id })
      console.log(res)
      this.addtableData = res.data
      // this.editDisabled = true
      this.dialogShow = true
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
    },
    handleNodeClick () {
      console.log('节点被点击时的回调')
    },
    async addBtnOk () {
      try {
        if (this.addtableData.id) {
          // 有id是编辑场景
          await update(this.addtableData)
          this.$message.success('修改成功')
        } else {
          // 没有id是新增场景
          await add(this.addtableData)
          this.$message.success('添加成功')
        }
        this.getTableData()
        this.close()
      } catch (e) {
        this.$message.error('添加失败')
        this.close()
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
