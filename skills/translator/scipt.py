from deep_translator import GoogleTranslator
from time import sleep

files = [p.strip() for p in os.environ["FILES"].split() if p.strip()]
translator = GoogleTranslator(source="auto", target="ru")

def translate_text(text: str) -> str:
    parts = re.split(r"(```[\s\S]*?```)", text)
    translated = []
    for idx, part in enumerate(parts):
        if idx % 2 == 1:
            translated.append(part)
            continue
        if part.strip():
            # Retry up to 3 times with backoff
            for attempt in range(3):
                try:
                    translated.append(translator.translate(part))
                    break
                except Exception as e:
                    if attempt == 2:
                        raise
                    sleep(2 ** attempt)  # Exponential backoff
        else:
            translated.append(part)
    return "".join(translated)