import winston from "winston";

const { timestamp, json, prettyPrint, errors, combine, cli } = winston.format;

const brazilTimezoneOffset = -3 * 60; // GMT-3

const formatBrazilTimestamp = () => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000 - brazilTimezoneOffset * 60 * 1000;
    const newDate = new Date(now.getTime() - offsetMs);
    return newDate.toISOString();
};


export const cliLogger = winston.createLogger({
    level:"info",
    format: combine(
        winston.format((info) => {
            info.timestamp = formatBrazilTimestamp();
            return info;
        })(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${formatBrazilTimestamp()} ${level}: ${message}`;
        }),
        
        errors({stack:true})
    ),
    transports:[
        new winston.transports.Console(),
    ]
})


export const applicationLogger = winston.createLogger({
    level:"info",
    format: combine(
        json(),
        timestamp(),
        prettyPrint(),
        errors({stack:true})
    ),
    transports:[
        new winston.transports.File({filename:'app.log', level:'error'}),
    ]
})

//Deactivating logs in case of auto testing
if(process.env.NODE_ENV=="test"){
    cliLogger.transports.forEach((transport)=>{
        transport.silent = true;
    })
    applicationLogger.transports.forEach((transport)=>{
        transport.silent = true;
    })
}