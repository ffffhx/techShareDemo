import { useState, useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  rootMargin?: string;
  threshold?: number;
  enabled?: boolean;
}

/**
 * Intersection Observer Hook
 * 用于实现可视化懒加载，当元素进入视口时触发回调
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    enabled = true,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    const currentElement = elementRef.current;
    observer.observe(currentElement);

    return () => {
      observer.disconnect();
    };
  }, [enabled, rootMargin, threshold]);

  // 重置可见性状态
  const reset = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    elementRef,
    reset,
  };
};

