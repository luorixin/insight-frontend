<template>
  <div class="login-bg">
    <lang-change></lang-change>
    <div class="login-container">
      <div class="login-container__title">
        <div class="login-container__inner">
          <div class="login-title__img"></div>
          <div class="login-title__info">
            <p class="login-title__info-head">{{ $t('login.slogan') }}</p>
            <div class="login-title__info-content">
              <p>{{ $t('login.slogan1') }}</p>
              <p>{{ $t('login.slogan2') }}</p>
              <p>{{ $t('login.slogan3') }}</p>
            </div>
            <div class="login-title__info-detail">
              <p>{{ $t('login.sloganDetail') }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="login-container__form">
        <div class="login-container__form-inner">
          <div class="login-head">
            <img src="../../assets/img/login/logo_iclick.png" />
            <div class="login-title">
              <span>{{ $t('login.welcome') }}</span
              ><span style="color:#ef4136;">{{ $t('login.slogan') }}</span>
            </div>
          </div>
          <div class="login-wrap">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="0px"
              class="ms-content"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="ruleForm.username"
                  :placeholder="$t('login.username')"
                  ref="username"
                  class="ms-input"
                >
                  <el-button slot="prepend" icon="fa fa-user"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  :placeholder="$t('login.password')"
                  ref="password"
                  v-model="ruleForm.password"
                  @keyup.enter.native="submitForm('ruleForm')"
                >
                  <el-button slot="prepend" icon="fa fa-lock"></el-button>
                </el-input>
              </el-form-item>
              <div class="login-btn">
                <el-button
                  :loading="loading"
                  style="width:100%;"
                  type="primary"
                  @click.native.prevent="submitForm"
                  >{{ $t('login.submit') }}</el-button
                >
              </div>
            </el-form>
          </div>
          <div class="login-footer">
            <p>
              {{ $t('footer.power') }}
              <br />
              {{ $t('footer.icp') }}
              <br />
              {{ $t('footer.browsers') }}
              <br />
              <a
                class="link"
                :href="
                  'http://static.iax.optimix.cn/privacy/' +
                    privacyLang +
                    '.html'
                "
                target="_blank"
                >{{ $t('footer.policy') }}</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LangChange from '@/components/common/LangChange'
export default {
  name: 'Login',
  components: {
    LangChange
  },
  data() {
    return {
      privacyLang: 'privacy_en',
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t('login.username'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('login.password'),
            trigger: 'blur'
          }
        ]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    '$i18n.locale': {
      handler: function(val) {
        this.privacyLang =
          this.$i18n.locale === 'en' ? 'privacy_en' : 'privacy_zh_CN'
      },
      immediate: true
    }
  },
  mounted() {
    if (this.ruleForm.username === '') {
      this.$refs.username.focus()
    } else if (this.ruleForm.password === '') {
      this.$refs.password.focus()
    }
    window.document.body.setAttribute('style', 'height:100%')
    window.document
      .getElementsByTagName('html')[0]
      .setAttribute('style', 'height:100%')
    window.document.getElementById('app').setAttribute('style', 'height:100%')
  },
  beforeDestroy() {
    window.document.body.removeAttribute('style')
    window.document.getElementsByTagName('html')[0].removeAttribute('style')
    window.document.getElementById('app').removeAttribute('style')
  },
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.ruleForm)
            .then(() => {
              let path = this.redirect || '/'
              this.$router.push({ path: path })
              this.loading = false
            })
            .catch(error => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-bg {
  min-width: 1220px;
  min-height: 700px;
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff url(../../assets/img/login/bg.jpg) no-repeat left top
    scroll;
}
.login-container {
  height: 100%;
  min-height: 700px;
  display: flex;
  align-items: center;

  .login-container__title {
    width: 30%;
    min-height: 100%;
    height: 100%;
    float: left;
    position: relative;
    .login-container__inner {
      height: 270px;
      position: relative;
      display: inline-block;
      vertical-align: middle;
      .login-title__img {
        width: 293px;
        height: 100%;
        background: url(../../assets/img/login/title.png) no-repeat;
      }
      .login-title__info {
        position: absolute;
        left: 270px;
        top: 0;
        width: 520px;
        height: 234px;
        color: #fff;
        line-height: 1.2;
        .login-title__info-head {
          height: 60px;
          line-height: 60px;
          font-weight: bold;
          font-size: 50px;
        }
        .login-title__info-content {
          font-size: 25px;
          font-weight: bold;
          p {
            line-height: 1.5;
          }
        }
        .login-title__info-detail {
          margin-top: 10px;
          font-size: 20px;
          line-height: 1.5;
        }
      }
    }
    &::after {
      display: inline-block;
      width: 0;
      height: 100%;
      content: 'center';
      vertical-align: middle;
      overflow: hidden;
    }
  }
  .login-container__form {
    flex: 1;
    min-height: 700px;
    height: 100%;
    background: transparent url(../../assets/img/login/bg_white.png) no-repeat
      right top;
    position: relative;
    .login-container__form-inner {
      float: right;
      margin-top: 28%;
      text-align: center;
      margin-right: 5%;
      width: 265px;
      .login-title {
        font-size: 24px;
        height: 66px;
        line-height: 50px;
      }
      .login-footer {
        font-size: 12px;
        text-align: right;
        line-height: 14px;
        color: #999999;
        background-color: transparent;
        float: right;
        position: absolute;
        right: 0px;
        margin-right: 10px;
        bottom: 10px;
        .link {
          color: #999;
          text-decoration: underline;
        }
      }
    }
  }
}

@media (min-width: 1290px) {
  .login-bg {
    background-size: cover;
  }
}
@media (min-height: 700px) {
  .login-bg {
    background-size: cover;
  }
  .login-container_form {
    background-size: cover !important;
  }
}
/*mobile*/
@media (max-width: 600px) {
  .login-bg {
    min-width: 0px !important;
    max-width: 600px !important;
  }
  .login-container__title {
    display: none;
  }
  .login-container__form {
    width: 100% !important;
  }
}
</style>
