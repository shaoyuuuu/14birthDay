<template>
  <div class="stick-figure-container" :style="containerStyle">
    <!-- 进度轨道 -->
    <div class="progress-track"></div>

    <!-- 火柴人1（前方拉人的） -->
    <div ref="frontFigure" class="stick-figure front" :style="frontFigureStyle">
      <div class="figure">
        <img :src="frontAvatar" alt="前方火柴人" class="avatar" :style="avatarStyle" />
        <div class="body" :style="bodyStyle"></div>
        <!-- 左手臂（拉人的手，向前伸） -->
        <div ref="frontLeftArm" class="arm left pulling" :style="frontLeftArmStyle"></div>
        <!-- 右手臂（向后摆，正常摆动） -->
        <div ref="frontRightArm" class="arm right" :style="frontRightArmStyle"></div>
        <!-- 左腿 -->
        <div ref="frontLeftLeg" class="leg left" :style="frontLeftLegStyle"></div>
        <!-- 右腿 -->
        <div ref="frontRightLeg" class="leg right" :style="frontRightLegStyle"></div>
      </div>
    </div>

    <!-- 火柴人2（后方被拉的） -->
    <div ref="rearFigure" class="stick-figure rear" :style="rearFigureStyle">
      <div class="figure">
        <img :src="rearAvatar" alt="后方火柴人" class="avatar" :style="avatarStyle" />
        <div class="body" :style="bodyStyle"></div>
        <!-- 左手臂（正常摆动） -->
        <div ref="rearLeftArm" class="arm left" :style="rearLeftArmStyle"></div>
        <!-- 右手臂（被拉的手，向前伸贴合前方） -->
        <div ref="rearRightArm" class="arm right being-pulled" :style="rearRightArmStyle"></div>
        <!-- 左腿 -->
        <div ref="rearLeftLeg" class="leg left" :style="rearLeftLegStyle"></div>
        <!-- 右腿 -->
        <div ref="rearRightLeg" class="leg right" :style="rearRightLegStyle"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
// 引入GSAP动画库
import gsap from 'gsap'

// 定义组件属性
const props = defineProps({
  /**
   * 进度值 (0-100)
   */
  progress: {
    type: Number,
    default: 15,
    validator: (v) => v >= 0 && v <= 100
  },
  /**
   * 前方火柴人头像
   */
  frontAvatar: {
    type: String,
    default: 'https://picsum.photos/id/1005/50/50'
  },
  /**
   * 后方火柴人头像
   */
  rearAvatar: {
    type: String,
    default: 'https://picsum.photos/id/1027/50/50'
  },
  /**
   * 火柴人尺寸 (px)
   */
  size: {
    type: Number,
    default: 40,
    validator: (v) => v >= 20 && v <= 100
  }
})

// 响应式数据
const frontFigurePosition = ref(0)
const rearFigurePosition = ref(0)

// 元素引用
const frontLeftArm = ref(null)
const frontRightArm = ref(null)
const frontLeftLeg = ref(null)
const frontRightLeg = ref(null)
const frontFigure = ref(null)

const rearLeftArm = ref(null)
const rearRightArm = ref(null)
const rearLeftLeg = ref(null)
const rearRightLeg = ref(null)
const rearFigure = ref(null)

// 动画时间线引用
let frontRunningTimeline = null
let rearRunningTimeline = null

// 计算属性 - 样式

// 容器样式
const containerStyle = computed(() => ({
  height: `${props.size + 40}px`
}))

// 头像样式
const avatarStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`
}))

// 身体样式
const bodyStyle = computed(() => ({
  top: `${props.size}px`,
  left: `${(props.size / 2) - 1.25}px`,
  height: `${props.size * 0.8}px`
}))

// 前方火柴人样式
const frontFigureStyle = computed(() => ({
  left: `${frontFigurePosition.value}%`,
  width: `${props.size}px`,
  height: `${props.size * 2}px`
}))

// 后方火柴人样式
const rearFigureStyle = computed(() => ({
  left: `${rearFigurePosition.value}%`,
  width: `${props.size}px`,
  height: `${props.size * 2}px`
}))

// 前方火柴人左手臂样式（拉人的手）
const frontLeftArmStyle = computed(() => ({
  top: `${props.size + 5}px`,
  left: `${8}px`,
  height: `${props.size * 0.6}px`, // 加长手臂够到后方
  rotate: '35deg'
}))

// 前方火柴人右手臂样式（正常摆动）
const frontRightArmStyle = computed(() => ({
  top: `${props.size + 5}px`,
  left: `${10}px`,
  height: `${props.size * 0.5}px`,
  rotate: '-55deg'
}))

// 前方火柴人左腿样式
const frontLeftLegStyle = computed(() => ({
  top: `${props.size + (props.size * 0.7)}px`,
  left: `${8}px`,
  height: `${props.size * 0.6}px`,
  rotate: '15deg'
}))

// 前方火柴人右腿样式
const frontRightLegStyle = computed(() => ({
  top: `${props.size + (props.size * 0.7)}px`,
  left: `${10}px`,
  height: `${props.size * 0.6}px`,
  rotate: '-15deg'
}))

// 后方火柴人左手臂样式（正常摆动）
const rearLeftArmStyle = computed(() => ({
  top: `${props.size + 5}px`,
  left: `${8}px`,
  height: `${props.size * 0.5}px`,
  rotate: '15deg'
}))

// 后方火柴人右手臂样式（被拉的手）
const rearRightArmStyle = computed(() => ({
  top: `${props.size + 5}px`,
  left: `${10}px`,
  height: `${props.size * 0.6}px`, // 加长手臂贴合前方
  rotate: '-35deg'
}))

// 后方火柴人左腿样式
const rearLeftLegStyle = computed(() => ({
  top: `${props.size + (props.size * 0.7)}px`,
  left: `${8}px`,
  height: `${props.size * 0.6}px`,
  rotate: '15deg'
}))

// 后方火柴人右腿样式
const rearRightLegStyle = computed(() => ({
  top: `${props.size + (props.size * 0.7)}px`,
  left: `${10}px`,
  height: `${props.size * 0.6}px`,
  rotate: '-15deg'
}))

// 创建前方火柴人跑步动画（主动拉人）
const createFrontRunningTimeline = () => {
  if (frontRunningTimeline) {
    frontRunningTimeline.kill()
  }

  frontRunningTimeline = gsap.timeline({
    repeat: -1,
    ease: 'power2.inOut',
    duration: 0.6
  })

  // 前方火柴人更主动，身体起伏更大，表现出拉人的力量感
  frontRunningTimeline.to(frontFigure.value, {
    y: -18,
    skewX: -3,
    duration: 0.3,
    ease: 'power2.inOut'
  })
    .to(frontFigure.value, {
      y: 0,
      skewX: -3,
      duration: 0.3,
      ease: 'power2.inOut'
    })

    // 头部摆动，表现出用力的表情
    .to(frontFigure.value.querySelector('.avatar'), {
      y: -3,
      rotate: 3,
      duration: 0.3,
      ease: 'power2.inOut'
    }, '<')
    .to(frontFigure.value.querySelector('.avatar'), {
      y: 0,
      rotate: -1,
      duration: 0.3,
      ease: 'power2.inOut'
    }, '<0.3')

    // 左手臂（拉人的手）：保持向前拉的姿势，摆动幅度较小，表现出拉人的状态
    // .to(frontLeftArm.value, {
    //   rotate: 35,
    //   duration: 0.3,
    //   ease: 'power2.inOut',
    //   immediateRender: true
    // })
    // .to(frontLeftArm.value, {
    //   rotate: 45,
    //   duration: 0.3,
    //   ease: 'power2.inOut'
    // })

    // 右手臂：大幅度摆动，表现出跑步的力量
    .to(frontRightArm.value, {
      rotate: -70,
      duration: 0.3,
      ease: 'power2.inOut',
      immediateRender: true
    }, '<')
    .to(frontRightArm.value, {
      rotate: 10,
      duration: 0.3,
      ease: 'power2.inOut'
    }, '<0.3')

    // 左腿：大步向前
    .to(frontLeftLeg.value, {
      rotate: -40,
      duration: 0.3,
      ease: 'power2.inOut',
      immediateRender: true
    }, '<')
    .to(frontLeftLeg.value, {
      rotate: 40,
      duration: 0.3,
      ease: 'power2.inOut'
    }, '<0.3')

    // 右腿：大步向后
    .to(frontRightLeg.value, {
      rotate: 40,
      duration: 0.3,
      ease: 'power2.inOut',
      immediateRender: true
    }, '<')
    .to(frontRightLeg.value, {
      rotate: -40,
      duration: 0.3,
      ease: 'power2.inOut'
    }, '<0.3')
}

// 创建后方火柴人跑步动画（被拉着跑）
const createRearRunningTimeline = () => {
  if (rearRunningTimeline) {
    rearRunningTimeline.kill()
  }

  rearRunningTimeline = gsap.timeline({
    repeat: -1,
    ease: 'power2.inOut',
    duration: 0.6,
    delay: 0.08 // 增加延迟，更明显表现出被拉着
  })

  // 后方火柴人更被动，身体起伏较小，表现出被拉着的状态
  rearRunningTimeline.to(rearFigure.value, {
    y: -10,
    skewX: 2,
    duration: 0.3,
    ease: 'power2.inOut'
  })
    .to(rearFigure.value, {
      y: 0,
      skewX: 2,
      duration: 0.3,
      ease: 'power2.inOut'
    })

    // 头部摆动，表现出跟随的状态
    .to(rearFigure.value.querySelector('.avatar'), {
      y: -2,
      rotate: 2,
      duration: 0.3,
      ease: 'power2.inOut'
    }, '<')
    .to(rearFigure.value.querySelector('.avatar'), {
      y: 0,
      rotate: -2,
      duration: 0.3,
      ease: 'power2.inOut'
    }, '<0.3')

    // 左手臂：自然摆动，幅度较大
    .to(rearLeftArm.value, {
      rotate: 30,
      duration: 0.3,
      ease: 'power2.inOut',
      immediateRender: true
    })
    .to(rearLeftArm.value, {
      rotate: 5,
      duration: 0.3,
      ease: 'power2.inOut'
    })

    // 右手臂（被拉的手）：保持被拉的姿势，几乎不摆动，表现出被拉着的状态
    // .to(rearRightArm.value, {
    //   rotate: -45,
    //   duration: 0.3,
    //   ease: 'power2.inOut',
    //   immediateRender: true
    // }, '<')
    // .to(rearRightArm.value, {
    //   rotate: -50,
    //   duration: 0.3,
    //   ease: 'power2.inOut'
    // }, '<0.3')

    // 左腿：小步跟随
    .to(rearLeftLeg.value, {
      rotate: -20,
      duration: 0.3,
      ease: 'power2.inOut',
      immediateRender: true
    }, '<')
    .to(rearLeftLeg.value, {
      rotate: 25,
      duration: 0.3,
      ease: 'power2.inOut'
    }, '<0.3')

    // 右腿：小步跟随
    .to(rearRightLeg.value, {
      rotate: 25,
      duration: 0.3,
      ease: 'power2.inOut',
      immediateRender: true
    }, '<')
    .to(rearRightLeg.value, {
      rotate: -20,
      duration: 0.3,
      ease: 'power2.inOut'
    }, '<0.3')
}

// 更新火柴人位置（使用固定百分比间距，确保在所有设备上一致）
const updateStickFigurePositions = () => {
  const maxFrontPos = 95 // 前方最大位置（避免超出可视区域）
  const fixedDistance = 5 // 使用固定百分比间距，确保在所有设备上一致
  const minTotalSpace = fixedDistance // 最小总空间需求

  let newFrontPos, newRearPos

  // 当进度值较小时，确保两个火柴人之间有足够的间距
  if (props.progress <= minTotalSpace) {
    // 进度太小时，固定间距布局
    newFrontPos = fixedDistance
    newRearPos = 0
  } else {
    // 正常情况下按进度和间距布局
    newFrontPos = Math.min(props.progress, maxFrontPos)
    // 后方位置 = 前方位置 - 固定间距百分比
    newRearPos = Math.max(0, newFrontPos - fixedDistance)
  }

  // 使用GSAP平滑过渡位置变化，与回忆滑动过渡时间保持一致
  gsap.to(frontFigurePosition, {
    value: newFrontPos,
    duration: 0.8,
    ease: 'power2.inOut'
  })

  gsap.to(rearFigurePosition, {
    value: newRearPos,
    duration: 0.8,
    ease: 'power2.inOut'
  })
}

// 监听进度变化，更新火柴人位置
watch(
  () => props.progress,
  () => {
    updateStickFigurePositions()
  },
  { immediate: true }
)

// 组件挂载时初始化动画
onMounted(() => {
  // 等待DOM渲染完成
  setTimeout(() => {
    createFrontRunningTimeline()
    createRearRunningTimeline()
  }, 0)
})

// 组件卸载时清理动画
onUnmounted(() => {
  if (frontRunningTimeline) {
    frontRunningTimeline.kill()
  }
  if (rearRunningTimeline) {
    rearRunningTimeline.kill()
  }
})
</script>

<style lang="scss" scoped>
// 自定义变量
$progress-track-height: 6px; // 进度轨道高度
$progress-track-color: #e5e7eb; // 进度轨道颜色
$border-radius-sm: 3px; // 小圆角
$stick-color: #333333; // 火柴人线条颜色（深色）
$shadow-color: rgba(0, 0, 0, 0.2); // 阴影颜色

/* 容器样式 */
.stick-figure-container {
  position: relative;
  width: 100%;
  min-width: 200px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

/* 进度轨道 - 公路样式 */
.progress-track {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: $progress-track-height;
  background: #1a1a1a; /* 公路黑色底色 */
  border-radius: $border-radius-sm;
  z-index: 0;
  /* 创建公路分隔线效果 */
  background-image: 
    linear-gradient(90deg, #ffffff 0%, #ffffff 2%, transparent 2%, transparent 98%, #ffffff 98%, #ffffff 100%),
    linear-gradient(90deg, #ffd700 0%, #ffd700 4%, transparent 4%, transparent 96%, #ffd700 96%, #ffd700 100%),
    linear-gradient(90deg, transparent 0%, transparent 50%, #ffd700 50%, #ffd700 52%, transparent 52%, transparent 100%);
  background-size: 
    100% 100%,
    100% 100%,
    40px 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

/* 火柴人基础样式 */
.stick-figure {
  position: absolute;
  bottom: $progress-track-height + 4px;
  transition: transform 0.3s ease;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 前方火柴人 */
.stick-figure.front {
  z-index: 2;
}

/* 后方火柴人 */
.stick-figure.rear {
  z-index: 1;
  opacity: 0.95;
}

/* 火柴人内部结构 */
.stick-figure .figure {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 后方火柴人跑步动画（轻微延迟，模拟跟随） - 由GSAP实现 */
.stick-figure.rear .figure {
  /* 动画由GSAP时间线控制 */
}

/* 头像 */
.stick-figure .avatar {
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 4px $shadow-color;
  border: 2px solid $stick-color;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* 身体 */
.stick-figure .body {
  position: absolute;
  width: 2.5px;
  background: $stick-color;
  z-index: 1;
  transition: all 0.3s ease;
}

/* 手臂基础样式 */
.stick-figure .arm {
  position: absolute;
  width: 2.5px;
  background: $stick-color;
  transform-origin: top center;
  z-index: 1;
  transition: all 0.3s ease;
}

/* 前方火柴人左手臂（拉人）- 向前伸，精准匹配后方手 */
.stick-figure.front .arm.left.pulling {
  /* 动画由GSAP时间线控制 */
}

/* 前方火柴人右手臂（正常摆动） */
.stick-figure.front .arm.right {
  /* 动画由GSAP时间线控制 */
}

/* 后方火柴人左手臂（正常摆动） */
.stick-figure.rear .arm.left {
  /* 动画由GSAP时间线控制 */
}

/* 后方火柴人右手臂（被拉）- 向前伸贴合前方 */
.stick-figure.rear .arm.right.being-pulled {
  /* 动画由GSAP时间线控制 */
}

/* 腿部基础样式 */
.stick-figure .leg {
  position: absolute;
  width: 2.5px;
  background: $stick-color;
  transform-origin: top center;
  z-index: 1;
  transition: all 0.3s ease;
}

/* 前方火柴人腿部动画 */
.stick-figure.front .leg.left {
  /* 动画由GSAP时间线控制 */
}

.stick-figure.front .leg.right {
  /* 动画由GSAP时间线控制 */
}

/* 后方火柴人腿部动画（轻微延迟） */
.stick-figure.rear .leg.left {
  /* 动画由GSAP时间线控制 */
}

.stick-figure.rear .leg.right {
  /* 动画由GSAP时间线控制 */
}

/* ================================ */
/* 动画由GSAP时间线控制，不再使用CSS关键帧 */
/* ================================ */
</style>