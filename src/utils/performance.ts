// src/utils/performance.ts

/**
 * 开始一个性能标记
 * @param markName - 标记的名称
 */
export const startPerformanceMark = (markName: string) => {
  if (performance && performance.mark) {
    performance.mark(markName);
  }
};

/**
 * 结束一个性能测量，并打印到控制台
 * @param measureName - 测量的名称
 * @param startMarkName - 开始标记的名称
 * @param endMarkName - 结束标记的名称 (可选)
 */
export const endPerformanceMeasure = (measureName: string, startMarkName: string, endMarkName?: string) => {
  if (performance && performance.measure) {
    try {
      performance.measure(measureName, startMarkName, endMarkName);
      const measures = performance.getEntriesByName(measureName, 'measure');
      if (measures.length > 0) {
        const measure = measures[measures.length - 1];
        console.log(`${measure.name} took: ${measure.duration.toFixed(2)}ms`);
        // 清理标记和测量，避免内存泄漏
        performance.clearMarks(startMarkName);
        if (endMarkName) {
          performance.clearMarks(endMarkName);
        }
        performance.clearMeasures(measureName);
      }
    } catch (e) {
      // console.error(`Performance measure '${measureName}' failed.`, e);
    }
  }
};

/**
 * 测量一个函数的执行时间
 * @param functionName - 函数名，用于日志输出
 * @param fn - 需要被测量的函数
 * @returns 返回一个包装后的函数
 */
export const measureFunctionExecution = <T extends (...args: any[]) => any>(
  functionName: string,
  fn: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    const startMark = `${functionName}_start`;
    const measureName = `${functionName}_execution`;

    startPerformanceMark(startMark);

    const result = fn(...args);

    // 检查函数是否返回 Promise
    if (result && typeof result.then === 'function') {
      return result.then((resolvedResult: any) => {
        endPerformanceMeasure(measureName, startMark);
        return resolvedResult;
      }).catch((error: any) => {
        endPerformanceMeasure(measureName, startMark);
        throw error;
      });
    } else {
      endPerformanceMeasure(measureName, startMark);
      return result;
    }
  };
};

