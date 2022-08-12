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
              v-model.trim="formDate.username"
              placeholder="根据用户名搜索"
            ></el-input>
          </el-form>
        </el-col>
        <!-- 搜索取消按钮 -->
        <el-col>
          <el-button size="small" @click="clearBtn">清除</el-button>
          <el-button size="small" type="primary" @click="usersBtnOk">{{
            $t('table.search')
          }}</el-button>
        </el-col>
        <!-- 新增用户按钮 -->
        <el-col :span="3">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="small"
            @click="addClick"
            >新增学科</el-button
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
          <el-table :data="usersTableData" stripe style="width: 100%">
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="email" label="学科名称"> </el-table-column>
            <el-table-column prop="phone" label="创建者"> </el-table-column>
            <el-table-column prop="username" label="创建日期">
            </el-table-column>
            <el-table-column prop="permission_group_title" label="前台是否显示">
            </el-table-column>
            <el-table-column prop="username" label="二级目录">
            </el-table-column>
            <el-table-column prop="username" label="标签"> </el-table-column>
            <el-table-column prop="username" label="题目数量">
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
  </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      formDate: {
        pagesize: 10,
        page: 1,
        username: ''
      }
    }
  },
  methods: {
    clearBtn () {},
    usersBtnOk () {},
    addClick () {}
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
</style>
