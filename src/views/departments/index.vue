<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tools :treeNode="company" :isRoot="true" @addDepts="addDepts" />
        <el-tree
          :data="departs"
          :props="defalutProps"
          :default-expand-all="true"
        >
          <tree-tools
            slot-scope="{ data }"
            :treeNode="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <add-dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
    />
  </div>
</template> 

<script>
import TreeTools from "./components/tree-tools.vue";
import AddDept from "./components/add-dept.vue";

import { getDepartments, addDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";
export default {
  components: {
    TreeTools,
    AddDept,
  },
  data() {
    return {
      company: { name: "广州摇篮软件开发有限公司", manager: "负责人" },
      departs: [],
      defalutProps: {
        label: "name",
      },
      showDialog: false,
      node: null,
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    // 获取信息
    async getDepartments() {
      const result = await getDepartments();
      this.company = { name: this.company.name, manager: "负责人", id: "" };
      this.departs = tranListToTreeData(result.depts, "");
    },
    // 添加部门
    addDepts(node) {
      this.showDialog = true; // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node;
    },
    // 编辑部门节点
    editDepts(node) {
      // 首先打开弹层
      this.showDialog = true;
      this.node = node; // 赋值操作的节点
      this.$refs.addDept.getDepartDetail(node.id);
    },
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
