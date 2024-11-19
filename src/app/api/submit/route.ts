import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { clickId, answers } = data;

    if (!clickId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get quota groups and check if exceeded
    const quotaGroups = await sql`SELECT * FROM quota_groups;`;
    
    // Get redirect URLs
    const settings = await sql`
      SELECT success_url, dq_url 
      FROM settings 
      ORDER BY created_at DESC 
      LIMIT 1;
    `;

    const { success_url, dq_url } = settings.rows[0];

    // Store response
    await sql`
      INSERT INTO responses (click_id, answers)
      VALUES (${clickId}, ${JSON.stringify(answers)});
    `;

    // Determine redirect URL
    const redirectUrl = quotaGroups.rowCount > 0 
      ? dq_url.replace('{clickid}', clickId)
      : success_url.replace('{clickid}', clickId);

    return NextResponse.json({
      success: true,
      redirect: redirectUrl
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
