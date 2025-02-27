<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="治疗方案" prop="treatmentPlan">
        <el-select v-model="queryParams.treatmentPlan" placeholder="请选择治疗方案" clearable>
          <el-option
            v-for="dict in dict.type.treatment_plan"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="治疗设备" prop="treatmentDevice">
        <el-input
          v-model="queryParams.treatmentDevice"
          placeholder="请输入治疗设备"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="治疗地址" prop="treatmentLocation">
        <el-input
          v-model="queryParams.treatmentLocation"
          placeholder="请输入治疗地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
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
          v-hasPermi="['patient:treatment_record:add']"
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
          v-hasPermi="['patient:treatment_record:edit']"
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
          v-hasPermi="['patient:treatment_record:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['patient:treatment_record:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="treatment_recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户名" align="center" prop="userName" />
      <el-table-column label="治疗方案" align="center" prop="treatmentPlan">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.treatment_plan" :value="scope.row.treatmentPlan"/>
        </template>
      </el-table-column>
      <el-table-column label="治疗时长" align="center" prop="treatmentDuration" />
      <el-table-column label="开始时间" align="center" prop="treatmentStartTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.treatmentStartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="treatmentEndTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.treatmentEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="治疗能量" align="center" prop="treatmentEnergy" />
      <el-table-column label="总能量输出" align="center" prop="totalEnergyOutput" />
      <el-table-column label="治疗设备" align="center" prop="treatmentDevice" />
      <el-table-column label="治疗地址" align="center" prop="treatmentLocation" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['patient:treatment_record:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['patient:treatment_record:remove']"
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

    <!-- 添加或修改治疗记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="uId">
          <el-input v-model="form.uId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="治疗方案" prop="treatmentPlan">
          <el-select v-model="form.treatmentPlan" placeholder="请选择治疗方案">
            <el-option
              v-for="dict in dict.type.treatment_plan"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="治疗时长" prop="treatmentDuration">
          <el-input v-model="form.treatmentDuration" placeholder="请输入治疗时长" />
        </el-form-item>
        <el-form-item label="开始时间" prop="treatmentStartTime">
          <el-date-picker clearable
            v-model="form.treatmentStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="treatmentEndTime">
          <el-date-picker clearable
            v-model="form.treatmentEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="治疗能量" prop="treatmentEnergy">
          <el-input v-model="form.treatmentEnergy" placeholder="请输入治疗能量" />
        </el-form-item>
        <el-form-item label="总能量输出" prop="totalEnergyOutput">
          <el-input v-model="form.totalEnergyOutput" placeholder="请输入总能量输出" />
        </el-form-item>
        <el-form-item label="治疗设备" prop="treatmentDevice">
          <el-input v-model="form.treatmentDevice" placeholder="请输入治疗设备" />
        </el-form-item>
        <el-form-item label="治疗地址" prop="treatmentLocation">
          <el-input v-model="form.treatmentLocation" placeholder="请输入治疗地址" />
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
import { listTreatment_record, getTreatment_record, delTreatment_record, addTreatment_record, updateTreatment_record } from "@/api/patient/treatment_record";

export default {
  name: "Treatment_record",
  dicts: ['treatment_plan'],
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
      // 治疗记录表格数据
      treatment_recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: null,
        treatmentPlan: null,
        treatmentDevice: null,
        treatmentLocation: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询治疗记录列表 */
    getList() {
      this.loading = true;
      listTreatment_record(this.queryParams).then(response => {
        this.treatment_recordList = response.rows;
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
        userName: null,
        treatmentPlan: null,
        treatmentDuration: null,
        treatmentStartTime: null,
        treatmentEndTime: null,
        treatmentEnergy: null,
        totalEnergyOutput: null,
        treatmentDevice: null,
        treatmentLocation: null
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加治疗记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTreatment_record(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改治疗记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTreatment_record(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTreatment_record(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除治疗记录编号为"' + ids + '"的数据项？').then(function() {
        return delTreatment_record(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('patient/treatment_record/export', {
        ...this.queryParams
      }, `treatment_record_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
