<template>
  <div class="container">
    <el-card>
      <el-row>
        <el-form ref="formRef" :model="form" label-width="80px">
          <el-col :span="6">
            <el-form-item label="目录名称">
              <el-input
                v-model="form.directoryName"
                style="width: 250px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="form.state" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button @click="clear">清除</el-button>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
          </el-col>
          <el-row type="flex" justify="end">
            <el-button type="success" icon="el-icon-edit" @click="add"
              >新增目录</el-button
            >
          </el-row>
        </el-form>
      </el-row>

      <el-alert
        :title="`数据共${this.total}条`"
        type="info"
        show-icon
        style="margin-bottom: 20px"
      >
      </el-alert>

      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{
          'background-color': '#fafafa',
          'border-bottom': '2px solid #e8e8e8',
        }"
      >
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="subjectName" label="所属学科" width="180">
        </el-table-column>
        <el-table-column prop="directoryName" label="目录名称" width="180">
        </el-table-column>
        <el-table-column prop="username" label="创建者"> </el-table-column>
        <el-table-column prop="addDate" label="创建日期" width="180">
          <template v-slot="{ row }">
            {{ row.addDate | parseTime("{y}-{m}-{d}") }}
          </template>
        </el-table-column>
        <el-table-column prop="totals" label="面试题数量" width="180">
        </el-table-column>
        <el-table-column prop="state" label="状态" width="180">
          <template v-slot="{ row }">
            <span v-if="row.state === 1">已开启</span>
            <span v-else>已禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template v-slot="{ row }">
            <el-button type="text" @click="open(row)" v-if="row.state === 1"
              >禁用</el-button
            >
            <el-button type="text" @click="open(row)" v-else>启用</el-button>
            <el-button
              type="text"
              :disabled="row.state === 0"
              @click="edit(row)"
              >修改</el-button
            >
            <el-button
              type="text"
              :disabled="row.state === 0"
              @click="delItem(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="end" style="margin-top: 20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="form.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 添加和编辑 弹窗组件 -->
    <DirectorysAdd
      ref="directorysAdd"
      :formDate="driectoryEdit"
      @modification="modification"
      :title="title"
    ></DirectorysAdd>
  </div>
</template>

<script>
import { list, remove, changeState } from "../../api/hmmm/directorys";
import DirectorysAdd from "../components/directorys-add.vue";
export default {
  components: {
    DirectorysAdd,
  },
  data() {
    return {
      form: {
        page: 1,
        pagesize: 10,
        state: "",
        directoryName: "",
      },
      total: 0,
      tableData: [],
      options: [
        {
          value: 1,
          label: "启用",
        },
        {
          value: 0,
          label: "禁用",
        },
      ],
      driectoryEdit: {
        id: null,
      },
      title: "",
    };
  },
  created() {
    this.driectoryList();
  },
  methods: {
    // 获取全部目录列表
    async driectoryList() {
      const { data } = await list(this.form);
      // console.log(data);
      this.tableData = data.items;
      this.total = data.counts;
    },
    handleSizeChange(newSize) {
      this.form.pagesize = newSize;
    },
    handleCurrentChange(newPage) {
      this.form.page = newPage;
    },

    // 清除
    async clear() {
      await this.$refs.formRef.resetFields();
      await this.driectoryList();
    },
    // 搜索
    async search() {
      const { data } = await list(this.form);
      // console.log(data);
      this.tableData = data.items;
    },

    // 删除
    async delItem(id) {
      try {
        await this.$confirm("此操作将永久删除用户，是否继续？", "提示");
        await remove({
          ...id,
          id,
        });
        await this.driectoryList();
      } catch (e) {
        console.log(e);
      }
    },

    // 添加
    add() {
      this.$refs.directorysAdd.dialogVisible = true;
      this.title = "新增目录";
    },

    // 编辑
    edit(row) {
      this.$refs.directorysAdd.dialogVisible = true;
      this.driectoryEdit = row;
      this.title = "编辑目录";
    },

    // 子传父 通知父组件重新渲染页面
    async modification() {
      await this.driectoryList();
      this.driectoryEdit = {};
    },

    // 改变状态  已启用/已禁用
    async open(row) {
      const data = {
        id: row.id,
        state: row.state === 1 ? 0 : 1,
      };
      await changeState(data);
      await this.driectoryList();
    },
  },
};
</script>

<style scoped lang="less">
.container {
  margin: 20px 20px;
}
</style>
