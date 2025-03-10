<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="版本号" prop="versionCode">
        <el-input v-model="queryParams.versionCode" placeholder="请输入版本号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="版本名称" prop="versionName">
        <el-input v-model="queryParams.versionName" placeholder="请输入版本名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="MD5" prop="md5">
        <el-input v-model="queryParams.md5" placeholder="请输入文件 MD5 值" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:updates:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:updates:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:updates:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:updates:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="updatesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="版本号" align="center" prop="versionCode" />
      <el-table-column label="版本名称" align="center" prop="versionName" />
      <el-table-column label="更新类型" align="center" prop="updateType">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.update_type" :value="scope.row.updateType"/>
              </template>
            </el-table-column>
      <el-table-column label="更新描述" align="center" prop="updateDesc" />
      <el-table-column label="下载地址" align="center" prop="apkUrl" />
      <el-table-column label="文件大小" align="center" prop="apkSize" />
      <el-table-column label="MD5" align="center" prop="md5" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:updates:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:updates:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改应用更新对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="form.appName" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="版本号" prop="versionCode">
          <el-input v-model="form.versionCode" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="版本名称" prop="versionName">
          <el-input v-model="form.versionName" placeholder="请输入版本名称" />
        </el-form-item>
<el-form-item label="更新类型" prop="updateType">
          <el-select v-model="form.updateType" placeholder="请选择更新类型">
            <el-option
              v-for="dict in dict.type.update_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新描述" prop="updateDesc">
          <el-input v-model="form.updateDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="下载地址" prop="apkUrl">
          <el-input v-model="form.apkUrl" placeholder="请输入下载地址" />
        </el-form-item>
        <el-form-item label="文件大小" prop="apkSize">
          <el-input v-model="form.apkSize" placeholder="请输入文件大小" />
        </el-form-item>
        <el-form-item label="MD5" prop="md5">
          <el-input v-model="form.md5" placeholder="请输入 MD5 值" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listUpdates,
    getUpdates,
    delUpdates,
    addUpdates,
    updateUpdates
  } from "@/api/system/updates";

  export default {
    name: "Updates",
    dicts: ['update_type'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 应用更新表格数据
        updatesList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          appName: null,
          versionCode: null,
          versionName: null,
          updateDesc: null,
          apkUrl: null,
          apkSize: null,
          md5: null,
        },
        // 更新类型
        updateTypeList: [{
          value: null,
          label: '全部'
        },{
          value: 0,
          label: '可选更新'
        },{
          value: 1,
          label: '强制更新'
        }],
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          appName: [{
            required: true,
            message: "应用名称不能为空",
            trigger: "blur"
          }],
          versionCode: [{
            required: true,
            message: "版本号不能为空",
            trigger: "blur"
          }],
          versionName: [{
            required: true,
            message: "版本名称不能为空",
            trigger: "blur"
          }],
          updateType: [{
            required: true,
            message: "更新类型不能为空",
            trigger: "change"
          }],
          apkUrl: [{
            required: true,
            message: "下载地址不能为空",
            trigger: "blur"
          }],
          apkSize: [{
            required: true,
            message: "文件大小不能为空",
            trigger: "blur"
          }],
          md5: [{
            required: true,
            message: "MD5 值不能为空",
            trigger: "blur"
          }],
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询应用更新列表 */
      getList() {
        this.loading = true;
        listUpdates(this.queryParams).then(response => {
          this.updatesList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          appName: null,
          versionCode: null,
          versionName: null,
          updateDesc: null,
          updateType: 1,
          apkUrl: null,
          apkSize: null,
          md5: null,
          createTime: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加应用更新";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getUpdates(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改应用更新";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateUpdates(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addUpdates(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('是否确认删除应用更新编号为"' + ids + '"的数据项？').then(function() {
          return delUpdates(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/updates/export', {
          ...this.queryParams
        }, `updates_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>
