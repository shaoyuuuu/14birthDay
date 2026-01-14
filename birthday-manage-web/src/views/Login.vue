<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const loginFormRef = ref()
const username = ref('')
const password = ref('')
const loading = ref(false)

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

async function handleLogin() {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      const success = await authStore.login(username.value, password.value)
      loading.value = false
      if (success) {
        router.push('/')
      }
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>管理员登录</h1>
        <p>Birthday Wish 管理后台</p>
      </div>

      <el-form ref="loginFormRef" :model="{ username, password }" :rules="rules" class="login-form"
        @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="username" placeholder="请输入用户名" size="large" :prefix-icon="User" clearable />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="password" type="password" placeholder="请输入密码" size="large" :prefix-icon="Lock"
            show-password clearable @keyup.enter="handleLogin" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" class="login-button" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;
@use 'sass:color';

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: $background-white;
  border-radius: $border-radius-large;
  box-shadow: $box-shadow-dark;
  padding: $spacing-xl;
  width: 100%;
  max-width: 420px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: $spacing-lg;

  h1 {
    font-size: $font-size-extra-large;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-xs;
  }

  p {
    font-size: $font-size-base;
    color: $text-secondary;
  }
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: $spacing-lg;
  }

  :deep(.el-input__wrapper) {
    border-radius: $border-radius-base;
    padding: 8px 15px;
  }

  .login-button {
    width: 100%;
    height: 44px;
    font-size: $font-size-medium;
    font-weight: 500;
    border-radius: $border-radius-base;
  }
}

.login-footer {
  text-align: center;
  margin-top: $spacing-lg;
  padding-top: $spacing-md;
  border-top: 1px solid $border-lighter;

  p {
    font-size: $font-size-base;
    color: $text-secondary;
    margin: 0;

    a {
      color: $primary-color;
      font-weight: 500;
      transition: $transition-base;

      &:hover {
        color: color.scale($primary-color, $lightness: 10%);
      }
    }
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: $spacing-lg;
  }

  .login-header h1 {
    font-size: $font-size-large;
  }
}
</style>
