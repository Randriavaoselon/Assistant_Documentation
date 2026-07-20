# Assistant Documentation Entreprise (RAG)

Assistant IA qui répond aux questions des employés en s'appuyant **exclusivement**
sur la documentation interne de l'entreprise : procédures, guides, documentation
technique et FAQ.

> Exemple : *« Comment créer un nouvel utilisateur dans Odoo ? »* → l'assistant
> retrouve le passage exact de la procédure, cite le document source, et
> indique un niveau de pertinence.

## Architecture

```
entreprise-rag-assistant/
├── backend/                # Django 5 + Django REST Framework
│   ├── config/              # Settings, urls, wsgi/asgi
│   ├── documents/           # Upload, extraction, chunking, embeddings, vector store
│   │   └── services/
│   │       ├── extraction.py    # PDF / DOCX / TXT / MD -> texte brut
│   │       ├── chunking.py      # Découpage en fragments avec chevauchement
│   │       ├── embeddings.py    # sentence-transformers (all-MiniLM-L6-v2)
│   │       ├── vectorstore.py   # ChromaDB persistant
│   │       └── indexing.py      # Pipeline complet d'ingestion
│   └── chat/                # Conversations, recherche sémantique, appel Groq
│       └── services/
│           ├── retriever.py     # Recherche des chunks pertinents
│           ├── groq_client.py   # Génération de la réponse (LLM)
│           └── rag_pipeline.py  # Orchestration retrieval + génération
└── frontend/                # React 18 + Vite
    └── src/
        ├── components/Chat/      # Fenêtre de discussion, bulles, citations
        ├── components/Documents/ # Upload et gestion des documents
        ├── context/ChatContext.jsx
        └── pages/
```

### Flux RAG

1. **Ingestion** : un document est uploadé → texte extrait → découpé en chunks
   (~1000 caractères, chevauchement 150) → chaque chunk est vectorisé
   (embeddings) → stocké dans ChromaDB avec ses métadonnées (titre, catégorie).
2. **Question** : la question de l'employé est vectorisée → on recherche les
   chunks les plus proches sémantiquement dans ChromaDB → on envoie ces
   extraits + la question à Groq (LLM) avec un prompt strict qui l'oblige à ne
   répondre qu'à partir du contexte fourni et à citer ses sources.
3. **Réponse** : l'employé reçoit la réponse générée, accompagnée des documents
   sources et d'un score de pertinence pour chacun.

## Prérequis

- Python 3.11+
- Node.js 18+
- Une clé API Groq gratuite : https://console.groq.com/keys

## Installation — Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Le backend tourne sur **http://localhost:8000**.
L'admin Django (`/admin/`) permet d'inspecter les documents et conversations.

> Note : `sentence-transformers` télécharge le modèle d'embedding
> (`all-MiniLM-L6-v2`, ~90 Mo) au premier lancement. Une connexion internet est
> nécessaire la première fois.

## Installation — Frontend

```bash
cd frontend
npm install

cp .env.example .env
# VITE_API_BASE_URL=http://localhost:8000/api (par défaut)

npm run dev
```

Le frontend tourne sur **http://localhost:5173**.

## Utilisation

1. Allez dans l'onglet **Documents**, uploadez vos procédures / guides / FAQ
   (PDF, DOCX, TXT ou MD). Le statut passe de « En cours de traitement » à
   « Prêt » une fois l'indexation terminée.
2. Retournez sur **Assistant** et posez une question en langage naturel.
3. La réponse s'affiche avec les documents sources utilisés et leur niveau de
   pertinence.

## Aller plus loin (pistes d'évolution)

- **Traitement asynchrone** : déplacer `index_document()` vers Celery + Redis
  pour ne pas bloquer la requête HTTP sur les gros documents.
- **Authentification** : ajouter `django-rest-framework-simplejwt` et une
  gestion des rôles (qui peut uploader / consulter quelles catégories).
- **OCR** : gérer les PDF scannés avec `pytesseract` en complément de `pypdf`.
- **Évaluation** : mesurer la qualité des réponses (RAGAS ou grille manuelle)
  pour ajuster `CHUNK_SIZE`, `RAG_TOP_K` et `MIN_RELEVANCE_SCORE`.
- **Multi-format supplémentaire** : `.pptx`, `.xlsx`, pages Confluence/Notion
  via leurs API.

## Stack technique

| Couche          | Techno                                    |
|------------------|-------------------------------------------|
| Backend          | Django 5, Django REST Framework            |
| Base relationnelle | SQLite (dev) — PostgreSQL recommandé en prod |
| Vector store     | ChromaDB (persistant, local)               |
| Embeddings       | sentence-transformers (`all-MiniLM-L6-v2`) |
| LLM              | Groq API (`llama-3.3-70b-versatile`)       |
| Frontend         | React 18, Vite, React Router               |
| Extraction fichiers | pypdf, python-docx                      |
