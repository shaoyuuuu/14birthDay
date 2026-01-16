<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const { login, loading } = useAuth()

const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
  username: '',
  password: ''
})

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
      const success = await login(loginForm.username, loginForm.password)
      if (success) {
        await router.push('/')
      }
    }
  })
}
</script>

<template>
  <div class="login-form-container">
    <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form" @submit.prevent="handleLogin">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名" size="large" :prefix-icon="User" clearable />
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" size="large" :prefix-icon="Lock"
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
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;
@use 'sass:color';

.login-form-container {
  width: 100%;
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    padding: 8px 15px;
  }

  .login-button {
    width: 100%;
    height: 44px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $box-shadow-base;
    }
  }
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid $border-lighter;

  p {
    font-size: 14px;
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
</style>
