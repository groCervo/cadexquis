import { injectable } from "tsyringe";
import { createLogger, format, transports } from "winston";
import winston from "winston";

export interface ILoggerService {
    logError(error: string): void;
    logInfo(info: string): void;
}

@injectable()
export class LoggerService implements ILoggerService {
    logger: winston.Logger; 

    constructor(){
        this.logger = createLogger({
            level: 'info',
            format: format.combine(
              format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
              }),
              format.errors({ stack: true }),
              format.splat(),
              format.json()
            ),
            defaultMeta: { service: 'cadavre-exquis' },
            transports: [
              //
              // - Write to all logs with level `info` and below to `bot-combined.log`.
              // - Write all logs error (and below) to `bot-error.log`.
              //
              new transports.File({ filename: 'bot-error.log', level: 'error' }),
              new transports.File({ filename: 'bot-combined.log' })
            ]
        });

        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new transports.Console({
              format: format.combine(
                format.colorize(),
                format.simple()
              )
            }));
        }
    }

    logError(error: string): void {
        this.logger.log('error', error);
    }
    
    logInfo(info: string): void {
        this.logger.log('info', info);
    }

}
