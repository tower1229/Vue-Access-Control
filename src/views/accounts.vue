<style scoped>

</style>

<template>
  <div v-loading="loading">
    <!-- 操作 -->
    <div class="operation">
      <el-button size="small" type="primary" v-has="[account.request]" @click="fetchData">查询</el-button>
      <el-button size="small" type="danger" v-has="[account.remove]">删除</el-button>
      <el-button size="small" v-if="$_has([account.request]) && canReset">重置</el-button>
      <el-button size="small" type="info" @click="requestNotAllowed">尝试发起越权请求</el-button>
    </div>
    <!-- table start  -->
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="name" label="账号" width="150">
      </el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          <el-tag type="success" style="margin:0 .5em .5em 0" v-for="role in scope.row.roles" :key="role.id">{{role.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.suspended">
            <span style="color:#ff4949">已禁用</span>
          </template>
          <template v-else>
            <span style="color:#13ce66">已启用</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="info" v-has="[account.edit]">编辑</el-button>
          <el-button size="mini" type="success" v-has="[account.edit]">分配角色</el-button>
          <el-button size="mini" type="warning" v-has="[account.edit]">重置密码</el-button>
          <el-button size="mini" type="danger" v-has="[account.remove]">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- table end  -->
  </div>
</template>

<script>
import * as account from '../api/account';

let myMixin = {
  data: function() {
    return { account }
  }
}
export default {
  mixins: [myMixin],
  data() {
    return {
      canReset: false,
      list: [],
      loading: false
    }
  },
  methods: {
    fetchData(page) {
      let vm = this;
      vm.loading = true;
      account.request.r().then((res) => {
        vm.list = res.data.content;
        vm.loading = false;
      }).catch(error => {
        vm.loading = false
      });
    },
    requestNotAllowed: function(){
      account.notAllowed.r();
    }
  },
  created() {
    this.fetchData();
  }
}
</script>