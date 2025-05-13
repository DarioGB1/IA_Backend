import { MailType } from "@app/shared";

export class MailViews {
    private static BuildCreateAccountView(user: string, code: string) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px; }
                .container { background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); display: inline-block; }
                .code { font-size: 24px; font-weight: bold; background: #007BFF; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class='container'>
                <h2>Hola, ${user}</h2>
                <p>Gracias por registrarte en <strong>AI Learn</strong>. Para completar tu registro, ingresa el siguiente código de verificación en la plataforma:</p>
                <p class='code'>${code}</p>
                <p>Si no solicitaste este código, puedes ignorar este mensaje.</p>
                <p>Saludos,<br>El equipo de <strong>AI Learn</strong></p>
            </div>
        </body>
        </html>`;
    }

    static buildView(type: MailType, user: string, code: string) {
        switch (type) {
            case MailType.Verification:
                return this.BuildCreateAccountView(user, code);
            default:
                throw new Error('Not Implemented.');
        }
    }
}