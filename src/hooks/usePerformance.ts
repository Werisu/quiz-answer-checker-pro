import { useCallback, useEffect, useRef } from "react";

export interface PerformanceMetrics {
  renderTime: number;
  dataFetchTime: number;
  calculationTime: number;
  memoryUsage?: number;
  componentMounts: number;
  reRenders: number;
}

export const usePerformance = (componentName: string) => {
  const mountTimeRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);
  const lastRenderTimeRef = useRef<number>(0);
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    dataFetchTime: 0,
    calculationTime: 0,
    componentMounts: 0,
    reRenders: 0,
  });

  // Medir tempo de renderização
  const measureRender = useCallback(() => {
    const now = performance.now();
    const renderTime = now - lastRenderTimeRef.current;

    metricsRef.current.renderTime = renderTime;
    metricsRef.current.reRenders++;

    lastRenderTimeRef.current = now;

    // Log de performance em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 ${componentName} - Render: ${renderTime.toFixed(2)}ms (Total: ${
          metricsRef.current.reRenders
        })`
      );
    }
  }, [componentName]);

  // Medir tempo de fetch de dados
  const measureDataFetch = useCallback(
    async <T>(fetchFn: () => Promise<T>): Promise<T> => {
      const startTime = performance.now();

      try {
        const result = await fetchFn();
        const fetchTime = performance.now() - startTime;

        metricsRef.current.dataFetchTime = fetchTime;

        if (process.env.NODE_ENV === "development") {
          console.log(
            `📡 ${componentName} - Data Fetch: ${fetchTime.toFixed(2)}ms`
          );
        }

        return result;
      } catch (error) {
        const fetchTime = performance.now() - startTime;
        metricsRef.current.dataFetchTime = fetchTime;

        if (process.env.NODE_ENV === "development") {
          console.error(
            `❌ ${componentName} - Data Fetch Error: ${fetchTime.toFixed(2)}ms`,
            error
          );
        }

        throw error;
      }
    },
    [componentName]
  );

  // Medir tempo de cálculos
  const measureCalculation = useCallback(
    <T>(calculationFn: () => T): T => {
      const startTime = performance.now();

      const result = calculationFn();
      const calculationTime = performance.now() - startTime;

      metricsRef.current.calculationTime = calculationTime;

      if (process.env.NODE_ENV === "development") {
        console.log(
          `🧮 ${componentName} - Calculation: ${calculationTime.toFixed(2)}ms`
        );
      }

      return result;
    },
    [componentName]
  );

  // Obter métricas atuais
  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...metricsRef.current };
  }, []);

  // Resetar métricas
  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      renderTime: 0,
      dataFetchTime: 0,
      calculationTime: 0,
      componentMounts: 0,
      reRenders: 0,
    };
  }, []);

  // Medir uso de memória (se disponível)
  const measureMemory = useCallback(() => {
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      metricsRef.current.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB

      if (process.env.NODE_ENV === "development") {
        console.log(
          `💾 ${componentName} - Memory: ${metricsRef.current.memoryUsage.toFixed(
            2
          )}MB`
        );
      }
    }
  }, [componentName]);

  // Hook de efeito para medir montagem
  useEffect(() => {
    mountTimeRef.current = performance.now();
    lastRenderTimeRef.current = mountTimeRef.current;
    metricsRef.current.componentMounts++;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `🎯 ${componentName} - Mounted (Total: ${metricsRef.current.componentMounts})`
      );
    }

    // Medir memória na montagem
    measureMemory();

    // Cleanup ao desmontar
    return () => {
      const totalTime = performance.now() - mountTimeRef.current;

      if (process.env.NODE_ENV === "development") {
        console.log(
          `👋 ${componentName} - Unmounted (Total time: ${totalTime.toFixed(
            2
          )}ms)`
        );
        console.log(`📊 ${componentName} - Final Metrics:`, getMetrics());
      }
    };
  }, [componentName, measureMemory, getMetrics]);

  // Hook de efeito para medir cada render
  useEffect(() => {
    measureRender();
  });

  return {
    measureDataFetch,
    measureCalculation,
    measureMemory,
    getMetrics,
    resetMetrics,
    metrics: metricsRef.current,
  };
};

// Hook para medir performance de operações específicas
export const useOperationPerformance = (operationName: string) => {
  const operationTimesRef = useRef<number[]>([]);
  const totalOperationsRef = useRef<number>(0);

  const measureOperation = useCallback(
    async <T>(operationFn: () => Promise<T> | T): Promise<T> => {
      const startTime = performance.now();
      totalOperationsRef.current++;

      try {
        const result = await operationFn();
        const operationTime = performance.now() - startTime;

        operationTimesRef.current.push(operationTime);

        // Manter apenas os últimos 100 tempos para estatísticas
        if (operationTimesRef.current.length > 100) {
          operationTimesRef.current.shift();
        }

        if (process.env.NODE_ENV === "development") {
          console.log(
            `⚡ ${operationName} - Operation ${
              totalOperationsRef.current
            }: ${operationTime.toFixed(2)}ms`
          );
        }

        return result;
      } catch (error) {
        const operationTime = performance.now() - startTime;

        if (process.env.NODE_ENV === "development") {
          console.error(
            `❌ ${operationName} - Operation ${
              totalOperationsRef.current
            } Error: ${operationTime.toFixed(2)}ms`,
            error
          );
        }

        throw error;
      }
    },
    [operationName]
  );

  const getOperationStats = useCallback(() => {
    const times = operationTimesRef.current;
    if (times.length === 0) return null;

    const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const p95 = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)];

    return {
      totalOperations: totalOperationsRef.current,
      averageTime: avg,
      minTime: min,
      maxTime: max,
      p95Time: p95,
      recentTimes: times.slice(-10), // Últimos 10 tempos
    };
  }, []);

  return {
    measureOperation,
    getOperationStats,
    totalOperations: totalOperationsRef.current,
  };
};
