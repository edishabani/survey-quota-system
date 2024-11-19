import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deployToVercel } from '@/lib/deploy';

export async function POST(request: Request) {
  try {
    const { formId, customDomain } = await request.json();

    // Validate form exists
    const form = await db.forms.getById(formId);
    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Deploy to Vercel
    const deployment = await deployToVercel({
      formId,
      customDomain
    });

    // Save deployment info
    await db.deployments.create({
      formId,
      url: deployment.url,
      customDomain,
      vercelDeploymentId: deployment.deploymentId,
      status: 'deployed'
    });

    return NextResponse.json({
      success: true,
      url: deployment.url
    });

  } catch (error) {
    console.error('Deployment error:', error);
    return NextResponse.json(
      { error: 'Deployment failed' },
      { status: 500 }
    );
  }
}