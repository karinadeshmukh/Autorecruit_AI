import os
from typing import Protocol

import httpx


class LLMProvider(Protocol):
    name: str

    async def complete(self, prompt: str) -> str: ...
    async def list_models(self) -> list[dict[str, str]]: ...
    def available(self) -> bool: ...


class StubProvider:
    name = "stub"

    def available(self) -> bool:
        return True

    async def list_models(self) -> list[dict[str, str]]:
        return [{"id": "stub/heuristic", "name": "Heuristic (offline)"}]

    async def complete(self, prompt: str) -> str:
        if "job description" in prompt.lower():
            return (
                "We are hiring a teammate who ships with care, communicates clearly, "
                "and raises the quality bar. You will own outcomes end-to-end, partner with "
                "product and design, and leave systems better than you found them."
            )
        return (
            "Lead with impact in the first two bullets. Mirror the job's tools without stuffing. "
            "Keep dates consistent and add a one-line summary under your name."
        )


class OpenRouterProvider:
    name = "openrouter"

    def available(self) -> bool:
        return bool(os.getenv("OPENROUTER_API_KEY"))

    async def list_models(self) -> list[dict[str, str]]:
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.get("https://openrouter.ai/api/v1/models")
            r.raise_for_status()
            models = []
            for m in r.json().get("data", []):
                mid = m.get("id", "")
                if ":free" in mid or "/free" in mid:
                    models.append({"id": mid, "name": m.get("name") or mid})
            return models[:80] or [{"id": "openrouter/auto", "name": "OpenRouter Auto"}]

    async def complete(self, prompt: str) -> str:
        key = os.getenv("OPENROUTER_API_KEY")
        model = os.getenv("OPENROUTER_MODEL", "openrouter/auto")
        async with httpx.AsyncClient(timeout=40) as client:
            r = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={"Authorization": f"Bearer {key}"},
                json={"model": model, "messages": [{"role": "user", "content": prompt}]},
            )
            r.raise_for_status()
            return r.json()["choices"][0]["message"]["content"]


class GeminiProvider:
    name = "gemini"

    def available(self) -> bool:
        return bool(os.getenv("GEMINI_API_KEY"))

    async def list_models(self) -> list[dict[str, str]]:
        return [
            {"id": "gemini-2.0-flash", "name": "Gemini 2.0 Flash"},
            {"id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash"},
        ]

    async def complete(self, prompt: str) -> str:
        key = os.getenv("GEMINI_API_KEY")
        model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
        async with httpx.AsyncClient(timeout=40) as client:
            r = await client.post(url, json={"contents": [{"parts": [{"text": prompt}]}]})
            r.raise_for_status()
            return r.json()["candidates"][0]["content"]["parts"][0]["text"]


class HuggingFaceProvider:
    name = "huggingface"

    def available(self) -> bool:
        return bool(os.getenv("HUGGINGFACE_API_KEY"))

    async def list_models(self) -> list[dict[str, str]]:
        return [
            {"id": "mistralai/Mistral-7B-Instruct-v0.2", "name": "Mistral 7B Instruct"},
            {"id": "google/flan-t5-large", "name": "Flan-T5 Large"},
        ]

    async def complete(self, prompt: str) -> str:
        key = os.getenv("HUGGINGFACE_API_KEY")
        model = os.getenv("HF_MODEL", "mistralai/Mistral-7B-Instruct-v0.2")
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(
                f"https://api-inference.huggingface.co/models/{model}",
                headers={"Authorization": f"Bearer {key}"},
                json={"inputs": prompt, "parameters": {"max_new_tokens": 400}},
            )
            r.raise_for_status()
            data = r.json()
            if isinstance(data, list) and data:
                return data[0].get("generated_text", str(data))
            return str(data)


PROVIDERS: dict[str, LLMProvider] = {
    "stub": StubProvider(),
    "openrouter": OpenRouterProvider(),
    "gemini": GeminiProvider(),
    "huggingface": HuggingFaceProvider(),
}


async def complete_with_fallback(prompt: str, provider: str | None = None, model: str | None = None) -> str:
    order = [provider, "openrouter", "gemini", "huggingface", "stub"]
    seen = set()
    last_err = None
    for name in order:
        if not name or name in seen:
            continue
        seen.add(name)
        impl = PROVIDERS.get(name)
        if not impl or not impl.available():
            continue
        try:
            if model:
                os.environ["OPENROUTER_MODEL"] = model
                os.environ["GEMINI_MODEL"] = model
                os.environ["HF_MODEL"] = model
            return await impl.complete(prompt)
        except Exception as exc:  # noqa: BLE001
            last_err = exc
            continue
    return await StubProvider().complete(prompt) + (f"\n\n(note: live model unavailable: {last_err})" if last_err else "")
