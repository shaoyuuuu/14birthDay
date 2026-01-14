<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { User, Lock, Message } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const registerFormRef = ref()
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const validateConfirmPassword = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== password.value) {
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

async function handleRegister() {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      const success = await authStore.register(username.value, email.value, password.value)
      loading.value = false
      if (success) {
        router.push('/')
      }
    }
  })
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>管理员注册</h1>
        <p>Birthday Wish 管理后台</p>
      </div>

      <el-form ref="registerFormRef" :model="{ username, email, password, confirmPassword }" :rules="rules"
        class="register-form" @submit.prevent="handleRegister">
        <el-form-item prop="username">
          <el-input v-model="username" placeholder="请输入用户名（3-30个字符）" size="large" :prefix-icon="User" clearable />
        </el-form-item>

        <el-form-item prop="email">
          <el-input v-model="email" placeholder="请输入邮箱地址" size="large" :prefix-icon="Message" clearable />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="password" type="password" placeholder="请输入密码（至少6位）" size="large" :prefix-icon="Lock"
            show-password clearable />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input v-model="confirmPassword" type="password" placeholder="请再次输入密码" size="large" :prefix-icon="Lock"
            show-password clearable @keyup.enter="handleRegister" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" class="register-button" @click="handleRegister">
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <div class="register-footer">
        <p>已有账号？<router-link to="/login">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;
@use 'sass:color';

.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
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

.register-header {
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

.register-form {
  :deep(.el-form-item) {
    margin-bottom: $spacing-lg;
  }

  :deep(.el-input__wrapper) {
    border-radius: $border-radius-base;
    padding: 8px 15px;
  }

  .register-button {
    width: 100%;
    height: 44px;
    font-size: $font-size-medium;
    font-weight: 500;
    border-radius: $border-radius-base;
  }
}

.register-footer {
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
  .register-card {
    padding: $spacing-lg;
  }

  .register-header h1 {
    font-size: $font-size-large;
  }
}
</style>
