// app/api/pppoe-users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { RouterOSAPI } from 'node-routeros';
import 'source-map-support/register';

export async function GET(req: NextRequest) {
  const api = new RouterOSAPI({
    host: '10.10.19.1',
    user: 'admin',
    password: 'Camara3hd',
    port: 8728, // Default port for RouterOS API, change if necessary
  });

  try {
    await api.connect();
    const users = await api.write('/ppp/secret/print');
    await api.close();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data from MikroTik' }, { status: 500 });
  }
}

export async function handler(req: NextRequest) {
  const { method } = req;

  if (method === 'GET') {
    return GET(req);
  } else {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
}

