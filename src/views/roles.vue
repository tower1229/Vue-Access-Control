<style scoped>

.extendGroup {
  float: right;
  margin-right: 20px;
  opacity: 0;
}

.el-tree-node__content:hover .extendGroup {
  opacity: 1;
}
</style>

<template>
  <div v-loading="loading">
    <!-- 操作 -->
    <div class="operation">
      <el-button size="small" type="primary" v-has="[role.request]" @click="fetchData">查询</el-button>
      <el-button size="small" type="danger" v-has="[role.remove]">删除</el-button>
      <el-button size="small" v-if="$_has([role.request]) && canReset">重置</el-button>
      <el-button size="small" type="info" @click="requestNotAllowed">尝试发起越权请求</el-button>
    </div>
    <!-- table start  -->
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="name" label="名称" width="120">
      </el-table-column>
      <el-table-column prop="timestamp" label="创建时间">
      </el-table-column>
      <el-table-column prop="summary" label="备注" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="info">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- table end  -->
  </div>
</template>

<script>
import * as role from '../api/role';

let myMixin = {
  data: function() {
    return { role }
  }
}

export default {
  mixins: [myMixin],
  data() {
    return {
      list: [],
      canReset: true,
      loading: false
    }
  },
  methods: {
    fetchData(init) {
      this.loading = true;
      role.request.r().then((res) => {
        this.list = res.data.content;
        this.loading = false;
      });
    },
    requestNotAllowed: function(){
      role.notAllowed.r();
    }
  },
  created() {
    this.fetchData(true)
  }
}
</script>