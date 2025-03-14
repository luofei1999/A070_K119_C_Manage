<template>
  <div class="app-container home">

    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>Client Manage System</h2>
        <p>
          <h3><strong>美容治疗系统</strong></h3>
          <p>美容治疗系统是一款专为美容护理和治疗设计的智能管理工具，集成了多种先进功能，帮助美容师高效管理客户信息，并提升美容治疗的专业性和便捷性。</p>
          <h3><strong>核心功能</strong></h3>
          <p>🔴 <strong>红光、蓝光、黄光、紫外线美容治疗</strong><br>
          支持多种光疗模式，满足不同肌肤护理需求，科学提升美容效果。</p>
          <p>📸 <strong>治疗前后拍照对比</strong><br>
          记录每次美容治疗前后的照片，清晰对比肌肤变化，方便客户查看护理效果。</p>
          <p>📋 <strong>治疗记录管理</strong><br>
          自动保存每位客户的治疗记录，包括光疗使用情况、护理方案、建议以及跟进计划。</p>
          <p>🩸 <strong>血氧仪检测支持</strong><br>
          连接血氧仪设备，实时监测客户血氧数据，为健康管理提供科学依据。</p>
          <p>📡 <strong>蓝牙 &amp; Wi-Fi 连接</strong><br>
          支持蓝牙和Wi-Fi连接，方便设备联动，快速同步客户数据与治疗信息。</p>
          <p>📊 <strong>客户管理系统</strong><br>
          一键录入客户信息，自动生成美容档案，支持远程查看与管理，提升美容院工作效率。</p>
          <p>🌐 <strong>远程诊断与API集成</strong><br>
          支持远程故障排查，并可与医疗系统（Epic、Cerner等）对接，实现数据共享。</p>
          <p>这款将科技与美容护理相结合，致力于提升美容院的管理效率，同时为客户提供更精准、高效的美容护理服务。</p>

        </p>
        <p>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </p>

      </el-col>

    </el-row>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.8.9"
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

