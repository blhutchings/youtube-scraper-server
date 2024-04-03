import winston, { format, transports, createLogger } from 'winston';
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} - ${level}: ${message}`;
});

const Logger = createLogger({
    level: 'info',
    format: format.combine(
        winston.format.timestamp(),
        myFormat
    ),
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    Logger.add(
        new transports.Console({
            format: combine(
                format.colorize({
                    level: true,
                })
            ),
        })
    );
}

export default Logger;
