FROM python:3.12-slim
WORKDIR /app

# OS deps
RUN apt-get update \
 && apt-get install -y --no-install-recommends gcc curl \
 && rm -rf /var/lib/apt/lists/*

# ── CPU-only torch first ────────────────────────────────────────────────────
# Install torch from the PyTorch CPU wheel index BEFORE the rest of deps.
# This prevents pip from pulling 5 GB of CUDA/nvidia packages.
RUN pip install --no-cache-dir \
    torch==2.3.1 \
    --index-url https://download.pytorch.org/whl/cpu

# ── App dependencies ────────────────────────────────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Pre-bake the sentence-transformers model so cold-start is instant ───────
ENV HF_HOME=/app/.cache/huggingface
RUN mkdir -p /app/.cache/huggingface && chmod -R 777 /app/.cache \
 && python -c \
    "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')" \
    || echo "Model pre-load skipped (will download on first request)"

# ── App code ────────────────────────────────────────────────────────────────
COPY app ./app

ENV PORT=8000
EXPOSE 8000 7860

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
