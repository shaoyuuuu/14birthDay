<template>
  <el-card class="page-header" shadow="never" v-bind="$attrs">
    <div class="page-header-content">
      <div class="header-left">
        <el-button v-if="showBack" class="back-btn" text @click="handleBack">
          <el-icon>
            <ArrowLeft />
          </el-icon>
        </el-button>
        <div class="header-info">
          <h1 class="page-title">{{ title }}</h1>
          <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <div class="header-right">
        <slot />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

interface Props {
  title: string
  subtitle?: string
  showBack?: boolean
}

withDefaults(defineProps<Props>(), {
  showBack: false,
})

const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.page-header {
  margin-bottom: 2vw;

  :deep(.el-card__body) {
    padding: 2vw;
  }

  .page-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2vw;

    .header-left {
      display: flex;
      align-items: center;
      gap: 1vw;
      flex: 1;

      .back-btn {
        .el-icon {
          font-size: 1.5vw;
        }
      }

      .header-info {
        .page-title {
          margin: 0 0 0.5vw 0;
          font-size: 1.5vw;
          font-weight: 600;
          color: #303133;
        }

        .page-subtitle {
          margin: 0;
          font-size: 0.9vw;
          color: #909399;
        }
      }
    }

    .header-right {
      display: flex;
      gap: 1vw;
    }
  }
}

@media (max-width: 768px) {
  .page-header {
    margin-bottom: 4vw;

    :deep(.el-card__body) {
      padding: 4vw;
    }

    .page-header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 2vw;

      .header-left {
        width: 100%;

        .back-btn {
          .el-icon {
            font-size: 3vw;
          }
        }

        .header-info {
          .page-title {
            font-size: 3vw;
          }

          .page-subtitle {
            font-size: 1.8vw;
          }
        }
      }

      .header-right {
        width: 100%;
        justify-content: flex-end;
      }
    }
  }
}
</style>
