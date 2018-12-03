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
      
    };
  },
  computed: {
    children: function(){
      return this.$route.meta.children || null
    }
  }
};
</script>