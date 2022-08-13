<template>
  <div class="container">
    <el-dialog title="新增目录" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="所属学科">
          <el-select v-model="form.name" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              style="width: 300px"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录名称">
          <el-input v-model="form.name" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'DirectorysAdd',
  data() {
    return {
      dialogVisible: false,
      options: [],
      form: {
        name: "",
      },
    };
  },
};
</script>

<style scoped lang="less"></style>
