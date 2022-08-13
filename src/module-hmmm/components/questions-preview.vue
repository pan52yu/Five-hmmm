<template>
  <div class='container'>
    <el-dialog
      :visible="dialogVisible"
      title="题目预览"
      width="70%"
      @close="close">
      <el-row :gutter="20">
        <el-col :span="6">
          <p>【题型】： <span>{{ currentItem.questionType }}</span></p>
        </el-col>
        <el-col :span="6">
          <p>【编号】：<span>{{ currentItem.id }}</span></p>
        </el-col>
        <el-col :span="6">
          <p>【难度】：<span>{{ currentItem.difficulty }}</span></p>
        </el-col>
        <el-col :span="6">
          <p>【标签】：<span>{{ currentItem.tags }}</span></p>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <p>【学科】：<span>{{ currentItem.subjectName }}</span></p>
        </el-col>
        <el-col :span="6">
          <p>【目录】：<span>{{ currentItem.directoryName }}</span></p>
        </el-col>
        <el-col :span="6">
          <p>【方向】：<span>{{ currentItem.direction }}</span></p>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>【题干】： <span class="question" v-html="currentItem.question">{{ currentItem.question }}</span></p>
        </el-col>
      </el-row>
      <el-row v-if="currentItem.questionType === '1'" :gutter="20">
        <el-col :span="24"><p>单选题选项：（以下选中的选项为正确答案）</p></el-col>
        <el-col v-for="item in options" :key="item.id" :span="24" class="radioItem">
          <el-radio v-model="item.isRight" :label="1">{{ item.title }}</el-radio>
        </el-col>
      </el-row>
      <el-row v-else-if="currentItem.questionType === '2'" :gutter="20">
        <el-col :span="24"><p>多选题选项：（以下选中的选项为正确答案）</p></el-col>
        <el-col v-for="item in options" :key="item.id" :span="24" class="radioItem">
          <el-checkbox-group v-model="options">
          <el-checkbox :label="item.isRight">{{item.title}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>【参考答案】：
            <el-button type="danger" @click="isShow = true">视频答案预览</el-button>
          </p>
          <div v-if="isShow" class="video">
            <video
              :src="videoUrl"
              autoplay
              controls
              height="100%"
              width="100%"
            ></video>
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>【答案解析】： <span v-html="currentItem.answer">{{ currentItem.answer }}</span>
          </p>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="24">
          <p>【题目备注】： <span>{{ currentItem.remarks }}</span>
          </p>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="close">关闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'questions-preview',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    currentItem: {
      type: Object,
      default: () => {
      }
    },
    options: {
      type: Array,
      default: () => {
      }
    }
  },
  data () {
    return {
      isShow: false,
      videoUrl: 'https://www.bilibili.com/video/BV1DZ4y1a7fD?spm_id_from=333.1007.tianma.10-1-33.click&t=9.9'
    }
  },
  methods: {
    // 点击关闭
    close () {
      console.log(this.currentItem)
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  .el-divider {
    background-color: #9a9a9a;
    margin: 15px 0;
  }

  .question {
    color: #0000ff;
  }

  .radioItem {
    margin-bottom: 14px;
  }

  .video {
    width: 400px;
    height: 300px;
  }
}
</style>
