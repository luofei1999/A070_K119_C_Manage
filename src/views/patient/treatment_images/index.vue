<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="治疗ID" prop="treatmentId">
        <el-input v-model="queryParams.treatmentId" placeholder="请输入治疗ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入用户名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="文件名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入文件名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['patient:treatment_images:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['patient:treatment_images:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['patient:treatment_images:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['patient:treatment_images:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="treatment_imagesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="治疗ID" align="center" prop="treatmentId" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="用户名" align="center" prop="userName" />
      <!-- <el-table-column label="文件名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="访问路径" align="center" prop="path" :show-overflow-tooltip="true" /> -->

      <el-table-column label="图片" width="180" align="center">
        <template slot-scope="scope">

          <el-image style="width: 100px; height: 100px" :src="scope.row.url" :fit="fit"
          :preview-src-list="[scope.row.url]"></el-image>

        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['patient:treatment_images:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['patient:treatment_images:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改治疗图片对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="治疗ID" prop="treatmentId">
          <el-input v-model="form.treatmentId" placeholder="请输入治疗ID" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="文件名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="访问路径" prop="path">
          <el-input v-model="form.path" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="访问地址" prop="url">
          <el-input v-model="form.url" type="textarea" placeholder="请输入内容" />
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
    listTreatment_images,
    getTreatment_images,
    delTreatment_images,
    addTreatment_images,
    updateTreatment_images
  } from "@/api/patient/treatment_images";

  export default {
    name: "Treatment_images",
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
        // 治疗图片表格数据
        treatment_imagesList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          treatmentId: null,
          userId: null,
          userName: null,
          name: null,
          path: null,
          url: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          treatmentId: [{
            required: true,
            message: "治疗ID不能为空",
            trigger: "blur"
          }],
          userId: [{
            required: true,
            message: "用户ID不能为空",
            trigger: "blur"
          }],
          userName: [{
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }],
          name: [{
            required: true,
            message: "文件名称不能为空",
            trigger: "blur"
          }],
          path: [{
            required: true,
            message: "访问路径不能为空",
            trigger: "blur"
          }],
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询治疗图片列表 */
      getList() {
        this.loading = true;
        listTreatment_images(this.queryParams).then(response => {
          this.treatment_imagesList = response.rows;
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
          treatmentId: null,
          userId: null,
          userName: null,
          name: null,
          path: null,
          url: null,
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
        this.title = "治疗图片";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getTreatment_images(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改治疗图片";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateTreatment_images(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addTreatment_images(this.form).then(response => {
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
        this.$modal.confirm('是否确认删除治疗图片编号为"' + ids + '"的数据项？').then(function() {
          return delTreatment_images(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('patient/treatment_images/export', {
          ...this.queryParams
        }, `treatment_images_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>
