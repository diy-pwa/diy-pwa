import readRequestBody from './readRequestBody.js';
export default {
  async fetch(request, env) {
    if (request.method != "POST") {
      throw new Error("email must be post request");
    }
    const dynamic_template_data = await readRequestBody(request);
    const oBody = {
      'from': {
        'email': env.FROM,
      },
      'personalizations': [
        {
          'to': [
            {
              'email': env.TO,
            },
          ],
          'dynamic_template_data': dynamic_template_data,
        },
      ],
      'template_id': env.TEMPLATE,
    };
    const oHeaders = new Headers();
    oHeaders.append('Authorization', `Bearer ${env.ACCESS_TOKEN}`);
    oHeaders.append('Content-Type', 'application/json');

    const email = await fetch('https://api.sendgrid.com/v3/mail/send', {
      body: JSON.stringify(oBody),
      headers: oHeaders,
      method: 'POST',
    });
    return email;

  }
};