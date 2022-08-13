<template>
  <div class="container">
    <el-card>
      <!-- 说明和新增试题按钮 -->
      <div class="btn_wrapper" style="margin-bottom: 15px">
        <span style="color: pink; font-size: 12px"
          >说明：目前支持学科和关键字条件筛选</span
        >
        <el-button class="el-icon-edit" type="success" size="small">
          新增试题</el-button
        >
      </div>
      <!-- 头部表单 -->
      <el-form>
        <el-row>
          <el-col>
            <el-form-item label="学科">
              <el-select
                v-model="form.learning"
                placeholder="请选择"
                @change="learningchange"
              >
                <el-option
                  v-for="(item, index) in learningList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="二级目录">
              <el-select v-model="form.catalogue" placeholder="请选择">
                <el-option
                  v-for="(item, index) in catalogueList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="标签">
              <el-select v-model="form.label" placeholder="请选择">
                <el-option
                  v-for="(item, index) in labelList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="关键字">
              <el-input
                placeholder="根据题干搜索"
                v-model="form.keywords"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="试题类型">
              <el-select v-model="form.questionType" placeholder="请选择">
                <el-option label="单选" value="1"></el-option>
                <el-option label="多选" value="2"></el-option>
                <el-option label="简答" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="难度">
              <el-select v-model="form.difficulty" placeholder="请选择">
                <el-option label="简单" value="1"></el-option>
                <el-option label="一般" value="2"></el-option>
                <el-option label="困难" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="方向">
              <el-select v-model="form.direction" placeholder="请选择">
                <el-option
                  v-for="(item, index) in directionList"
                  :key="index"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="录入人">
              <el-select v-model="form.name" placeholder="请选择">
                <el-option
                  v-for="item in nameList"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="题目备注">
              <el-input v-model="form.remarks"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="企业简称">
              <el-input v-model="form.shortName"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="城市">
              <el-select
                v-model="form.province"
                placeholder="请选择"
                style="width: 48%; margin-right: 2%"
                @change="provinceListchange"
              >
                <el-option
                  v-for="(item, index) in provinceList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <el-select
                v-model="form.city"
                placeholder="请选择"
                style="width: 50%"
              >
                <el-option
                  v-for="(item, index) in cityList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item style="float: right">
              <el-button size="small">清除</el-button>
              <el-button type="primary" size="small">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first"></el-tab-pane>
        <el-tab-pane label="待审核" name="second"></el-tab-pane>
        <el-tab-pane label="已审核" name="third"></el-tab-pane>
        <el-tab-pane label="已拒绝" name="fourth"></el-tab-pane>
      </el-tabs>
      <!-- 警告 -->
      <el-alert type="info" show-icon :closable="false">
        <template #title> 数据一共 {{ page.total }} 条 </template>
      </el-alert>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="number" label="试题编号" width="120">
        </el-table-column>
        <el-table-column prop="subject" label="学科" width="120">
        </el-table-column>
        <el-table-column prop="catalog" label="目录" width="120">
        </el-table-column>
        <el-table-column
          prop="questionType"
          label="题型"
          width="120"
          :formatter="tixing"
        >
        </el-table-column>
        <el-table-column label="题干" width="280">
          <template v-slot="{ row }">
            <p v-html="row.question"></p>
          </template>
        </el-table-column>
        <el-table-column prop="addDate" label="录入时间" width="180">
        </el-table-column>
        <el-table-column
          prop="difficulty"
          label="难度"
          width="80"
          :formatter="nandu"
        >
        </el-table-column>
        <el-table-column prop="creator" label="录入人" width="120">
        </el-table-column>
        <el-table-column
          prop="chkState"
          label="审核状态"
          width="120"
          :formatter="shenhezhuangtai"
        >
        </el-table-column>
        <el-table-column prop="chkRemarks" label="审核意见" width="150">
        </el-table-column>
        <el-table-column prop="chkUser" label="审核人" width="120">
        </el-table-column>
        <el-table-column
          prop="publishState"
          label="发布状态"
          width="150"
          :formatter="fabuzhuangtai"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template v-slot="{ row }">
            <el-button type="text" size="small" @click="yulanbtn(row)"
              >预览</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="shenhebtn(row)"
              :disabled="row.chkState === 0 ? false : true"
              >审核</el-button
            >
            <el-button type="text" size="small">修改</el-button>
            <el-button type="text" size="small" @click="shangjiabtn(row)">{{
              row.publishState === 1 ? "下架" : "上架"
            }}</el-button>
            <el-button type="text" size="small" @click="delebtn(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page="page.page"
        :total="page.total"
        :page-size="page.pagesize"
        :page-sizes="[5, 10, 20, 50]"
        layout="sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="题目审核" :visible.sync="shenheShow" width="400px">
      <div style="margin-bottom: 18px">
        <el-radio v-model="radio" label="1">通过</el-radio>
        <el-radio v-model="radio" label="2">拒绝</el-radio>
      </div>
      <el-input
        type="textarea"
        v-model="form.desc"
        placeholder="请输入审核意见"
      ></el-input>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="shenheShow = false">取 消</el-button>
        <el-button type="primary" @click="shenheShow = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="题目预览"
      :visible="yulanShow"
      width="900px"
      @close="close"
    >
      <el-row>
        <el-col style="padding: 10px 0">【题型】：{{ questionType }}</el-col>
        <el-col style="padding: 10px 0">【编号】：{{ yulanList.id }}</el-col>
        <el-col style="padding: 10px 0">【难度】：{{ difficulty }}</el-col>
        <el-col style="padding: 10px 0">【标签】：{{ yulanList.tags }}</el-col>
        <el-col style="padding: 10px 0"
          >【学科】：{{ yulanList.subjectName }}</el-col
        >
        <el-col style="padding: 10px 0"
          >【目录】：{{ yulanList.directoryName }}</el-col
        >
        <el-col style="padding: 10px 0"
          >【方向】：{{ yulanList.direction }}</el-col
        >
      </el-row>
      <hr />
      【题干】：<span v-html="yulanList.question"></span>
      <div>单选题 选项：（以下选中的选项为正确答案）</div>
      <br />
      <div v-for="(item, index) in optionsList" :key="index">
        <el-radio v-model="xuanxiang" :label="item.isRight">{{
          item.title
        }}</el-radio>
        <br /><br />
      </div>
      <hr />
      【参考答案】：<el-button type="danger" size="small"
        >视频答案预览</el-button
      >
      <hr />
      【答案解析】：<span v-html="yulanList.answer"></span>
      <hr />
      【题目备注】：{{ yulanList.remarks }}
      <span slot="footer">
        <el-button type="primary" @click="close">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 表格列表,上架下架,审核
import {
  choice,
  choicePublish,
  choiceCheck,
  detail,
  remove,
} from "@/api/hmmm/questions";
// 录入人
import { userSimple } from "@/api/base/users";
// 学科
import { simple } from "@/api/hmmm/subjects";
// 二级目录
import { simples } from "@/api/hmmm/directorys";
// 标签
import { simpl } from "@/api/hmmm/tags";
// 所有城市
import { provinces, citys } from "@/api/hmmm/citys";

export default {
  data() {
    return {
      yulanShow: false,
      shenheShow: false,
      radio: "1",
      form: {
        learning: "",
        catalogue: "",
        label: "",
        keywords: "", // 关键词
        questionType: "", // 试题类型
        difficulty: "", // 难度
        direction: "", // 方向
        name: "", // 录入人
        remarks: "", // 题目备注
        shortName: "", // 企业简称
        province: "", // 城市
        city: "", // 地区

        desc: "", // 弹窗输入框
      },
      nameList: [], // 目录人列表
      cityList: [], // 地区列表
      provinceList: [], // 城市列表
      labelList: [], // 标签列表
      catalogueList: [], // 二级目录列表
      learningList: [], // 学科列表
      directionList: [
        {
          label: "o2o",
        },
        {
          label: "外包服务",
        },
        {
          label: "企业服务",
        },
        {
          label: "互联网金融",
        },
        {
          label: "企业咨询",
        },
        {
          label: "互联网",
        },
        {
          label: "电子商务",
        },
        {
          label: "其他",
        },
      ],
      activeName: "",
      tableData: [],
      page: {
        page: 1,
        total: 0,
        pagesize: 5,
      },
      // 预审列表
      yulanList: {
        // questionType: "", // 题型
        // id: "", // 编号
        // difficulty: "", // 难度
        // tags: "", // 标签
        // subjectName: "", // 学科
        // directoryName: "", // 目录
        // direction: "", // 方向
        // answer: "", // 答案解析
        // remarks: "", // 题目备注
      },
      // 选项
      optionsList: [],
      xuanxiang: 1,
      title: [],
    };
  },
  created() {
    this.simple();
    this.cyty();
    this.userSimple();
    this.choice();
  },
  computed: {
    questionType() {
      if (this.yulanList.questionType === "1") {
        return "单选";
      } else if (this.yulanList.questionType === "2") {
        return "多选";
      } else if (this.yulanList.questionType === "3") {
        return "简答";
      } else {
        return "未知";
      }
    },
    difficulty() {
      if (this.yulanList.difficulty === "1") {
        return "简单";
      } else if (this.yulanList.difficulty === "2") {
        return "一般";
      } else if (this.yulanList.difficulty === "3") {
        return "困难";
      } else {
        return "未知";
      }
    },
  },
  methods: {
    close() {
      this.yulanList = {};
      this.yulanShow = false;
    },
    async choice() {
      const res = await choice({
        page: this.page.page,
        pagesize: this.page.pagesize,
      });
      // console.log(res);
      this.tableData = res.data.items;
      this.page.total = res.data.counts;
      // console.log(this.tableData);
    },
    async userSimple() {
      const res = await userSimple();
      // console.log(res);
      this.nameList = res.data;
      // console.log(this.nameList);
    },
    async simple() {
      const res = await simple();
      // console.log(res);
      this.learningList = res.data;
    },
    async learningchange(value) {
      // console.log(value);
      const res = await simples({ subjectID: value });
      const obj = await simpl({ subjectID: value });
      // console.log(res);
      // console.log(obj);
      this.catalogueList = res.data;
      this.labelList = obj.data;
      // console.log(this.catalogueList);
    },
    cyty() {
      this.provinceList = provinces();
      // console.log(this.provinceList);
    },
    provinceListchange(value) {
      this.form.city = "";
      this.cityList = citys(value);
      // console.log(this.cityList);
    },
    async handleClick(val) {
      // console.log(val);
      if (val.index === "0") {
        // console.log(111);
        this.choice();
      } else if (val.index === "1") {
        const res = await choice({
          page: this.page.page,
          pagesize: this.page.pagesize,
          chkState: 0,
        });
        // console.log(res);
        this.tableData = res.data.items;
        this.page.total = res.data.counts;
        console.log(this.tableData);
      } else if (val.index === "2") {
        const res = await choice({
          page: this.page.page,
          pagesize: this.page.pagesize,
          chkState: 1,
        });
        // console.log(res);
        this.tableData = res.data.items;
        this.page.total = res.data.counts;
        console.log(this.tableData);
      } else if (val.index === "3") {
        const res = await choice({
          page: this.page.page,
          pagesize: this.page.pagesize,
          chkState: 2,
        });
        // console.log(res);
        this.tableData = res.data.items;
        this.page.total = res.data.counts;
        console.log(this.tableData);
      }
    },
    async shenhebtn(row) {
      this.shenheShow = true;
      await choiceCheck({
        id: row.id,
        chkState: this.radio,
        chkRemarks: this.form.desc,
      });
      this.choice();
    },
    async shangjiabtn(row) {
      if (row.publishState === 1) {
        this.$confirm("您确认下架这道题目吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          // console.log(row.id, row.publishState);
          choicePublish({ id: row.id, publishState: 0 });
          this.choice();
          this.$message({
            type: "success",
            message: "下架成功!",
          });
        });
      } else {
        this.$confirm("您确认上架这道题目吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          // console.log(row.id, row.publishState);
          choicePublish({ id: row.id, publishState: 1 });
          this.choice();
          this.$message({
            type: "success",
            message: "上架成功!",
          });
        });
      }
    },
    delebtn(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        remove({ id: row.id });
        this.choice();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    async yulanbtn(row) {
      this.yulanShow = true;
      const res = await detail({ id: row.id });
      // console.log(res);
      this.yulanList = res.data;
      this.optionsList = res.data.options;
      // console.log(this.optionsList);
      this.title = res.data.options.title;
      // this.$nectTick(() => {
      //   this.title = res.data.options.title;
      // });
    },
    // 进入某一页
    onPageChange(newPage) {
      this.page.page = newPage;
      this.choice();
    },
    // 每页显示信息条数
    onPageSizeChange(newSize) {
      this.page.pagesize = newSize;
      this.choice();
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
    nandu(row, column, cellValue) {
      if (cellValue === "1") {
        return "简单";
      } else if (cellValue === "2") {
        return "一般";
      } else if (cellValue === "3") {
        return "困难";
      }
    },
    shenhezhuangtai(row, column, cellValue) {
      if (cellValue === 0) {
        return "待审核";
      } else if (cellValue === 1) {
        return "已审核";
      } else if (cellValue === 2) {
        return "已拒绝";
      }
    },
    fabuzhuangtai(row, column, cellValue) {
      if (cellValue === 0) {
        return "待发布";
      } else if (cellValue === 1) {
        return "已发布";
      }
    },
  },
};
</script>

<style scoped lang='less'>
.container {
  padding: 0 10px;
  margin: 10px 0;
  .btn_wrapper {
    display: flex;
    justify-content: space-between;
  }
  .el-col {
    width: 25%;
    /deep/.el-form-item__label {
      width: 80px;
      text-align: right;
    }
    /deep/.el-form-item__content {
      margin-left: 80px;
    }
  }
}
</style>
