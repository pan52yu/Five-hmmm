<template>
  <div class="logs">
    <el-card>
      <el-alert title="共100条数据" type="info" show-icon> </el-alert>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="操作类型" width="280">
        </el-table-column>
        <el-table-column prop="date" label="操作人" width="300">
        </el-table-column>
        <el-table-column prop="date" label="执行结果" width="300">
        </el-table-column>
        <el-table-column prop="name" label="操作时间" width="300">
        </el-table-column>
        <el-table-column prop="address" label="描述"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { list } from "../../api/base/logs";
export default {
  data() {
    return {
      tableData: [],
      form: {
        page: 1,
        pagesize: 10,
      },
    };
  },
  created() {
    this.list();
  },
  methods: {
    async list() {
      const res = await list(this.form);
      console.log(res);
    },
  },
};
</script>

<style scoped lang="less">
.logs {
  margin: 20px 20px;
}
</style>
