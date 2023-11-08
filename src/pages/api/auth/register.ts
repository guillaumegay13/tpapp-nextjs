// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../../app/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });

      // Create a user profile document in Firestore
      await admin.firestore().collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: userRecord.email,
        // any other user details
      });

      // Optionally, create a profile in a separate collection
      await admin.firestore().collection('profiles').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: userRecord.email,
        // ...other profile fields with initial values
      });

      res.status(201).json({ uid: userRecord.uid });
    } catch (error) {
        const message = (error as Error).message;
        res.status(500).json({ message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}