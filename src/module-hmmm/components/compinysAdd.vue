<template>
  <div class="add-form">
    <!-- :title="titleInfo.text + titleInfo.pageTitle" -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible">
      <el-form
        :rules="ruleInline"
        ref="dataForm"
        :model="formBase"
        label-position="left"
        label-width="150px"
        style="width: 80%; margin-left: 10px"
      >
        <el-form-item label="企业名称" prop="shortName">
          <el-input v-model="formBase.shortName"></el-input>
          <el-checkbox v-model="formBase.isFamous">是否为名企</el-checkbox>
        </el-form-item>
        <el-form-item label="所属公司" prop="company">
          <el-input v-model="formBase.company"></el-input>
          <p>https://www.tianyancha.com （在此可查询所属公司全称及简称）</p>
        </el-form-item>
        <el-form-item label="城市" prop="province">
          <el-select
            class="filter-item"
            style="width: 130px"
            v-model="formBase.province"
            @keyup.enter="handleFilter"
            @change="handleProvince"
            filterable
          >
            <el-option
              v-for="item in province"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <el-select
            class="filter-item"
            style="width: 130px"
            v-model="formBase.city"
            @keyup.enter="handleFilter"
            filterable
          >
            <el-option
              v-for="item in cityDate"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方向（企业标签）" prop="tags">
          <el-input v-model="formBase.tags"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入"
            v-model="formBase.remarks"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">{{ $t("table.cancel") }}</el-button>
        <el-button type="primary" @click="submit">{{
          $t("table.confirm")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { provinces, citys } from "@/api/hmmm/citys.js";
import { add, update } from "../../api/hmmm/companys";
export default {
  props: {
    formBase: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialogFormVisible: false,

      province: [],
      cityDate: [],

        // formBase: {
        //   shortName: "",
        //   isFamous: "",
        //   company: "",
        //   province: "",
        //   city: "",
        //   tags: "",
        //   remarks: "",
        // },
      // 表单验证
      ruleInline: {
        shortName: [
          { required: true, message: "企业简称不能为空", trigger: "blur" },
        ],
        province: [
          { required: true, message: "请选择省份", trigger: "change" },
        ],
        tags: [{ required: true, message: "请请输标签", trigger: "blur" }],
      },
    };
  },

  created() {
    this.province = provinces(); //获取到城市
  },

  methods: {
    // 获取省市区
    handleProvince() {
      this.cityDate = citys(this.formBase.province);
    },
    // 取消
    close() {
      this.dialogFormVisible = false;
      this.$refs.dataForm.resetFields();
      this.formBase = {
        shortName: "",
        isFamous: "",
        company: "",
        province: "",
        city: "",
        tags: "",
        remarks: "",
      };
    },
    // 确认
    async submit() {
      try {
        this.$refs.dataForm.validate();

        if (this.companysId.id === null) {
          console.log(this.companysId.id);
          await add(this.formBase);
          await this.$message.success("新增成功");
        } else {
          await update(this.formBase);
          await this.$message.success("编辑成功");
        }
        this.$emit("newDataes");
        this.close();
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped lang="less">
.el-form--label-left .el-form-item__label {
  text-align: right;
}
.el-form-item--medium {
  margin-bottom: 22px;
}
.el-dialog__footer {
  text-align: center;
}
</style>
