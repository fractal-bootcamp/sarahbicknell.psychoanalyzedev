import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(request: Request) {
  const { input } = await request.json();

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db('psychdevclust');

  try {
    const result = await db.collection('inputs').insertOne({
      input,
      timestamp: new Date()
    });

    await client.close();

    return NextResponse.json({ message: 'Input logged successfully', id: result.insertedId }, { status: 200 });
  } catch (error) {
    await client.close();
    return NextResponse.json({ message: 'Error logging input', error: (error as Error).message }, { status: 500 });
  }
}