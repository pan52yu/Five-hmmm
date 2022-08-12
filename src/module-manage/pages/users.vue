<template>
  <div class="usersBox">
    <el-card>
      <!-- 上面搜索区域 -->
      <el-row type="flex" :gutter="20" justify="space-between">
        <!-- 搜索框 -->
        <el-col :span="6">
          <el-form>
            <el-input
              style="width: 200px"
              size="small"
              v-model.trim="formDate.username"
              placeholder="根据用户名搜索"
            ></el-input>
          </el-form>
        </el-col>
        <!-- 搜索取消按钮 -->
        <el-col>
          <el-button size="small" @click="clearBtn">清空</el-button>
          <el-button size="small" type="primary" @click="usersBtnOk"
            >搜索</el-button
          >
        </el-col>
        <!-- 新增用户按钮 -->
        <el-col :span="3">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="small"
            @click="addClick"
            >新增用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 记录提示栏 -->
      <el-row>
        <el-alert
          class="info"
          :title="`共${total}条记录`"
          type="info"
          show-icon
          :closable="false"
        >
        </el-alert>
      </el-row>
      <!-- 表格区域 -->
      <el-row>
        <template>
          <el-table :data="usersTableData" stripe style="width: 100%">
            <el-table-column label="序号" type="index"> </el-table-column>
            <el-table-column prop="email" label="邮箱"> </el-table-column>
            <el-table-column prop="phone" label="联系电话"> </el-table-column>
            <el-table-column prop="username" label="用户名"> </el-table-column>
            <el-table-column prop="permission_group_title" label="权限组名称">
            </el-table-column>
            <el-table-column prop="role" label="角色"> </el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  icon="el-icon-edit"
                  circle
                  plain
                  type="primary"
                  @click="editBtnOk(row)"
                ></el-button>
                <el-button
                  icon="el-icon-delete"
                  circle
                  plain
                  type="danger"
                  @click="delBtnOk(row)"
                ></el-button>
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
          :page-sizes="[10, 15, 20, 30]"
          :page-size="formDate.pagesize"
          layout=" prev, pager, next, sizes, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 新增、编辑用户弹层 -->
    <el-dialog
      :title="
        `${usersRuleForm.password != undefined ? '创建' : '编辑'}` + '用户'
      "
      :visible.sync="usersdialogShow"
      @close="close"
    >
      <el-form
        :model="usersRuleForm"
        :rules="usersRules"
        ref="usersRuleRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="usersRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="usersRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          v-if="usersRuleForm.password != undefined"
        >
          <el-input v-model="usersRuleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="usersRuleForm.role"></el-input>
        </el-form-item>
        <el-form-item label="权限组名称">
          <!-- <el-input v-model="usersRuleForm.permission_group_title"></el-input> -->
          <el-select
            v-model="usersRuleForm.permission_group_id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="usersRuleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input
            type="textarea"
            :rows="2"
            v-model="usersRuleForm.introduction"
            placeholder="Please input"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 取消、确认按钮 -->
      <el-row type="flex" justify="center">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" @click="addBtnOk"
          >确定</el-button
        >
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { list, add, detail, update, remove } from '@/api/base/users.js'
import { simple } from '@/api/base/permissions.js'
export default {
  name: 'Users',
  data () {
    return {
      usersdialogShow: false,
      formDate: {
        pagesize: 10,
        page: 1,
        username: ''
      },
      total: 0,
      usersTableData: [],
      // 弹层相关属性
      usersRuleForm: {
        username: '',
        email: '',
        password: '',
        role: '',
        permission_group_id: '',
        phone: '',
        introduction: ''
      },
      usersRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      options: []
    }
  },

  created () {
    this.getUsersTableData()
  },

  methods: {
    async getUsersTableData () {
      const res = await list(this.formDate)
      // console.log(res)
      if (res.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.usersTableData = res.data.list
      this.total = res.data.counts
      // this.$message.success('获取用户列表成功')
    },
    usersHandleSizeChange (page) {
      // console.log(page)
      this.formDate.pagesize = page
      this.getUsersTableData()
    },
    usersHandleCurrentChange (page) {
      // console.log(page)
      this.formDate.page = page
      this.getUsersTableData()
    },
    usersBtnOk () {
      this.getUsersTableData()
    },
    clearBtn () {
      this.formDate.username = ''
      this.getUsersTableData()
    },
    async addClick () {
      const res = await simple()
      // console.log(res)
      if (res.status !== 200) {
        return this.$message.error('获取权限组名称失败')
      }
      this.options = res.data
      this.usersdialogShow = true
    },
    // 弹层关闭事件
    close () {
      this.usersdialogShow = false
      this.$refs.usersRuleRef.resetFields()
      this.usersRuleForm = {
        username: '',
        email: '',
        password: '',
        role: '',
        permission_group_id: '',
        phone: '',
        introduction: ''
      }
    },
    // 弹层点击确定按钮触发事件
    async addBtnOk () {
      try {
        if (this.usersRuleForm.id) {
          // 有id是编辑场景
          await update(this.usersRuleForm)
          this.$message.success('编辑用户信息成功')
        } else {
          // 没有id是创建场景
          await add(this.usersRuleForm)
          this.$message.success('创建用户信息成功')
        }
        await this.$refs.usersRuleRef.validate()
        this.getUsersTableData()
        this.close()
      } catch (e) {
        console.log(e)
      }
    },
    // 点击操作栏 编辑按钮触发事件
    async editBtnOk (row) {
      // console.log(row)
      const res = await detail({ id: row.id })
      // console.log(res)
      if (res.status !== 200) {
        return this.$message.error('获取用户详情失败')
      }
      this.usersRuleForm = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        role: res.data.role,
        permission_group_id: res.data.permission_group_id,
        phone: res.data.phone,
        introduction: res.data.introduction
      }
      this.usersdialogShow = true
    },
    // 点击操作栏 删除按钮触发事件
    async delBtnOk (row) {
      // await this.$confirm('此操作将永久删除用户 , 是否继续?')
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await remove({ id: row.id })
        this.$message.success('删除成功!')
        this.getUsersTableData()
      } catch (e) {
        console.log(e)
        this.$message.info('已取消删除')
      }
    }
  }
}
</script>

<style scoped lang="less">
.usersBox {
  margin: 20px;
}

.info {
  margin: 20px 0;
}
</style>
