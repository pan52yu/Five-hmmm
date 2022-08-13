<template>
  <div class="container">
    <el-dialog
      :title="`${title}`"
      @close="close"
      :visible="dialogVisible"
      width="30%"
    >
      <el-form
        ref="formRef"
        :model="formDate"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="所属学科">
          <el-select
            v-model="formDate.subjectID"
            placeholder="请选择"
            style="width: 300px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录名称" prop="directoryName">
          <el-input
            v-model="formDate.directoryName"
            style="width: 300px"
          ></el-input>
        </el-form-item>

        <el-row type="flex" justify="end" style="margin-top: 50px">
          <el-form-item>
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { simple } from "../../api/hmmm/subjects";
import { add, update } from "../../api/hmmm/directorys";
export default {
  name: "DirectorysAdd",
  props: {
    formDate: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      dialogVisible: false,
      options: [],
      // formDate: {
      //   id: null,
      //   subjectID: "",
      //   directoryName: "",
      // },
      rules: {
        directoryName: [
          {
            required: true,
            trigger: "blur",
            message: "请输入目录名称",
          },
        ],
      },
    };
  },

  created() {
    this.subjectSimple();
  },

  methods: {
    // 获取学科列表
    async subjectSimple() {
      const { data } = await simple();
      // console.log(data);
      this.options = data;
    },

    // 确定提交表单
    async submit() {
      try {
        await this.$refs.formRef.validate();
        const id = {
          id: null,
        };
        if (this.formDate.id === null) {
          await add({
            ...this.formDate,
            ...id,
          });
          await this.$message.success("添加成功");
        } else {
          await update(this.formDate);
          await this.$message.success("修改成功");
        }
        this.$emit("modification");
        this.close();
      } catch (e) {
        console.log(e);
      }
    },

    // 取消
    async close() {
      await this.$refs.formRef.resetFields();
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped lang="less"></style>
