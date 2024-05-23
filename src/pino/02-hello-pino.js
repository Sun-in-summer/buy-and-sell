import pino from 'pino';

const logger = pino();

logger.info('Hello, world!');
logger.warn('Test warning');
logger.error('Add error');
