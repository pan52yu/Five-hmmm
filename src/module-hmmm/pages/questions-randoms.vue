<template>
  <div class="container">
    <el-card>
      <!-- 头部表格 -->
      <el-form>
        <el-row>
          <el-col>
            <el-form-item label="关键字">
              <el-input
                v-model="guanjianzi"
                placeholder="根据编号搜索"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col style="margin-left: 50%">
            <el-form-item style="text-align: right">
              <el-button size="small" @click="qingchu">清除</el-button>
              <el-button type="primary" size="small" @click="sousuo"
              >搜索
              </el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 警告 -->
      <el-alert type="info" show-icon :closable="false">
        <template #title>
          <span>数据一共 {{ page.total }} 条</span>
        </template>
      </el-alert>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="编号" width="220"></el-table-column>
        <el-table-column
          :formatter="tixing"
          prop="questionType"
          label="题型"
          width="80"
        >
        </el-table-column>
        <el-table-column prop="questionIDs" label="题目编号" width="220">
          <template v-slot="{ row }">
            <a
              @click="bianhaobtn(row)"
              v-for="(item, index) in row.questionIDs"
              :key="index"
              style="color: rgb(0, 153, 255)"
            >
              {{ item.number }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="录入时间" width="180">
        </el-table-column>
        <el-table-column prop="totalSeconds" label="答题时间(s)" width="157">
        </el-table-column>
        <el-table-column prop="accuracyRate" label="正确率(%)" width="157">
        </el-table-column>
        <el-table-column prop="userName" label="录入人" width="157">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template v-slot="{ row }">
            <el-button
              class="iconbtn"
              @click="deletebtn(row)"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page="page.page"
        :total="page.total"
        :page-size="page.pagesize"
        :page-sizes="[20, 30, 50, 100]"
        layout="sizes, prev, pager, next, jumper"
        style="margin-top: 20px; text-align: right"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="题目预览"
      :visible="yulanShow"
      width="900px"
      @close="close"
    >
      <el-row>
        <el-col style="padding: 10px 0">【题型】：</el-col>
        <el-col style="padding: 10px 0">【编号】：</el-col>
        <el-col style="padding: 10px 0">【难度】：</el-col>
        <el-col style="padding: 10px 0">【标签】：</el-col>
        <el-col style="padding: 10px 0">【学科】：</el-col>
        <el-col style="padding: 10px 0">【目录】：</el-col>
        <el-col style="padding: 10px 0">【方向】：</el-col>
      </el-row>
      <hr/>
      【题干】：
      <div>单选题 选项：（以下选中的选项为正确答案）</div>
      <br/>
      <!-- <div v-for="(item, index) in optionsList" :key="index">
        <el-radio v-model="xuanxiang" :label="item.isRight">{{
          item.title
        }}</el-radio>
        <br /><br />
      </div> -->
      <hr/>
      【参考答案】：
      <el-button type="danger" size="small"
      >视频答案预览
      </el-button
      >
      <hr/>
      【答案解析】：
      <hr/>
      【题目备注】：
      <span slot="footer">
        <el-button type="primary" @click="close">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { randoms, removeRandoms, detail } from "@/api/hmmm/questions";

export default {
  data() {
    return {
      yulanShow: false,
      tableData: [],
      questionIDsList: [],
      guanjianzi: "",
      page: {
        page: 1,
        total: 0,
        pagesize: 10,
      },
    };
  },
  created() {
    this.randoms();
  },
  methods: {
    async bianhaobtn(row) {
      this.yulanShow = true;
      await detail({ id: row.id });
    },
    close() {
      this.yulanShow = false;
    },
    deletebtn(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        removeRandoms({ id: row.id });
        this.$message.success("删除成功");
        this.randoms();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    async sousuo() {
      const res = await randoms({
        page: this.page.page,
        pagesize: this.page.pagesize,
        keyword: this.guanjianzi,
      });
      console.log(res);
      this.tableData = res.data.items;
      this.page.total = res.data.counts;
    },
    qingchu() {
      this.guanjianzi = "";
    },
    async randoms() {
      const res = await randoms({
        page: this.page.page,
        pagesize: this.page.pagesize,
      });
      console.log(res);
      this.tableData = res.data.items;
      this.page.total = res.data.counts;
    },
    tixing(row, column, cellValue) {
      if (cellValue === "1") {
        return "单选";
      } else if (cellValue === "2") {
        return "多选";
      } else if (cellValue === "3") {
        return "简答";
      }
    },
    // 进入某一页
    onPageChange(newPage) {
      this.page.page = newPage;
      this.randoms();
    },
    // 每页显示信息条数
    onPageSizeChange(newSize) {
      this.page.pagesize = newSize;
      this.randoms();
    },
  },
};
</script>

<style scoped lang='less'>
.container {
  padding: 0 10px;
  margin: 10px 0;

  .el-col {
    width: 25%;

    /deep/ .el-form-item__label {
      width: 80px;
    }

    /deep/ .el-form-item__content {
      margin-left: 80px;
    }
  }

  .iconbtn {
    color: #f56c6c;
    background: #fef0f0;
    border-color: #fbc4c4;
  }

  .iconbtn:hover {
    background: #f56c6c;
    border-color: #f56c6c;
    color: #fff;
  }
}
</style>
