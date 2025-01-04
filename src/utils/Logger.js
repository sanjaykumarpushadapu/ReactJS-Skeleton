// src/utils/logger.js

import { LOG_CONFIG } from '../constants';

class Logger {
  constructor(config) {
    this.config = config;
    this.logs = [];
    this.levels = ['DEBUG', 'INFO', 'WARN', 'ERROR']; // Log level hierarchy
  }

  log({ level, message, context = {}, trace = null }) {
    if (this.config.DISABLE_LOGGING) return;

    const currentLevelIndex = this.levels.indexOf(this.config.LOG_LEVEL);
    const messageLevelIndex = this.levels.indexOf(level);

    // Check if the log level is enabled
    if (messageLevelIndex < currentLevelIndex) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      trace,
    };

    // Add the new log entry and maintain max logs
    this.logs.push(logEntry);
    if (this.logs.length > this.config.MAX_LOGS) {
      this.logs.shift(); // Remove oldest log
    }

    // Optionally log to the console
    if (this.config.ENABLE_CONSOLE_LOGS) {
      this.outputToConsole(logEntry);
    }
  }

  outputToConsole(logEntry) {
    const { timestamp, level, message, context, trace } = logEntry;
    console.log(`[${timestamp}] [${level}] - ${message}`, context);
    if (trace) {
      console.error(`Trace: ${trace}`);
    }
  }

  info(message, context = {}) {
    this.log({ level: 'INFO', message, context });
  }

  warn(message, context = {}) {
    this.log({ level: 'WARN', message, context });
  }

  error(message, error = null, context = {}) {
    this.log({
      level: 'ERROR',
      message,
      context,
      trace: error?.stack || null,
    });
  }

  debug(message, context = {}) {
    this.log({ level: 'DEBUG', message, context });
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

const logger = new Logger(LOG_CONFIG);
export default logger;
