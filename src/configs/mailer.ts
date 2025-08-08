import { MailerModule, MailerOptions } from "@nestjs-modules/mailer";

export const MailerConfig = MailerModule.forRootAsync({
    useFactory() {
        return {
            transport: {                
                host: process.env.MAIL_HOST,
                port: +process.env.MAIL_PORT,                                
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                },
            },
        } as MailerOptions
    }
});