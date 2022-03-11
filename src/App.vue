<template>
  <router-view id="app" />
</template>

<script>

export default {
  created: function () {
    this.$Permission(() => {
      console.log('login success!')

    });
  },
};
</script>