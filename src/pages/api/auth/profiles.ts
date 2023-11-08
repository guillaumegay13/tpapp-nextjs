// pages/api/auth/profiles.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../../app/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No Authorization token provided.' });
  }
  if (req.method === 'GET') {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;

      // Optionally, retrieve additional user information from Firestore if needed
      // const userRecord = await admin.auth().getUser(uid);
      const doc = await admin.firestore().collection('profiles').doc(uid).get();
      if (!doc.exists) {
        return res.status(404).json({ message: 'Profile not found.' });
      }

      res.status(200).json(doc.data());
    } catch (error) {
      const message = (error as Error).message;
      res.status(500).json({ message });
    }
  } else if (req.method === "PUT") {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;

      await admin.firestore().collection('profiles').doc(uid).update(req.body);
      res.status(200).json({ message: 'Profile updated successfully.' });

    } catch (error) {
      const message = (error as Error).message;
      res.status(500).json({ message });
    }
  }
}