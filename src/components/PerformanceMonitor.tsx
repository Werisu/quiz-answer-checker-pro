import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  friendsRequestTime: number;
  cacheHitRate: number;
  totalRequests: number;
  cachedRequests: number;
}

interface PerformanceMonitorProps {
  className?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ className = '' }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    friendsRequestTime: 0,
    cacheHitRate: 0,
    totalRequests: 0,
    cachedRequests: 0
  });

  useEffect(() => {
    // Monitorar logs de performance
    const originalLog = console.log;
    const performanceLogs: string[] = [];

    console.log = (...args) => {
      const message = args.join(' ');
      performanceLogs.push(message);
      
      // Extrair métricas dos logs
      if (message.includes('Friends fetch completed in')) {
        const timeMatch = message.match(/(\d+)ms/);
        if (timeMatch) {
          setMetrics(prev => ({
            ...prev,
            friendsRequestTime: parseInt(timeMatch[1])
          }));
        }
      }
      
      if (message.includes('Cache hit')) {
        setMetrics(prev => ({
          ...prev,
          cachedRequests: prev.cachedRequests + 1,
          totalRequests: prev.totalRequests + 1
        }));
      }
      
      if (message.includes('Iniciando busca de amigos')) {
        setMetrics(prev => ({
          ...prev,
          totalRequests: prev.totalRequests + 1
        }));
      }
      
      originalLog.apply(console, args);
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  useEffect(() => {
    // Calcular cache hit rate
    if (metrics.totalRequests > 0) {
      setMetrics(prev => ({
        ...prev,
        cacheHitRate: (prev.cachedRequests / prev.totalRequests) * 100
      }));
    }
  }, [metrics.totalRequests, metrics.cachedRequests]);

  const getPerformanceColor = (time: number) => {
    if (time < 200) return 'text-green-600';
    if (time < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (time: number) => {
    if (time < 200) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (time < 500) return <Clock className="w-4 h-4 text-yellow-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getCacheHitColor = (rate: number) => {
    if (rate > 80) return 'text-green-600';
    if (rate > 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 shadow-sm ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <span>Performance Monitor</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Tempo de Requisição */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {getPerformanceIcon(metrics.friendsRequestTime)}
              <span className={`text-2xl font-bold ${getPerformanceColor(metrics.friendsRequestTime)}`}>
                {metrics.friendsRequestTime}ms
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Tempo de Resposta</div>
            <Badge 
              variant={metrics.friendsRequestTime < 200 ? "default" : "secondary"}
              className="mt-1"
            >
              {metrics.friendsRequestTime < 200 ? 'Excelente' : 
               metrics.friendsRequestTime < 500 ? 'Bom' : 'Lento'}
            </Badge>
          </div>

          {/* Cache Hit Rate */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {metrics.cacheHitRate.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Cache Hit Rate</div>
            <Badge 
              variant={metrics.cacheHitRate > 80 ? "default" : "secondary"}
              className="mt-1"
            >
              {metrics.cacheHitRate > 80 ? 'Alto' : 
               metrics.cacheHitRate > 50 ? 'Médio' : 'Baixo'}
            </Badge>
          </div>
        </div>

        {/* Estatísticas Detalhadas */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>Total de Requisições:</span>
            <span className="font-medium">{metrics.totalRequests}</span>
          </div>
          <div className="flex justify-between">
            <span>Requisições em Cache:</span>
            <span className="font-medium">{metrics.cachedRequests}</span>
          </div>
          <div className="flex justify-between">
            <span>Melhoria vs Anterior:</span>
            <span className="font-medium text-green-600">
              {metrics.friendsRequestTime > 0 ? 
                `${Math.round((866 - metrics.friendsRequestTime) / 866 * 100)}% mais rápido` : 
                'Calculando...'}
            </span>
          </div>
        </div>

        {/* Barra de Progresso Visual */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Performance</span>
            <span>{metrics.friendsRequestTime}ms / 866ms</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                metrics.friendsRequestTime < 200 ? 'bg-green-500' :
                metrics.friendsRequestTime < 500 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.min((metrics.friendsRequestTime / 866) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
