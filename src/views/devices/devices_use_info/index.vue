<template>
  <div class="app-container">

    <el-row :gutter="20">
      <splitpanes :horizontal="this.$store.getters.device === 'mobile'" class="default-theme">
        <!--分组数据-->
        <pane size="16" style="" :class="{'splitpanesHorizontal': this.$store.getters.device === 'mobile'}">
          <el-col>
            <div class="head-container">
              <el-input v-model="groupName" placeholder="请输入分组名称" clearable size="small" prefix-icon="el-icon-search"
                style="margin-bottom: 20px" />
            </div>
            <div class="head-container">
              <el-tree :data="groupOptions" :props="defaultProps" :expand-on-click-node="false"
                :filter-node-method="filterNode" ref="tree" node-key="id" default-expand-all highlight-current
                @node-click="handleNodeClick">

                <span class="el-tree-node__label" slot-scope="{ node, data }">
                  <span>{{ node.label }} <span v-if="data.remark">({{data.remark}})</span></span>
                </span>

              </el-tree>
            </div>
          </el-col>
        </pane>
        <!--用户数据 84-->
        <pane size="100">
          <el-col>
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
              label-width="68px">
              <el-form-item label="编号" prop="deviceNumber">
                <el-input v-model="queryParams.deviceNumber" placeholder="请输入编号" clearable
                  @keyup.enter.native="handleQuery" />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                  <el-option v-for="dict in dict.type.device_status" :key="dict.value" :label="dict.label"
                    :value="dict.value" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                  v-hasPermi="['devices:devices_manage:add']">新增</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                  v-hasPermi="['devices:devices_manage:edit']">修改</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                  @click="handleDelete" v-hasPermi="['devices:devices_manage:remove']">删除</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                  v-hasPermi="['devices:devices_manage:export']">导出</el-button>
              </el-col>
              <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="devices_manageList" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center" />

              <el-table-column label="编号" align="center" prop="deviceNumber" />
              <el-table-column label="状态" align="center" prop="status">
                <template slot-scope="scope">
                  <dict-tag :options="dict.type.device_status" :value="scope.row.status" />
                </template>
              </el-table-column>

              <el-table-column label="功能1剩余" align="center" prop="function1Balance" />
              <el-table-column label="功能1调整" align="center" prop="function1Adjustment" />

              <el-table-column label="功能2剩余" align="center" prop="function2Balance" />
              <el-table-column label="功能2调整" align="center" prop="function2Adjustment" />

              <el-table-column label="功能3剩余" align="center" prop="function3Balance" />
              <el-table-column label="功能3调整" align="center" prop="function3Adjustment" />


              <el-table-column label="备注" align="center" prop="remark" />
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                    v-hasPermi="['devices:devices_manage:edit']">修改</el-button>
                  <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                    v-hasPermi="['devices:devices_manage:remove']">删除</el-button>
                </template>
              </el-table-column>

            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize" @pagination="getList" />
          </el-col>
        </pane>
      </splitpanes>
    </el-row>

    <!-- 添加或修改设备信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备分组" prop="groupId">
          <treeselect v-model="form.groupId" :options="enabledGroupOptions" :show-count="true" placeholder="请选择设备分组" />
        </el-form-item>
        <el-form-item label="编号" prop="deviceNumber">
          <el-input v-model="form.deviceNumber" placeholder="请输入编号" />
        </el-form-item>
        <!-- <el-form-item label="用户" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户" />
        </el-form-item> -->
        <el-form-item label="卡号" prop="simCardNumber">
          <el-input v-model="form.simCardNumber" placeholder="请输入卡号" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入卡号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入卡号" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入卡号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>

        <el-divider>功能配置</el-divider>

        <el-row v-for="i in 3" :key="i">
          <el-col :span="12">
            <el-form-item :label="`功能${i}剩余`">
              <el-input v-model="form[`function${i}Balance`]" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`功能${i}调整`">
              <el-input v-model="form[`function${i}Adjustment`]" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

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
    listDevices_manage,
    getDevices_manage,
    delDevices_manage,
    addDevices_manage,
    updateDevices_manage,
    groupTreeSelect
  } from "@/api/devices/devices_manage";

  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {
    Splitpanes,
    Pane
  } from "splitpanes";
  import "splitpanes/dist/splitpanes.css";

  export default {
    name: "Devices_manage",
    dicts: ['device_status'],
    components: {
      Treeselect,
      Splitpanes,
      Pane
    },
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
        // 设备信息表格数据
        devices_manageList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          deviceNumber: null,
          status: null,
          userName: null,
          simCardNumber: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          deviceNumber: [{
            required: true,
            message: "编号不能为空",
            trigger: "blur"
          }],
        },

        // 分组名称
        groupName: undefined,
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 所有分组树选项
        groupOptions: undefined,
        // 过滤掉已禁用分组树选项
        enabledGroupOptions: undefined,
      };
    },
    watch: {
      // 根据名称筛选分组树
      groupName(val) {
        this.$refs.tree.filter(val);
      }
    },
    mounted() {

    },
    created() {
      this.getList();
      this.getDevicesGroupTree();
    },
    destroyed() {},
    methods: {
      /** 查询设备信息列表 */
      getList() {
        this.loading = true;

        listDevices_manage(this.queryParams).then(response => {
          this.devices_manageList = response.rows
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
          deviceNumber: null,
          userName: null,
          simCardNumber: null
        };
        for (let i = 1; i <= 3; i++) {
          this.$delete(this.form, `function${i}Balance`);
          this.$delete(this.form, `function${i}Adjustment`);
        }
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
        this.title = "添加设备信息";

      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getDevices_manage(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改设备信息";
        });
      },
      /** 提交按钮 */
      submitForm() {

        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateDevices_manage(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addDevices_manage(this.form).then(response => {
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
        var ids = "";
        var msg = ""
        if(row.id) {
          ids = row.id;
          msg = '是否确认删除设备信息编号为"' + row.deviceNumber + '"的数据项？'
        } else {
          ids = this.ids
          msg = '是否确认删除选中的数据项？'
        }
        this.$modal.confirm(msg).then(function() {
          return delDevices_manage(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('devices/devices_manage/export', {
          ...this.queryParams
        }, `devices_manage_${new Date().getTime()}.xlsx`)
      },

      /** 查询分组下拉树结构 */
      getDevicesGroupTree() {
        groupTreeSelect().then(response => {
          this.groupOptions = response.data;
          this.groupOptions.unshift(this.getAllOption())
          this.enabledGroupOptions = this.filterDisabledDevicesGroup(JSON.parse(JSON.stringify(response.data)));
          // 设置默认选中的节点
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(-1);
          });
        });
      },
      // 获取 全部 分级
      getAllOption() {
        return {
          "label": "全部",
          "id": -1,
          "disabled": false,
        }
      },
      // 过滤禁用的分组
      filterDisabledDevicesGroup(groupList) {
        var list = groupList.filter(group => {
          if (group.disabled) {
            return false;
          }
          if (group.children && group.children.length) {
            group.children = this.filterDisabledDevicesGroup(group.children);
          }
          return true;
        });
        return list
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        if (data.id == -1) {
          this.$delete(this.queryParams, "groupId")
        } else {
          this.queryParams.groupId = data.id;
        }
        this.handleQuery();
      },

      // 调试设备
      debugDevice(device) {

      },

    }
  };
</script>

<style scoped>
  .splitpanesHorizontal {
    height: 160px !important;
    overflow-y: auto;
  }
</style>
