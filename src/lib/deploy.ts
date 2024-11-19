import { headers } from 'next/headers';

interface DeploymentConfig {
  formId: number;
  customDomain?: string;
}

export async function deployToVercel(config: DeploymentConfig) {
  const vercelToken = process.env.VERCEL_AUTH_TOKEN;
  
  try {
    // Create deployment
    const response = await fetch('https://api.vercel.com/v6/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `form-${config.formId}`,
        target: 'production',
        framework: 'nextjs',
        routes: [
          { src: '/api/.*', dest: '/api' },
          { src: '/(.*)', dest: '/' }
        ],
        env: {
          FORM_ID: config.formId.toString(),
        },
        ...(config.customDomain ? {
          alias: [config.customDomain]
        } : {})
      })
    });

    const deployment = await response.json();
    
    return {
      deploymentId: deployment.id,
      url: deployment.url
    };
  } catch (error) {
    console.error('Deployment error:', error);
    throw new Error('Failed to deploy form');
  }
}