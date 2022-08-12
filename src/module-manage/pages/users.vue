<template>
  <div>
    用户列表
  </div>
</template>

<script>
import { list, add, detail, update, remove } from '@/api/base/users.js'
import { simple } from '@/api/base/permissions.js'
export default {
  name: 'Users',
  data () {
    return {

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
          type: 'info'
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

<style scoped lang='less'>

</style>
