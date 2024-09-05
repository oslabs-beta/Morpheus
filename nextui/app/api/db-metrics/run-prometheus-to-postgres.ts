import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  exec('python /Morpheus/scripts/prometheus_to_postgres.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ message: 'Script execution failed', error: error.message });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ message: 'Script execution failed', error: stderr });
    }
    console.log(`stdout: ${stdout}`);
    res.status(200).json({ message: 'Script executed successfully', output: stdout });
  });
}
