
import mongoose from 'mongoose';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { DatabaseClientInterface } from './database-client.interface.js';
import { Component } from '../../types/index.js';
import { LoggerInterface } from '../logger/index.js';


const RETRY_COUNT = 5;
// const RETRY_TIMEOUT = 1000;

@injectable()
export class MongoDatabaseClient implements DatabaseClientInterface {


  private isConnected: boolean;

  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface) {
    this.isConnected = false;
  }

  public isConnectedToDatabase() {
    return this.isConnected;
  }


  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to MongoDB...');

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        await mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Database connection established.');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, error as Error);

      }
    }

    throw new Error(`Unable to establish database connection after ${RETRY_COUNT}`);

    this.logger.info('Database connection established.');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase()) {
      throw new Error('Not connected to the database');
    }

    await mongoose.disconnect();
    this.isConnected = false;
    this.logger.info('Database connection closed.');
  }
}
