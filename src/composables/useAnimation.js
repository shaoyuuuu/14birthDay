/**
 * useAnimation.js - 通用动画逻辑组合式函数
 * 封装项目中可复用的GSAP动画效果
 */
import gsap from "gsap";

/**
 * 创建卡片进入动画
 * @param {HTMLElement} cardContent - 卡片内容元素
 */
export const createCardEnterAnimation = (cardContent) => {
  if (!cardContent) return;

  const titleSection = cardContent.querySelector(".card-title-section");
  const cardNumber = cardContent.querySelector(".card-number");
  const cardTitle = cardContent.querySelector(".card-title");
  const date = cardContent.querySelector(".card-date");
  const imageWrapper = cardContent.querySelector(".card-image-wrapper");
  const mainImageContainer = cardContent.querySelector(
    ".card-main-image-container"
  );
  const thumbnails = cardContent.querySelector(".card-thumbnails");
  const textSection = cardContent.querySelector(".card-text-section");
  const description = cardContent.querySelector(".card-description");
  const memory = cardContent.querySelector(".card-memory");

  if (
    !cardNumber ||
    !cardTitle ||
    !date ||
    !mainImageContainer ||
    !thumbnails ||
    !description ||
    !memory
  ) {
    return;
  }

  // 重置所有元素的初始状态
  gsap.set(
    [
      titleSection,
      cardNumber,
      cardTitle,
      date,
      imageWrapper,
      mainImageContainer,
      thumbnails,
      textSection,
      description,
      memory,
    ],
    {
      opacity: 0,
    }
  );

  // 设置标题部分的初始状态
  gsap.set(cardNumber, {
    y: -20,
    scale: 0.8,
    rotationX: -20,
  });

  gsap.set(cardTitle, {
    y: -30,
    rotationX: -20,
  });

  // 设置日期的初始状态
  gsap.set(date, {
    y: -20,
  });

  gsap.set(thumbnails, {
    y: 20,
  });

  // 设置文本部分的初始状态
  gsap.set(description, {
    y: 20,
  });

  gsap.set(memory, {
    y: 20,
  });

  // 执行序列动画，增强怀旧感和3D效果
  const tl = gsap.timeline({
    defaults: {
      duration: 1.0,
      ease: "power4.out",
    },
  });

  // 标题部分的交错动画
  tl.to(cardNumber, {
    opacity: 1,
    y: 0,
    scale: 1,
    rotationX: 0,
    rotationY: 0,
    duration: 0.7,
    ease: "back.out(1.5)",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
  })
    .to(
      cardTitle,
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "back.out(1.3)",
        textShadow:
          "2px 2px 4px rgba(255, 255, 255, 0.8), 0 0 10px rgba(200, 247, 197, 0.5)",
      },
      "-=0.4"
    )
    .to(
      date,
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.5"
    )
    .to(
      mainImageContainer,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotationX: 5,
        rotationY: 0,
        duration: 1.0,
        ease: "elastic.out(1, 0.75)",
        boxShadow:
          "0 25px 50px rgba(102, 187, 106, 0.15), 0 15px 30px rgba(102, 187, 106, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
      },
      "-=0.4"
    )
    .to(
      thumbnails,
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power3.out",
        transform: "perspective(800px) rotateX(0deg) translateY(0px)",
      },
      "-=0.6"
    )
    .to(
      description,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.5"
    )
    .to(
      memory,
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power4.out",
        backgroundColor: "rgba(200, 247, 197, 0.15)",
      },
      "-=0.6"
    );

  // 添加卡片整体的微动画效果，增强小清新感
  tl.to(
    cardContent,
    {
      boxShadow:
        "0 25px 50px rgba(102, 187, 106, 0.15), 0 15px 30px rgba(102, 187, 106, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
      duration: 0.8,
      ease: "power2.out",
      transform:
        "perspective(1500px) translateZ(30px) translateY(-10px) rotateX(-2deg)",
    },
    "-=1.0"
  );

  return tl;
};

/**
 * 创建滑动引导动画
 * @param {HTMLElement} swipeIndicator - 滑动指示器元素
 */
export const createSwipeGuideAnimation = (swipeIndicator) => {
  if (!swipeIndicator) return null;

  const swipeGuideTimeline = gsap.timeline({
    repeat: -1,
    duration: 2,
    ease: "power2.inOut",
  });

  swipeGuideTimeline
    .to(swipeIndicator, {
      x: -20,
      opacity: 1,
      duration: 1,
      ease: "power2.inOut",
    })
    .to(swipeIndicator, {
      x: 0,
      opacity: 0.7,
      duration: 1,
      ease: "power2.inOut",
    });

  return swipeGuideTimeline;
};

/**
 * 创建图片切换动画配置
 */
export const createImageTransitionConfig = () => {
  return {
    beforeEnter: (el) =>
      gsap.set(el, { opacity: 0, scale: 1.05, rotationY: 10 }),
    enter: (el, done) => {
      gsap.to(el, {
        duration: 0.5,
        opacity: 1,
        scale: 1,
        rotationY: 0,
        ease: "power3.out",
        onComplete: done,
      });
    },
    beforeLeave: (el) => gsap.set(el, { opacity: 1, scale: 1, rotationY: 0 }),
    leave: (el, done) => {
      gsap.to(el, {
        duration: 0.4,
        opacity: 0,
        scale: 0.95,
        rotationY: -10,
        ease: "power3.in",
        onComplete: done,
      });
    },
  };
};

/**
 * 创建元素淡入动画
 * @param {HTMLElement} element - 要动画的元素
 * @param {Object} options - 动画选项
 */
export const createFadeInAnimation = (element, options = {}) => {
  if (!element) return null;

  const { duration = 0.6, delay = 0, y = 30 } = options;

  return gsap.fromTo(
    element,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power2.out",
    }
  );
};

/**
 * 创建交错动画
 * @param {HTMLElement[]} elements - 要动画的元素数组
 * @param {Object} options - 动画选项
 */
export const createStaggerAnimation = (elements, options = {}) => {
  if (!elements || elements.length === 0) return null;

  const { duration = 0.5, stagger = 0.1, delay = 0, y = 20 } = options;

  return gsap.fromTo(
    elements,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: "power2.out",
    }
  );
};

/**
 * 清理动画时间线
 * @param {Timeline} timeline - 要清理的GSAP时间线
 */
export const clearAnimation = (timeline) => {
  if (timeline) {
    timeline.kill();
  }
};

/**
 * 导出默认的动画组合式函数
 */
export default function useAnimation() {
  return {
    createCardEnterAnimation,
    createSwipeGuideAnimation,
    createImageTransitionConfig,
    createFadeInAnimation,
    createStaggerAnimation,
    clearAnimation,
  };
}
