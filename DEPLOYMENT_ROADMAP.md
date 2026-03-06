# Application Deployment Roadmap 🚀

This is a beginner-friendly, step-by-step roadmap to get your full-stack HRMS application live on the internet!

The strategy we will use:

1. **Frontend (React/Vite)**: Hosted on **Vercel** (Free, lightning-fast, and designed for React).
2. **Database (PostgreSQL)**: Hosted on **Neon** or **Supabase** (Free cloud PostgreSQL databases).
3. **Backend (FastAPI)**: Hosted on **Render** (Great free tier for Python backends, easy to set up).

---

## Step 1: Push Your Code to GitHub (Crucial First Step)

Before doing any deployments, your code MUST live on GitHub. Platforms like Vercel and Render securely read your code directly from a GitHub repository to deploy it automatically.

1. Create a free account on [GitHub](https://github.com/).
2. Create a **New Repository** (make it Private or Public).
3. Push your entire `hrms-lite` folder to this new repository.

---

## Step 2: Set Up a Live PostgreSQL Database

Currently, your app connects to a local database on your computer. When you go live, your backend needs a live cloud database.

1. Create a free account on [Neon.tech](https://neon.tech/) or [Supabase.com](https://supabase.com/).
2. Create a new project and select **PostgreSQL**.
3. Once created, look for the **Connection String** (it usually looks like `postgresql://user:password@hostname/dbname`).
4. Save this connection string safely; you will need it for the backend!

---

## Step 3: Deploy the Backend (FastAPI) to Render

Render is perfect for running Python FastAPI applications. It reads your `requirements.txt` and runs your server automatically.

1. Go to [Render](https://render.com/) and create a free account (sign in with GitHub).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your `hrms-lite` repository.
4. **Configuration Settings:**
   - **Name**: `hrms-backend`
   - **Root Directory**: `backend` (Because your backend code is inside this folder).
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt` (Make sure you have this file in your backend folder!)
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000` (Update `app.main:app` based on where your FastAPI instance is).
5. **Environment Variables**:
   - Scroll down to the Advanced section and add your database URL here.
   - Key: `DATABASE_URL`
   - Value: (Paste the Connection String you got from Neon/Supabase in Step 2).
6. Click **Create Web Service**.
7. Rent takes a few minutes to build. Once done, you'll get a live URL like `https://hrms-backend-xyz.onrender.com`. Save this URL!

---

## Step 4: Deploy the Frontend (React/Vite) to Vercel

Vercel is the easiest platform in the world for deploying Vite/React frontends.

1. Go to [Vercel](https://vercel.com/) and create an account (Sign in with GitHub).
2. Click **Add New** -> **Project**.
3. Import your `hrms-lite` GitHub repository.
4. **Configuration Settings:**
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and change it to `frontend` so Vercel knows where the React code is.
5. **Environment Variables:**
   - You need to tell the frontend where the new live backend is.
   - Key: `VITE_API_URL`
   - Value: `https://hrms-backend-xyz.onrender.com` (Paste the Render URL from Step 3).
6. Click **Deploy**. Vercel will build the frontend automatically.
7. Within a minute or two, you will receive a shiny, live `.vercel.app` link for your frontend!

---

## Summary of the Flow:

- The user visits your **Vercel** Link (Live Frontend).
- The Frontend makes API calls to your **Render** Link (Live Backend).
- The Backend reads/writes data to your **Neon** Database (Live Database).

## Next Immediate Steps Before Deploying:

- Ensure your backend `requirements.txt` is updated (`pip freeze > requirements.txt`).
- Ensure your backend has a `main.py` properly configured to accept CORS (Cross-Origin Resource Sharing) requests from your new Vercel domain, otherwise the API requests will be blocked.
- Double-check that your code does not have any hardcoded `http://localhost:8000` connections and instead relies entirely on `import.meta.env.VITE_API_URL`.
