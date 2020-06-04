<template>
  <div class="result-graph-default">
    <div class="result-graph-default-bg"></div>
    <div class="result-graph-default-label">
      <p>{{ $t('common.noResult') }}</p>
      <label>{{ $t('common.noResultDetail') }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'reportNoResult'
}
</script>

<style scoped lang="scss">
.result-graph-default {
  height: 150px;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  margin-top: -75px;
  text-align: center;
  .result-graph-default-bg {
    background: url('../../assets/img/icon_noresult.png') no-repeat center
      transparent;
    background-size: contain;
    height: 75px;
  }
  .result-graph-default-label {
    color: #999;
    p {
      margin: 10px 0;
    }
  }
}
</style>
