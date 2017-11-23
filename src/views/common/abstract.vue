<template>
  <div>
  	<el-row :gutter="20" v-if="children">
      <el-col :span="4" v-for="(route, index) in children" :key="index">
        <el-card>
          <div class="text">
          <p>{{route.name}}</p>
          <router-link :to="{name: route.name}">查看</router-link>
        </div>
        </el-card>
      </el-col>
    </el-row>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      children: null
    };
  },
  beforeRouteEnter: function(to, from, next) {
    next(vm => {
      let children = vm.$route.meta.children;
      if (children) {
        vm.children = children;
      } else {
        vm.children = null;
      }
    });
  },
  watch: {
    '$route': function(to, from) {
      let children = this.$route.meta.children;
      if (children) {
        this.children = children;
      } else {
        this.children = null;
      }
    }
  }
};
</script>