<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 左侧内容 -->
          <el-tab-pane label="角色管理">
            <el-row style="height: 40px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
                >新增角色</el-button
              >
            </el-row>
            <el-table border="" :data="list">
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="120"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="name"
                label="名称"
                width="240"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="description"
                label="描述"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                    >分配权限</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="changePage"
              ></el-pagination>
            </el-row>
          </el-tab-pane>
          <!-- 右侧内容 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible="showPermDialog"
      @close="btnPermCancel"
    >
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK"
            >确定</el-button
          >
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
  assignPerm,
} from "@/api/setting";
import { getPermissionList } from "@/api/permission";
import { tranListToTreeData } from "@/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 5,
        total: 0, // 记录总数
      },
      formData: {}, //公司信息
      showDialog: false,
      showPermDialog: false,
      permData: [],
      defaultProps: {
        label: "name",
      },
      roleId: null,
      selectCheck: [],
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {
        name: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId);
    },
    changePage(newPage) {
      this.page.page = newPage;
      this.getRoleList();
    },
    // 删除角色
    async deleteRole(id) {
      try {
        await this.$confirm("确认删除该角色吗");
        await deleteRole(id);
        this.getRoleList();
        this.$message.success("删除成功");
      } catch (error) {
        console.log(error);
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id); //获取数据
      this.showDialog = true;
    },
    // 点击确定
    async btnOK() {
      try {
        await this.$refs.roleForm.validate();
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm);
        } else {
          await addRole(this.roleForm);
        }
        this.getRoleList();
        this.$message.success("操作成功");
        this.showDialog = false;
      } catch (error) {
        console.log(error);
      }
    },
    // 点击取消
    btnCancel() {
      this.roleForm = {
        name: "",
        description: "",
      };
      // 移除校验
      this.$refs.roleForm.resetFields();
      this.showDialog = false;
    },

    // 获取权限点数据 在点击的时候调用 获取权限点数据
    async assignPerm(id) {
      this.permData = tranListToTreeData(await getPermissionList(), "0"); // 转化list到树形数据
      this.roleId = id;
      const { permIds } = await getRoleDetail(id);
      this.selectCheck = permIds;
      this.showPermDialog = true;
    },
    async btnPermOK() {
      await assignPerm({
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.roleId,
      });
      this.$message.success("分配权限成功");
      this.showPermDialog = false;
    },
    btnPermCancel() {
      this.selectCheck = []; // 重置数据
      this.showPermDialog = false;
    },
  },
};
</script>

<style>
</style>
