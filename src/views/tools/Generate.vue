<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('generate.title') }}</h1>
        </div>
      </div>
    </div>
    <hr style="margin:0 -20px" />
    <div class="page_tip">
      <label>{{ $t('generate.tip') }}</label>
      <label class="italic">{{ $t('generate.tip2') }}</label>
    </div>
    <el-form
      :model="form"
      ref="ruleForm"
      :rules="rules"
      label-width="200px"
      label-position="right"
      class="ruleForm"
    >
      <el-form-item :label="$t('generate.website')" prop="website">
        <el-input v-model="form.website"> </el-input>
        <p class="item-tip">{{ $t('generate.websiteTip') }}</p>
      </el-form-item>
      <el-form-item :label="$t('generate.channel')" prop="channel">
        <el-select
          v-model="form.channel"
          :placeholder="$t('generate.channel')"
          class="handleSelect"
        >
          <el-option label="search" value="search"> </el-option>
          <el-option label="dispaly" value="dispaly"> </el-option>
          <el-option label="video" value="video"> </el-option>
          <el-option label="social" value="social"> </el-option>
        </el-select>
        <p class="item-tip">{{ $t('generate.channelTip') }}</p>
      </el-form-item>
      <el-form-item :label="$t('generate.media')" prop="media">
        <el-input v-model="form.media"> </el-input>
        <p class="item-tip">{{ $t('generate.mediaTip') }}</p>
      </el-form-item>
      <el-form-item :label="$t('generate.name')" prop="name">
        <el-input v-model="form.name"> </el-input>
        <p class="item-tip">{{ $t('generate.nameTip') }}</p>
      </el-form-item>
    </el-form>
    <div class="show-content">
      <div class="show-content_title">
        {{ $t('generate.urlTitle') }}
      </div>
      <div class="show-content_tip">
        {{ $t('generate.urlTip') }}
      </div>
      <div class="show-content_url">
        <el-input
          :readonly="true"
          ref="finalUrl"
          @focus="chooseAll"
          v-model="finalUrl"
        ></el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Generate',
  data() {
    return {
      form: {
        website: '',
        channel: 'search',
        media: '',
        name: ''
      },
      baseData: {
        website: '',
        channel: 'search',
        media: '',
        name: ''
      },
      rules: {
        website: [
          {
            required: true,
            message: this.$t('common.emptyInput'),
            trigger: 'change'
          }
        ],
        media: [
          {
            required: true,
            message: this.$t('errorInfo.emptyInput'),
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('errorInfo.emptyInput'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    finalUrl() {
      return `${this.form.website}/?in_channel=${this.form.channel}&in_meida=${this.form.media}&in_campaign=${this.form.name}`
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.form = Object.assign({}, this.baseData)
    },
    chooseAll() {
      this.$refs.finalUrl.select()
    }
  }
}
</script>

<style scoped lang="scss">
.ruleForm {
  ::v-deep .el-input__inner {
    width: 500px;
  }
  .item-tip {
    color: #999;
  }
}
.page_tip {
  margin: 20px 0;
  label {
    font-size: 12px;
    color: #666;
    display: block;
    line-height: 20px;
  }
  .italic {
    font-style: italic;
  }
}
.show-content {
  border: 1px solid #dfdfdf;
  background: #efefef;
  padding: 20px;
  .show-content_title {
    font-size: 20px;
    line-height: 20px;
  }
  .show-content_tip {
    margin: 20px 0;
    font-size: 16px;
    color: #666;
  }
}
</style>
