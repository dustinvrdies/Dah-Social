import sgMail from '@sendgrid/mail';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=sendgrid',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key || !connectionSettings.settings.from_email)) {
    throw new Error('SendGrid not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, email: connectionSettings.settings.from_email };
}

export async function getUncachableSendGridClient() {
  const { apiKey, email } = await getCredentials();
  sgMail.setApiKey(apiKey);
  return {
    client: sgMail,
    fromEmail: email
  };
}

export async function sendVerificationEmail(toEmail: string, code: string, username: string): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableSendGridClient();
    
    await client.send({
      to: toEmail,
      from: fromEmail,
      subject: 'DAH Social - Verify Your Email',
      text: `Hi ${username},\n\nYour verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you did not create an account, please ignore this email.\n\nThanks,\nDAH Social Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #E85D8C, #3B82F6); padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">DAH Social</h1>
          </div>
          <div style="background: #1a1a2e; padding: 30px; border-radius: 0 0 12px 12px; color: white;">
            <p style="margin: 0 0 20px;">Hi ${username},</p>
            <p style="margin: 0 0 20px;">Welcome to DAH Social! Use this code to verify your email:</p>
            <div style="background: rgba(232, 93, 140, 0.2); border: 2px solid #E85D8C; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #E85D8C;">${code}</span>
            </div>
            <p style="margin: 0 0 10px; color: #888;">This code expires in 10 minutes.</p>
            <p style="margin: 20px 0 0; color: #888; font-size: 12px;">If you did not create an account, please ignore this email.</p>
          </div>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

export async function sendWelcomeEmail(toEmail: string, username: string): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableSendGridClient();
    
    await client.send({
      to: toEmail,
      from: fromEmail,
      subject: 'Welcome to DAH Social!',
      text: `Welcome to DAH Social, ${username}!\n\nYour email has been verified. You now have a verified badge on your profile.\n\nStart exploring:\n- Connect with friends and creators\n- Share videos and content\n- Shop in the DAH Mall\n- Earn DAH Coins for your activity\n\nThanks for joining,\nDAH Social Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #E85D8C, #3B82F6); padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">Welcome to DAH Social!</h1>
          </div>
          <div style="background: #1a1a2e; padding: 30px; border-radius: 0 0 12px 12px; color: white;">
            <p style="margin: 0 0 20px;">Hi ${username},</p>
            <p style="margin: 0 0 20px;">Your email has been verified! You now have a <span style="color: #3B82F6;">verified badge</span> on your profile.</p>
            <div style="background: rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 10px; font-weight: bold;">Start exploring:</p>
              <ul style="margin: 0; padding-left: 20px; color: #ccc;">
                <li>Connect with friends and creators</li>
                <li>Share videos and content</li>
                <li>Shop in the DAH Mall</li>
                <li>Earn DAH Coins for your activity</li>
              </ul>
            </div>
            <p style="margin: 20px 0 0; color: #888;">Thanks for joining!</p>
          </div>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}
