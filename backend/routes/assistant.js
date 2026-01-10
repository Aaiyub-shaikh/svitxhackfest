import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// POST /api/assistant/chat
router.post('/chat', async (req, res) => {
  const { message, language, user_role } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: { message: 'Missing or invalid `message` in payload' } });
  }

  const pythonCmd = process.env.PYTHON_EXECUTABLE || 'python';
  const scriptPath = path.join(__dirname, '..', '..', 'assistant.py');

  // Build args for python script
  const args = [scriptPath, '--message', message, '--language', language || 'en', '--user_role', user_role || 'farmer'];

  // Optional translation support
  if (req.body && req.body.needs_translation && req.body.original_text) {
    args.push('--translate');
    args.push('--original_text', req.body.original_text);
  }

  try {
    const child = spawn(pythonCmd, args, { cwd: path.join(__dirname, '..', '..') });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error('assistant.py exited with code', code, 'stderr:', stderr);
        return res.status(500).json({ error: { message: 'Assistant service failed' } });
      }

      try {
        const parsed = JSON.parse(stdout);
        // Build returned payload
        const responsePayload = {
          reply: parsed.reply || '',
          audio_url: parsed.audio_path || null,
          translated_input: parsed.translated_input || null,
        };
        return res.json({ data: responsePayload });
      } catch (err) {
        console.error('Failed to parse assistant output:', err, 'stdout:', stdout);
        return res.status(500).json({ error: { message: 'Invalid response from assistant' } });
      }
    });
  } catch (err) {
    console.error('Error running assistant.py', err);
    return res.status(500).json({ error: { message: 'Failed to run assistant service' } });
  }
});

export default router;