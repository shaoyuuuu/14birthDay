const { logger } = require('./logger')

class MetricsCollector {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        success: 0,
        error: 0,
      },
      responseTime: {
        total: 0,
        count: 0,
        avg: 0,
      },
      endpoints: {},
    }
  }

  recordRequest(method, path, statusCode, duration) {
    this.metrics.requests.total++

    if (statusCode >= 200 && statusCode < 400) {
      this.metrics.requests.success++
    } else {
      this.metrics.requests.error++
    }

    this.metrics.responseTime.total += duration
    this.metrics.responseTime.count++
    this.metrics.responseTime.avg = this.metrics.responseTime.total / this.metrics.responseTime.count

    const endpointKey = `${method} ${path}`
    if (!this.metrics.endpoints[endpointKey]) {
      this.metrics.endpoints[endpointKey] = {
        count: 0,
        success: 0,
        error: 0,
        avgResponseTime: 0,
        totalResponseTime: 0,
      }
    }

    const endpoint = this.metrics.endpoints[endpointKey]
    endpoint.count++
    endpoint.totalResponseTime += duration
    endpoint.avgResponseTime = endpoint.totalResponseTime / endpoint.count

    if (statusCode >= 200 && statusCode < 400) {
      endpoint.success++
    } else {
      endpoint.error++
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    }
  }

  resetMetrics() {
    this.metrics = {
      requests: {
        total: 0,
        success: 0,
        error: 0,
      },
      responseTime: {
        total: 0,
        count: 0,
        avg: 0,
      },
      endpoints: {},
    }
  }

  logMetrics() {
    logger.info('Current metrics:', this.getMetrics())
  }
}

const metricsCollector = new MetricsCollector()

const metricsMiddleware = (req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    metricsCollector.recordRequest(req.method, req.path, res.statusCode, duration)
  })

  next()
}

module.exports = {
  MetricsCollector,
  metricsCollector,
  metricsMiddleware,
}
