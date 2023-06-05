export default class {
    constructor(init) {
        if (typeof (init) != "undefined") {
            Object.assign(this, init)
        }
    }
    async email() {
        const oBody = {
            'from': {
                'email': this.from,
            },
            'personalizations': [
                {
                    'to': [
                        {
                            'email': this.to,
                        },
                    ],
                    'dynamic_template_data': this.dynamic_template_data,
                },
            ],
            'template_id': this.template_id,
        };
        const oHeaders = new Headers();
        oHeaders.append('Authorization', `Bearer ${this.accessToken}`);
        oHeaders.append('Content-Type', 'application/json');

        const email = await fetch('https://api.sendgrid.com/v3/mail/send', {
            body: JSON.stringify(oBody),
            headers: oHeaders,
            method: 'POST',
        });
        return email;
    }
}