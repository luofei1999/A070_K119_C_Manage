<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户ID" prop="uId">
        <el-input
          v-model="queryParams.uId"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['patient:oximeter:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['patient:oximeter:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['patient:oximeter:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['patient:oximeter:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="oximeterList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="测试时间" align="center" prop="createTime" />
      <el-table-column label="用户名称" align="center" prop="userName" />
      <el-table-column label="血氧饱和度" align="center" prop="spo2" />
      <el-table-column label="脉率" align="center" prop="pr" />
      <el-table-column label="血压" align="center" prop="pi" />
      <el-table-column label="SYS" align="center" prop="sys" />
      <el-table-column label="DIA" align="center" prop="dia" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['patient:oximeter:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['patient:oximeter:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改血氧仪对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入患者ID" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="血氧饱和度" prop="spo2">
          <el-input v-model="form.spo2" placeholder="请输入血氧饱和度" />
        </el-form-item>
        <el-form-item label="脉率" prop="pr">
          <el-input v-model="form.pr" placeholder="请输入脉率" />
        </el-form-item>
        <el-form-item label="PI" prop="pi">
          <el-input v-model="form.pi" placeholder="请输入PI" />
        </el-form-item>
        <el-form-item label="SYS" prop="dia">
          <el-input v-model="form.sys" placeholder="请输入PI" />
        </el-form-item>
        <el-form-item label="DIA" prop="dia">
          <el-input v-model="form.dia" placeholder="请输入DIA" />
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
import { listOximeter, getOximeter, delOximeter, addOximeter, updateOximeter } from "@/api/patient/oximeter";

export default {
  name: "Oximeter",
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
      // 血氧仪表格数据
      oximeterList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uId: null,
        createTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uId: [
          { required: true, message: "患者ID不能为空", trigger: "blur" }
        ],
        spo2: [
          { required: true, message: "血氧饱和度不能为空", trigger: "blur" }
        ],
        pr: [
          { required: true, message: "脉率不能为空", trigger: "blur" }
        ],
        pi: [
          { required: true, message: "血压不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询血氧仪列表 */
    getList() {
      this.loading = true;
      listOximeter(this.queryParams).then(response => {
        this.oximeterList = response.rows;
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
        oximeterId: null,
        userId: null,
        userName: null,
        spo2: null,
        pr: null,
        pi: null,
        sys: null,
        dia: null,
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
      this.ids = selection.map(item => item.oximeterId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加血氧仪";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const oximeterId = row.oximeterId || this.ids
      getOximeter(oximeterId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改血氧仪";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.oximeterId != null) {
            updateOximeter(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOximeter(this.form).then(response => {
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
      const oximeterIds = row.oximeterId || this.ids;
      this.$modal.confirm('是否确认删除血氧仪编号为"' + oximeterIds + '"的数据项？').then(function() {
        return delOximeter(oximeterIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('patient/oximeter/export', {
        ...this.queryParams
      }, `oximeter_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
