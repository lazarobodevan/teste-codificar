import winston from "winston";

const { timestamp, json, prettyPrint, errors, combine, cli } = winston.format;

export const cliLogger = winston.createLogger({
    level:"info",
    format: combine(
        cli(),
        timestamp(),
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
        prettyPrint(),
        timestamp(),
        errors({stack:true})
    ),
    transports:[
        new winston.transports.File({filename:'app.log', level:'error'}),
    ]
})