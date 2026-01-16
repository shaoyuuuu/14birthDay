<template>
  <div class="register-form">
    <div class="form-header">
      <h2 class="form-title">{{ pageTitle }}</h2>
      <p class="form-subtitle">{{ pageSubtitle }}</p>
    </div>

    <el-form ref="registerFormRef" :model="registerForm" :rules="rules" class="auth-form" @submit.prevent="handleRegister">
      <el-form-item prop="username">
        <el-input
          v-model="registerForm.username"
          placeholder="请输入用户名（3-30个字符）"
          size="large"
          :prefix-icon="User"
          clearable
          class="form-input"
        />
      </el-form-item>

      <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          placeholder="请输入邮箱地址"
          size="large"
          :prefix-icon="Message"
          clearable
          class="form-input"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="请输入密码（至少6位）"
          size="large"
          :prefix-icon="Lock"
          show-password
          clearable
          class="form-input"
        />
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          size="large"
          :prefix-icon="Lock"
          show-password
          clearable
          @keyup.enter="handleRegister"
          class="form-input"
        />
      </el-form-item>

      <el-form-item class="submit-item">
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          class="submit-button"
          @click="handleRegister"
        >
          <span v-if="!loading">注册</span>
          <span v-else>注册中...</span>
        </el-button>
      </el-form-item>
    </el-form>

    <div class="form-footer">
      <p class="footer-text">
        已有账号？
        <router-link to="/login" class="footer-link">立即登录</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { User, Lock, Message } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { useRoute } from 'vue-router'
import { ROUTE_NAMES } from '@/constants'

const router = useRouter()
const route = useRoute()
const { register, loading } = useAuth()

const registerFormRef = ref<FormInstance>()
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 30, message: '用户名长度在 3 到 30 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const pageTitle = computed(() => {
  return route.name === ROUTE_NAMES.REGISTER ? '创建账户' : '欢迎回来'
})

const pageSubtitle = computed(() => {
  return route.name === ROUTE_NAMES.REGISTER ? '填写信息以创建新账户' : '登录您的账户以继续'
})

async function handleRegister() {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const success = await register(registerForm.username, registerForm.email, registerForm.password)
      if (success) {
        router.push('/')
      }
    }
  })
}
</script>

<style scoped lang="scss">
// design-tokens.scss 已通过 vite.config.ts 全局注入

.register-form {
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: $space-5;
}

.form-title {
  font-size: $text-2xl;
  font-weight: $font-bold;
  color: $text-primary;
  margin: 0 0 $space-2 0;
  letter-spacing: -0.5px;
}

.form-subtitle {
  font-size: $text-sm;
  color: $text-secondary;
  margin: 0 0 $space-5 0;
  font-weight: $font-normal;
}

.auth-form {
  :deep(.el-form-item) {
    margin-bottom: $space-4;
  }

  :deep(.el-form-item__error) {
    font-size: $text-sm;
    padding-top: $space-1;
  }

  :deep(.el-input__wrapper) {
    border-radius: $radius-md;
    padding: $space-2 $space-3;
    transition: all $duration-base $ease-in-out;
    border: 1px solid $border-primary;

    &:hover {
      border-color: $color-primary;
      box-shadow: $shadow-xs;
    }

    &.is-focus {
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }

  :deep(.el-input__inner) {
    font-size: $text-base;
    color: $text-primary;
  }

  :deep(.el-input__inner::placeholder) {
    color: $text-tertiary;
  }
}

.form-input {
  width: 100%;
}

.submit-item {
  margin-bottom: 0;
}

.submit-button {
  width: 100%;
  height: 48px;
  font-size: $text-base;
  font-weight: $font-semibold;
  border-radius: $radius-md;
  background: $gradient-primary;
  border: none;
  transition: all $duration-base $ease-in-out;
  box-shadow: $shadow-md;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
}

.form-footer {
  margin-top: $space-5;
  text-align: center;
  padding-top: $space-4;
  border-top: 1px solid $border-primary;
}

.footer-text {
  font-size: $text-sm;
  color: $text-secondary;
  margin: 0;
}

.footer-link {
  color: $color-primary;
  font-weight: $font-medium;
  text-decoration: none;
  transition: color $duration-base $ease-in-out;

  &:hover {
    color: $color-primary-dark;
  }
}

@media (max-width: $breakpoint-sm) {
  .form-title {
    font-size: $text-xl;
  }

  .form-subtitle {
    font-size: $text-sm;
  }

  .submit-button {
    height: 44px;
  }
}
</style>