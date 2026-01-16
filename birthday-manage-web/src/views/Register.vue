<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { User, Lock, Message } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

const router = useRouter()
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

<template>
  <div class="register-form-container">
    <el-form ref="registerFormRef" :model="registerForm" :rules="rules" class="register-form"
      @submit.prevent="handleRegister">
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" placeholder="请输入用户名（3-30个字符）" size="large" :prefix-icon="User"
          clearable />
      </el-form-item>

      <el-form-item prop="email">
        <el-input v-model="registerForm.email" placeholder="请输入邮箱地址" size="large" :prefix-icon="Message" clearable />
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="请输入密码（至少6位）" size="large"
          :prefix-icon="Lock" show-password clearable />
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" size="large"
          :prefix-icon="Lock" show-password clearable @keyup.enter="handleRegister" />
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
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;
@use 'sass:color';

.register-form-container {
  width: 100%;
}

.register-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    padding: 8px 15px;
  }

  .register-button {
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

.register-footer {
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
