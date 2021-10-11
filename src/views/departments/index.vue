<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tools :treeNode="company" :isRoot="true" />
        <el-tree
          :data="departs"
          :props="defalutProps"
          :default-expand-all="true"
        >
          <tree-tools slot-scope="{ data }" :treeNode="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools.vue";
export default {
  components: {
    TreeTools,
  },
  data() {
    return {
      company: { name: "江苏传智播客教育科技股份有限公司", manager: "负责人" },
      departs: [
        { name: "总裁办", children: [{ name: "董事会" }] },
        { name: "行政部" },
        { name: "人事部" },
      ],
      defalutProps: {
        label: "name",
      },
    };
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
