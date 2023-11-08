// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../../app/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { idToken } = req.body;
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // Optionally, retrieve additional user information from Firestore if needed
      const userRecord = await admin.auth().getUser(uid);

      res.status(200).json({ uid: uid, email: userRecord.email });
    } catch (error) {
      const message = (error as Error).message;
      res.status(401).json({ message });
  }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}