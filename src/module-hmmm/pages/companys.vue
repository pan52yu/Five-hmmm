<template>
  <div class="companys">
    <el-card>
      <el-form ref="form" :model="formRef" label-position="left">
        <el-row>
          <el-col :span="6">
            <el-form-item label="标签名称">
              <el-input
                placeholder="请输入"
                v-model="formRef.tags"
                style="width: 230px"
              ></el-input>
            </el-form-item
            >
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市">
              <el-select
                v-model="formRef.city"
                placeholder="请选择"
                @change="changeCitys"
              >
                <el-option
                  v-for="item in optionsProvinces"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item
            >
          </el-col>
          <el-col :span="6">
            <el-form-item label="地区">
              <el-select v-model="formRef.province" placeholder="请选择">
                <el-option
                  v-for="item in optionsCitys"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item
            >
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业简称">
              <el-input
                v-model="formRef.shortName"
                style="width: 240px"
              ></el-input>
            </el-form-item
            >
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select
                v-model="formRef.state"
                placeholder="请选择"
                style="width: 260px"
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
          </el-col>
          <el-col :span="6">
            <template>
              <el-button @click="clear">清除</el-button>
              <el-button type="primary" @click="search">搜索</el-button>
            </template>
          </el-col>
          <el-row type="flex" justify="end">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              @click="add"
            >新增用户
            </el-button
            >
          </el-row>
        </el-row>
      </el-form>

      <el-alert
        :title="`共${this.total}条记录`"
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
        <el-table-column prop="number" label="企业编号" width="150">
        </el-table-column>
        <el-table-column prop="shortName" label="企业简称"></el-table-column>
        <el-table-column prop="tags" label="标签" width="150">
        </el-table-column>
        <el-table-column prop="creatorID" label="创建者" width="80">
        </el-table-column>
        <el-table-column prop="addDate" label="创建日期">
          <template v-slot="{ row }">
            {{ row.addDate | parseTime("{y}-{m}-{d}") }}
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" width="150">
        </el-table-column>
        <el-table-column prop="state" label="状态" width="150">
          <template v-slot="{ row }">
            <span v-if="row.state === 1">启用</span>
            <span v-else>禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              plain
              @click="edit(row)"
            ></el-button>

            <el-tooltip
              class="item"
              effect="dark"
              :content="row.state === 0 ? '启用' : '禁用'"
              placement="top"
            >
              <el-button
                type="success"
                icon="el-icon-check"
                circle
                plain
                v-if="row.state === 0"
                @click="open(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-close"
                circle
                plain
                v-else
                @click="open(row)"
              ></el-button>
            </el-tooltip>

            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              @click="delItem(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="end" style="margin-top: 20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="page.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <CompanysAdd
      ref="addCompanys"
      @newDataes="newDataes"
      :formBase="companysId"
      :title="title"
    ></CompanysAdd>
  </div>
</template>

<script>
import { list, remove, disabled } from '../../api/hmmm/companys'
import { regionDataPlus } from 'element-china-area-data'
import CompanysAdd from '../components/compinysAdd.vue'
import { citys, provinces } from '../../api/hmmm/citys'

export default {
  components: {
    CompanysAdd
  },
  data () {
    return {
      formRef: {
        tags: '',
        city: '',
        province: '',
        shortName: '',
        state: '',
        page: 1,
        pagesize: 10
      },
      tableData: [],
      page: {
        page: 1,
        pagesize: 10
      },
      total: 0,
      options: [
        {
          value: 1,
          label: '启用'
        },
        {
          value: 2,
          label: '停用'
        }
      ],
      citys: regionDataPlus,
      selectedOptions: [],
      optionsProvinces: [],
      optionsCitys: [],
      companysId: {
        // shortName: "",
        // isFamous: "",
        // company: "",
        // province: "",
        // city: "",
        // tags: "",
        // remarks: "",
      },
      title: ''
    }
  },

  created () {
    this.companyList()
    // 获取城市
    this.optionsProvinces = provinces()
    // console.log(provinces());
  },

  methods: {
    // 获取企业管理列表
    async companyList () {
      const { data } = await list(this.page)
      // console.log(res);
      this.tableData = data.items
      // console.log(this.tableData);
      this.total = data.counts
    },
    handleSizeChange (newSize) {
      this.tableData.pagesize = newSize
      this.companyList()
    },
    handleCurrentChange (newPage) {
      this.tableData.page = newPage
      this.companyList()
    },

    // 删除
    async delItem (id) {
      try {
        await this.$confirm('此操作将永久删除用户，是否继续？', '提示')
        await remove({
          ...id,
          id
        })
        this.$message.success('删除成功')
        this.companyList()
      } catch (e) {
        console.log(e)
      }
    },

    // 新增
    add () {
      this.companysId = {}
      this.$refs.addCompanys.dialogFormVisible = true
      this.title = '创建用户'
    },

    // 编辑
    edit (row) {
      this.$refs.addCompanys.dialogFormVisible = true
      this.companysId = row
      this.title = '编辑用户'
    },

    // 子传父 通知父组件重新渲染页面
    async newDataes () {
      await this.companyList()
    },

    // 清除
    async clear () {
      await this.$refs.form.resetFields()
      await this.companyList()
    },
    // 搜索
    async search () {
      const { data } = await list(this.formRef)
      console.log(data)
      this.tableData = data.items
    },

    // 改变开启 / 禁用 状态
    async open (row) {
      await this.$confirm(
        `已成功${row.state === 0 ? '启用' : '禁用'},是否继续?`,
        '提示'
      )
      console.log(row)
      const data = {
        id: row.id,
        state: row.state === 0 ? 1 : 0
      }
      await disabled(data)
      await this.companyList()
      await this.$message.success(
        `已成功${row.state === 0 ? '启用' : '禁用'}标签`
      )
    },

    // 获取地区
    changeCitys () {
      this.optionsCitys = citys(this.formRef.city)
      console.log(citys(this.formRef.city))
    }
  }
}
</script>

<style scoped lang="less">
.companys {
  margin: 20px 20px;
}

.companys-top {
  display: flex;
  justify-content: space-around;
}
</style>
