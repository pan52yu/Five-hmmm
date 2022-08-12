<template>
  <div class="menusBox">
    <el-card>
      <el-row type="flex" justify="end">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="small"
          @click="menusAddClick"
          >添加菜单</el-button
        >
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Menus',
  data () {
    return {}
  },

  created () {},

  methods: {
    menusAddClick () {
      console.log(11)
    }
  }
}
</script>

<style scoped lang="less">
.menusBox {
  margin: 20px;
}
</style>
