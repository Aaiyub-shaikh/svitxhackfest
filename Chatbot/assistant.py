from groq import Groq
import speech_recognition as sr
import os
import time
import asyncio
from edge_tts import Communicate

# ---------- API KEY ----------
client = Groq(api_key=process.env.groq_api_key)

# ---------- LANGUAGE MAPPING ----------
languages = {
    "1": ("Hindi", "hi"),
    "2": ("Gujarati", "gu"),
    "3": ("Tamil", "ta"),
    "4": ("Telugu", "te"),
    "5": ("Kannada", "kn"),
    "6": ("Malayalam", "ml"),
    "7": ("Marathi", "mr"),
    "8": ("Bengali", "bn"),
    "9": ("Punjabi", "pa"),
    "10": ("English", "en")
}

# ---------- VOICE SETUP ----------
r = sr.Recognizer()

# Voice mapping for different languages (male voices)
voice_map = {
    "hi": "hi-IN-ManishNeural",      # Hindi male
    "gu": "gu-IN-NiranjanNeural",    # Gujarati male
    "ta": "ta-IN-ValluvarNeural",    # Tamil male
    "te": "te-IN-MohanNeural",       # Telugu male
    "kn": "kn-IN-GaganNeural",       # Kannada male
    "ml": "ml-IN-MidhunNeural",      # Malayalam male
    "mr": "mr-IN-AmoghNeural",       # Marathi male
    "bn": "bn-IN-BiplobNeural",      # Bengali male
    "pa": "pa-IN-GurpreetNeural",    # Punjabi male
    "en": "en-US-GuyNeural"          # English male
}

async def speak_async(text, lang_code="en"):
    try:
        voice = voice_map.get(lang_code, "en-US-GuyNeural")
        communicate = Communicate(text, voice)
        filename = os.path.join(os.path.expanduser("~"), "temp_speech.mp3")
        await communicate.save(filename)
        os.startfile(filename)
        time.sleep(5)
        try:
            if os.path.exists(filename):
                os.remove(filename)
        except:
            pass
    except Exception as e:
        print(f"Error in text-to-speech: {e}")

def speak(text, lang_code="en"):
    print("Assistant:", text)
    asyncio.run(speak_async(text, lang_code))

import argparse
import json
import uuid
from pathlib import Path

# --------- Helper: process message (non-interactive) ---------

def process_message(message: str, lang_code: str = "en", user_role: str = "farmer", generate_audio: bool = True, translate: bool = False, original_text: str = None):
    # System prompt based on role
    role_prompt = "You are a helpful AI assistant."
    if user_role == 'farmer':
        role_prompt = (
            "You are a helpful AI assistant for farmers. Answer questions about crops, irrigation, weather, and plant diseases. "
            "Provide actionable and concise advice in the user's language."
        )
    elif user_role == 'buyer':
        role_prompt = (
            "You are a helpful AI assistant for buyers. Answer questions about crop availability, pricing, and marketplace usage. "
            "Give clear marketplace instructions and local context."
        )

    translated_input = None

    # If translation was requested, first translate the original_text into target language
    if translate and original_text:
        try:
            translate_prompt = f"Translate the following text into language code '{lang_code}'. Respond only with the translated text and nothing else. Text: \"{original_text}\""
            t_resp = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a concise translator. Output only the translated text."},
                    {"role": "user", "content": translate_prompt}
                ]
            )
            translated_input = t_resp.choices[0].message.content
            # Use translated_input as the message going into the assistant
            message = translated_input
        except Exception as e:
            print(f"Warning: translation failed: {e}")
            translated_input = None

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": role_prompt + f" Always respond in the user's language ({lang_code})."},
                {"role": "user", "content": message}
            ]
        )
        reply = response.choices[0].message.content
    except Exception as e:
        return {"reply": f"Error generating response: {e}", "audio_path": None, "translated_input": translated_input}

    audio_path = None
    if generate_audio and reply:
        try:
            # Choose voice
            voice = voice_map.get(lang_code, "en-US-GuyNeural")
            communicator = Communicate(reply, voice)

            audio_dir = Path(__file__).parent / 'public' / 'assistant_audio'
            audio_dir.mkdir(parents=True, exist_ok=True)
            filename = f"assistant_{uuid.uuid4().hex}.mp3"
            filepath = audio_dir / filename

            asyncio.run(communicator.save(str(filepath)))
            # Return web-accessible path (frontend serves `public/` at project root)
            audio_path = f"/assistant_audio/{filename}"
        except Exception as e:
            print(f"Warning: Failed to generate audio: {e}")
            audio_path = None

    return {"reply": reply, "audio_path": audio_path, "translated_input": translated_input}


# --------- Interactive runner (keeps original behaviour) ---------
def run_interactive():
    print("=== REAL AI CHATBOT ===")
    print("\nChoose your language:")
    for key, (lang_name, _) in languages.items():
        print(f"{key}. {lang_name}")

    lang_choice = input("Enter language number (1-10): ")

    if lang_choice not in languages:
        print("Invalid choice")
        exit()

    selected_language, lang_code = languages[lang_choice]
    print(f"\nSelected Language: {selected_language}")

    print("\nChoose input method:")
    print("1. Type")
    print("2. Voice")

    choice = input("Enter 1 or 2: ")

    # ---------- INPUT ----------
    if choice == "1":
        user_input = input("You: ")

    elif choice == "2":
        speak("Speak now")
        with sr.Microphone() as source:
            r.adjust_for_ambient_noise(source, duration=1)
            audio = r.listen(source)
        try:
            user_input = r.recognize_google(audio, language=lang_code)
            print("You said:", user_input)
        except Exception:
            speak("Sorry, I could not understand")
            exit()

    else:
        speak("Invalid choice")
        exit()

    result = process_message(user_input, lang_code, 'farmer', generate_audio=True)
    reply = result.get('reply')
    speak(reply, lang_code)


# --------- CLI entrypoint for integration with backend ---------
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Assistant CLI mode')
    parser.add_argument('--message', type=str, help='Message from user')
    parser.add_argument('--language', type=str, default='en', help='Language code (en, hi, gu etc)')
    parser.add_argument('--user_role', type=str, default='farmer', help='User role (farmer|buyer)')
    parser.add_argument('--no-audio', action='store_true', help='Do not generate audio')
    parser.add_argument('--translate', action='store_true', help='Translate original text into selected language before responding')
    parser.add_argument('--original_text', type=str, help='Original text to translate')

    args = parser.parse_args()

    if args.message:
        result = process_message(args.message, args.language, args.user_role, generate_audio=not args.no_audio, translate=args.translate, original_text=args.original_text)
        print(json.dumps(result, ensure_ascii=False))
    else:
        run_interactive()
