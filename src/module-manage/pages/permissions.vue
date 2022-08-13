<template>
  <div class="permissions">
    <el-card>
      <el-form ref="form" :model="formData" :rules="rules">
        <el-form-item prop="title">
          <el-row type="flex">
            <el-col :span="6">
              <el-input
                placeholder="根据用户名搜索"
                style="width: 250px"
                v-model="formData.title"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <template>
                <el-button style="margin-left: 10px" @click="clearForm"
                  >清除</el-button
                >
                <el-button type="primary" @click="search">搜索</el-button>
              </template>
            </el-col>
            <el-col>
              <el-row type="flex" justify="end">
                <el-button type="success" @click="add">新增权限组</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <el-alert :title="`共${this.total}条记录`" type="info" show-icon>
      </el-alert>

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%; margin-top: 20px"
        :header-cell-style="{
          'background-color': '#fafafa',
          'border-bottom': '2px solid #e8e8e8',
        }"
      >
        <el-table-column type="selection" width="300"> </el-table-column>
        <el-table-column prop="title" label="用户名" width="300">
        </el-table-column>
        <el-table-column prop="create_date" label="日期" sortable width="300">
          <template v-slot="{ row }">
            {{ row.create_date | parseTime("{y}-{m}-{d}") }}
          </template>
        </el-table-column>

        <el-table-column align="right" label="操作" show-overflow-tooltip>
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              plain
              @click="editPermissions(row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              @click="delPermissions(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row type="flex" justify="end" style="margin-top: 20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listPermissions.page"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="listPermissions.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 添加弹出层 -->
    <usersAdd
      ref="permissionsAdd"
      @update="update"
      :ruleInline="ruleInline"
      :title="title"
    ></usersAdd>
  </div>
</template>

<script>
import { list, remove } from "../../api/base/permissions";
import usersAdd from "../components/permissions-add.vue";
export default {
  components: {
    usersAdd,
  },
  data() {
    return {
      formData: {
        page: 1,
        pagesize: 10,
        title: "",
      },
      rules: {
        title: [],
      },
      tableData: [],
      listPermissions: {
        page: 1,
        pagesize: 10,
      },
      total: 0,
      dialogVisible: false,
      form: {
        title: "",
      },
      ruleInline: {
        title: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            min: "2",
            max: "8",
            message: "长度在 2 到 8 个字符",
            trigger: "blur",
          },
        ],
      },
      treeData: [],
      defaultProps: {
        children: "points",
        label: "title",
      },
      title: "",
    };
  },

  created() {
    this.list();
  },

  methods: {
    // 获取权限组列表
    async list() {
      const res = await list(this.listPermissions);
      // console.log(res);
      this.tableData = res.data.list;
      this.total = res.data.counts;
    },

    // 分页
    handleSizeChange(newSize) {
      this.tableData.pagesize = newSize;
      this.list();
    },
    handleCurrentChange(newPage) {
      this.tableData.page = newPage;
      this.list();
    },

    // 删除
    async delPermissions(id) {
      await this.$confirm("此操作将永久删除用户，是否继续？");
      await remove({
        ...id,
        id,
      });
      this.$message.success("删除成功");
      await this.list();
    },

    // 搜索
    async search() {
      const res = await list(this.formData);
      this.tableData = res.data.list;
    },
    // 清除
    async clearForm() {
      await this.$refs.form.resetFields();
      await this.list();
    },

    // 新增
    async add() {
      this.title = "创建权限组";
      this.$refs.permissionsAdd.dialogFormV();
    },
    async update() {
      await this.list();
    },

    // 编辑
    async editPermissions(id) {
      console.log(id);
      this.title = "编辑权限组";
      this.$refs.permissionsAdd.dialogFormV();
      this.$refs.permissionsAdd.hanldeEditForm(id);
    },
  },
};
</script>

<style scoped lang="less">
.permissions {
  margin: 20px 20px;
}
</style>
