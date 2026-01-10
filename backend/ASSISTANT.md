# AI Assistant Integration

This file documents the new `/api/assistant/chat` endpoint which proxies to the local `assistant.py` script.

## Endpoint

POST /api/assistant/chat

Request JSON:

{
  "message": "user query",
  "language": "hi",            // target language code (en, hi, gu, ...)
  "user_role": "farmer",      // "farmer" | "buyer"
  "needs_translation": true,   // optional, set true when user typed in a different language (e.g., typed in English but target is Gujarati)
  "original_text": "..."      // optional original text to translate
}

Response:

{
  "data": {
    "reply": "AI response text",
    "audio_url": "/assistant_audio/assistant_...mp3", // optional
    "translated_input": "..." // optional: the translated version of the input when translation was requested
  }
}

## Notes

- The backend runs `assistant.py` as a subprocess by default using `python`. If you need to use a different Python executable, set `PYTHON_EXECUTABLE` in the environment.
- Generated audio files are saved to `public/assistant_audio` and served statically from `/assistant_audio/*`.
- `assistant.py` also supports a `--translate` flow for translating the original text into the selected language before generating the reply.
