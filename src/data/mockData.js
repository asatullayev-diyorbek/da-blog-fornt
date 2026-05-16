export const categories = [
  { id: 1, name: "Django" },
  { id: 2, name: "React" },
  { id: 3, name: "Python" },
  { id: 4, name: "DevOps" },
  { id: 5, name: "AI" },
]

export const tags = [
  { id: 1, name: "REST API" },
  { id: 2, name: "JWT" },
  { id: 3, name: "TailwindCSS" },
  { id: 4, name: "PostgreSQL" },
  { id: 5, name: "Docker" },
  { id: 6, name: "GPT" },
]

export const posts = [
  {
    id: 1,
    title: "Django REST Framework bilan API yaratish",
    slug: "django-rest-framework-api",
    short_description:
      "DRF yordamida professional darajadagi REST API qanday qurilishini bosqichma-bosqich ko'rib chiqamiz.",
    content: `# Django REST Framework bilan API yaratish

Django REST Framework (DRF) — Django uchun eng kuchli va mashhur API qurilish toolkiti.

## O'rnatish

\`\`\`bash
pip install djangorestframework
pip install django-cors-headers
\`\`\`

## settings.py ga qo'shish

\`\`\`python
INSTALLED_APPS = [
    ...
    "rest_framework",
    "corsheaders",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}
\`\`\`

## Serializer yaratish

\`\`\`python
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"
\`\`\`

## View yaratish

\`\`\`python
from rest_framework.generics import ListAPIView
from .models import Post
from .serializers import PostSerializer

class PostListAPIView(ListAPIView):
    queryset = Post.objects.filter(published=True).order_by("-created_at")
    serializer_class = PostSerializer
\`\`\`

## URL ulash

\`\`\`python
from django.urls import path
from .views import PostListAPIView

urlpatterns = [
    path("posts/", PostListAPIView.as_view()),
]
\`\`\`

> DRF bilan ishlash juda oson va kuchli. Keyingi maqolada JWT autentifikatsiyasini ko'rib chiqamiz.

[youtube]dQw4w9WgXcQ[/youtube]
`,
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    category: { id: 1, name: "Django" },
    tags: [
      { id: 1, name: "REST API" },
      { id: 4, name: "PostgreSQL" },
    ],
    published: true,
    featured: true,
    views: 1240,
    created_at: "2025-05-01T10:00:00Z",
    read_time: 8,
    author: { name: "Diyorbek", avatar: "https://i.pravatar.cc/40?img=3" },
  },
  {
    id: 2,
    title: "React va Zustand bilan state management",
    slug: "react-zustand-state-management",
    short_description:
      "Redux o'rniga Zustand — minimal, tez va React uchun eng qulay global state kutubxonasi.",
    content: `# React va Zustand bilan state management

Zustand — Redux'ga muqobil, juda yengil va intuitiv state menejment kutubxonasi.

## O'rnatish

\`\`\`bash
npm install zustand
\`\`\`

## Store yaratish

\`\`\`js
import { create } from "zustand"

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "dark",

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark"
      localStorage.setItem("theme", newTheme)
      document.documentElement.className = newTheme
      return { theme: newTheme }
    }),
}))
\`\`\`

## Komponentda ishlatish

\`\`\`jsx
import { useThemeStore } from "../store/theme"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  return (
    <button onClick={toggleTheme}>
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  )
}
\`\`\`

Zustand juda oddiy — provider kerak emas, boilerplate yo'q.
`,
    cover: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    category: { id: 2, name: "React" },
    tags: [{ id: 3, name: "TailwindCSS" }],
    published: true,
    featured: false,
    views: 876,
    created_at: "2025-05-05T09:30:00Z",
    read_time: 5,
    author: { name: "Diyorbek", avatar: "https://i.pravatar.cc/40?img=3" },
  },
  {
    id: 3,
    title: "Docker bilan Django loyihasini deploy qilish",
    slug: "docker-django-deploy",
    short_description:
      "Docker va Docker Compose yordamida Django + PostgreSQL + Nginx stack'ini production'ga chiqarish.",
    content: `# Docker bilan Django loyihasini deploy qilish

## Dockerfile

\`\`\`dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
\`\`\`

## docker-compose.yml

\`\`\`yaml
version: "3.9"

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: blogdb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret

  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgres://admin:secret@db:5432/blogdb
\`\`\`

## Ishga tushirish

\`\`\`bash
docker compose up --build
\`\`\`
`,
    cover: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
    category: { id: 4, name: "DevOps" },
    tags: [
      { id: 5, name: "Docker" },
      { id: 4, name: "PostgreSQL" },
    ],
    published: true,
    featured: false,
    views: 654,
    created_at: "2025-05-08T14:00:00Z",
    read_time: 10,
    author: { name: "Diyorbek", avatar: "https://i.pravatar.cc/40?img=3" },
  },
  {
    id: 4,
    title: "Python bilan AI chatbot yasash — OpenAI API",
    slug: "python-ai-chatbot-openai",
    short_description:
      "OpenAI GPT API'dan foydalanib Python'da oddiy chatbot yaratamiz va uni web'ga chiqaramiz.",
    content: `# Python bilan AI chatbot yasash

## O'rnatish

\`\`\`bash
pip install openai
\`\`\`

## Oddiy chatbot

\`\`\`python
from openai import OpenAI

client = OpenAI(api_key="your-api-key")

def chat(message):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": message}]
    )
    return response.choices[0].message.content

print(chat("Salom! Sen kimsan?"))
\`\`\`

GPT-4o bugungi kunda eng kuchli va tejamkor model.
`,
    cover: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    category: { id: 5, name: "AI" },
    tags: [{ id: 6, name: "GPT" }],
    published: true,
    featured: false,
    views: 2100,
    created_at: "2025-05-10T11:00:00Z",
    read_time: 6,
    author: { name: "Diyorbek", avatar: "https://i.pravatar.cc/40?img=3" },
  },
  {
    id: 5,
    title: "JWT Authentication — Django + React",
    slug: "jwt-authentication-django-react",
    short_description:
      "djangorestframework-simplejwt yordamida to'liq JWT auth tizimini qanday quramiz.",
    content: `# JWT Authentication — Django + React

## Backend

\`\`\`bash
pip install djangorestframework-simplejwt
\`\`\`

\`\`\`python
# settings.py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}
\`\`\`

\`\`\`python
# urls.py
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("token/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
]
\`\`\`

## Frontend (React + Axios)

\`\`\`js
const login = async (username, password) => {
  const res = await axios.post("/api/token/", { username, password })
  localStorage.setItem("access", res.data.access)
  localStorage.setItem("refresh", res.data.refresh)
}
\`\`\`
`,
    cover: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80",
    category: { id: 1, name: "Django" },
    tags: [
      { id: 2, name: "JWT" },
      { id: 1, name: "REST API" },
    ],
    published: true,
    featured: false,
    views: 980,
    created_at: "2025-05-12T08:00:00Z",
    read_time: 7,
    author: { name: "Diyorbek", avatar: "https://i.pravatar.cc/40?img=3" },
  },
  {
    id: 6,
    title: "TailwindCSS v4 — Yangi imkoniyatlar",
    slug: "tailwindcss-v4-features",
    short_description:
      "TailwindCSS v4 nima o'zgardi? @theme, CSS-first config va yangi utility classlar haqida.",
    content: `# TailwindCSS v4 — Yangi imkoniyatlar

Tailwind v4 katta o'zgarishlar bilan keldi.

## CSS-first konfiguratsiya

\`\`\`css
@import "tailwindcss";

@theme {
  --color-primary: #00E5FF;
  --color-secondary: #FF3D57;
}
\`\`\`

## Vite plugin

\`\`\`js
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [tailwindcss()],
})
\`\`\`

Endi \`tailwind.config.js\` shart emas — to'liq CSS'da konfiguratsiya.
`,
    cover: "https://images.unsplash.com/photo-1587620962725-abab19836fd4?w=800&q=80",
    category: { id: 2, name: "React" },
    tags: [{ id: 3, name: "TailwindCSS" }],
    published: true,
    featured: false,
    views: 445,
    created_at: "2025-05-14T16:00:00Z",
    read_time: 4,
    author: { name: "Diyorbek", avatar: "https://i.pravatar.cc/40?img=3" },
  },
]

// ─── COURSES ─────────────────────────────────────────────────────────────────

export const courses = [
  {
    id: 1,
    title: "Django bilan Backend dasturlash",
    slug: "django-backend",
    short_description:
      "Noldan boshlab professional Django loyiha qurishni o'rganasiz: modellar, API, auth, deploy.",
    cover: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80",
    category: { id: 1, name: "Django" },
    level: "Boshlang'ich",
    price: "Bepul",
    lessons_count: 8,
    duration: "6 soat",
    students: 1240,
    instructor: { name: "Diyorbek", avatar: "https://i.pravatar.cc/40?img=3" },
    created_at: "2025-04-01T10:00:00Z",
    featured: true,
  },
  {
    id: 2,
    title: "React + Vite — Zamonaviy Frontend",
    slug: "react-vite-frontend",
    short_description:
      "React, Vite, TailwindCSS va Zustand bilan zamonaviy SPA ilovalar yaratishni o'rganasiz.",
    cover: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    category: { id: 2, name: "React" },
    level: "O'rta",
    price: "Bepul",
    lessons_count: 7,
    duration: "5 soat",
    students: 876,
    instructor: { name: "Diyorbek", avatar: "https://i.pravatar.cc/40?img=3" },
    created_at: "2025-04-10T10:00:00Z",
    featured: false,
  },
  {
    id: 3,
    title: "Docker va DevOps asoslari",
    slug: "docker-devops",
    short_description:
      "Docker, Docker Compose, GitHub Actions va VPS ga deploy — to'liq DevOps workflow.",
    cover: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
    category: { id: 4, name: "DevOps" },
    level: "O'rta",
    price: "Pullik",
    lessons_count: 6,
    duration: "4 soat",
    students: 432,
    instructor: { name: "Diyorbek", avatar: "https://i.pravatar.cc/40?img=3" },
    created_at: "2025-04-20T10:00:00Z",
    featured: false,
  },
  {
    id: 4,
    title: "Python bilan AI va Machine Learning",
    slug: "python-ai-ml",
    short_description:
      "OpenAI API, LangChain va oddiy ML modellar bilan ishlashni o'rganasiz.",
    cover: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    category: { id: 5, name: "AI" },
    level: "Yuqori",
    price: "Pullik",
    lessons_count: 9,
    duration: "8 soat",
    students: 654,
    instructor: { name: "Diyorbek", avatar: "https://i.pravatar.cc/40?img=3" },
    created_at: "2025-05-01T10:00:00Z",
    featured: false,
  },
]

// ─── LESSONS ─────────────────────────────────────────────────────────────────

export const lessons = [
  // ── Django kursi ──────────────────────────────────────────────────────────
  {
    id: 1,
    course_id: 1,
    order: 1,
    title: "Django o'rnatish va loyiha strukturasi",
    slug: "django-ornatish",
    duration: "42 daqiqa",
    is_free: true,
    video_id: "dQw4w9WgXcQ",
    content: `# Django o'rnatish va loyiha strukturasi

## Virtual muhit yaratish

\`\`\`bash
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\\Scripts\\activate       # Windows
\`\`\`

## Django o'rnatish

\`\`\`bash
pip install django
django-admin startproject config .
\`\`\`

## Loyiha strukturasi

\`\`\`text
project/
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   └── blog/
├── manage.py
└── requirements.txt
\`\`\`

## Ishga tushirish

\`\`\`bash
python manage.py runserver
\`\`\`

> Server http://127.0.0.1:8000 da ishlaydi.
`,
  },
  {
    id: 2,
    course_id: 1,
    order: 2,
    title: "Models va Migrations",
    slug: "models-migrations",
    duration: "55 daqiqa",
    is_free: true,
    video_id: "dQw4w9WgXcQ",
    content: `# Models va Migrations

## Model yaratish

\`\`\`python
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
\`\`\`

## Migration

\`\`\`bash
python manage.py makemigrations
python manage.py migrate
\`\`\`

## Admin ga ro'yxatdan o'tkazish

\`\`\`python
from django.contrib import admin
from .models import Post

admin.site.register(Post)
\`\`\`
`,
  },
  {
    id: 3,
    course_id: 1,
    order: 3,
    title: "Django REST Framework — Serializers",
    slug: "drf-serializers",
    duration: "48 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# Django REST Framework — Serializers

## O'rnatish

\`\`\`bash
pip install djangorestframework
\`\`\`

## ModelSerializer

\`\`\`python
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "title", "slug", "content", "published", "created_at"]
\`\`\`

## Nested serializer

\`\`\`python
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]

class PostSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Post
        fields = "__all__"
\`\`\`
`,
  },
  {
    id: 4,
    course_id: 1,
    order: 4,
    title: "API Views — Generic Views",
    slug: "api-generic-views",
    duration: "52 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# API Views — Generic Views

## ListAPIView

\`\`\`python
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .models import Post
from .serializers import PostSerializer

class PostListAPIView(ListAPIView):
    queryset = Post.objects.filter(published=True).order_by("-created_at")
    serializer_class = PostSerializer

class PostDetailAPIView(RetrieveAPIView):
    queryset = Post.objects.filter(published=True)
    serializer_class = PostSerializer
    lookup_field = "slug"
\`\`\`

## URLs

\`\`\`python
urlpatterns = [
    path("posts/", PostListAPIView.as_view()),
    path("posts/<slug:slug>/", PostDetailAPIView.as_view()),
]
\`\`\`
`,
  },
  {
    id: 5,
    course_id: 1,
    order: 5,
    title: "JWT Authentication",
    slug: "jwt-auth",
    duration: "60 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# JWT Authentication

## O'rnatish

\`\`\`bash
pip install djangorestframework-simplejwt
\`\`\`

## settings.py

\`\`\`python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}
\`\`\`

## URLs

\`\`\`python
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("token/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
]
\`\`\`
`,
  },
  {
    id: 6,
    course_id: 1,
    order: 6,
    title: "django-unfold bilan chiroyli Admin",
    slug: "django-unfold-admin",
    duration: "35 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# django-unfold bilan chiroyli Admin

## O'rnatish

\`\`\`bash
pip install django-unfold
\`\`\`

## settings.py

\`\`\`python
INSTALLED_APPS = [
    "unfold",
    "django.contrib.admin",
    ...
]
\`\`\`

## Admin class

\`\`\`python
from unfold.admin import ModelAdmin

@admin.register(Post)
class PostAdmin(ModelAdmin):
    list_display = ["title", "published", "views", "created_at"]
    search_fields = ["title"]
    list_filter = ["published", "category"]
\`\`\`
`,
  },
  {
    id: 7,
    course_id: 1,
    order: 7,
    title: "PostgreSQL ulash va production settings",
    slug: "postgresql-production",
    duration: "45 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# PostgreSQL ulash va production settings

## psycopg2 o'rnatish

\`\`\`bash
pip install psycopg2-binary
\`\`\`

## settings.py

\`\`\`python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "blogdb",
        "USER": "admin",
        "PASSWORD": "secret",
        "HOST": "localhost",
        "PORT": "5432",
    }
}
\`\`\`

## .env bilan ishlash

\`\`\`bash
pip install python-decouple
\`\`\`

\`\`\`python
from decouple import config

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
    }
}
\`\`\`
`,
  },
  {
    id: 8,
    course_id: 1,
    order: 8,
    title: "Docker bilan Deploy",
    slug: "docker-deploy",
    duration: "70 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# Docker bilan Deploy

## Dockerfile

\`\`\`dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
\`\`\`

## docker-compose.yml

\`\`\`yaml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: blogdb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret

  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
\`\`\`

## Ishga tushirish

\`\`\`bash
docker compose up --build -d
\`\`\`
`,
  },

  // ── React kursi ──────────────────────────────────────────────────────────
  {
    id: 9,
    course_id: 2,
    order: 1,
    title: "Vite + React loyiha yaratish",
    slug: "vite-react-setup",
    duration: "30 daqiqa",
    is_free: true,
    video_id: "dQw4w9WgXcQ",
    content: `# Vite + React loyiha yaratish

## Yaratish

\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
\`\`\`

## Asosiy fayllar

| Fayl | Maqsad |
|------|--------|
| \`src/main.jsx\` | Entry point |
| \`src/App.jsx\` | Root component |
| \`vite.config.js\` | Vite konfiguratsiya |
`,
  },
  {
    id: 10,
    course_id: 2,
    order: 2,
    title: "TailwindCSS v4 o'rnatish",
    slug: "tailwindcss-v4",
    duration: "25 daqiqa",
    is_free: true,
    video_id: "dQw4w9WgXcQ",
    content: `# TailwindCSS v4 o'rnatish

## O'rnatish

\`\`\`bash
npm install tailwindcss @tailwindcss/vite
\`\`\`

## vite.config.js

\`\`\`js
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
\`\`\`

## index.css

\`\`\`css
@import "tailwindcss";

@theme {
  --color-primary: #00E5FF;
}
\`\`\`
`,
  },
  {
    id: 11,
    course_id: 2,
    order: 3,
    title: "React Router v6",
    slug: "react-router-v6",
    duration: "40 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# React Router v6

## O'rnatish

\`\`\`bash
npm install react-router-dom
\`\`\`

## Routing

\`\`\`jsx
import { BrowserRouter, Routes, Route } from "react-router-dom"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
\`\`\`

## useParams

\`\`\`jsx
import { useParams } from "react-router-dom"

export default function BlogDetail() {
  const { slug } = useParams()
  return <div>{slug}</div>
}
\`\`\`
`,
  },
  {
    id: 12,
    course_id: 2,
    order: 4,
    title: "Zustand bilan State Management",
    slug: "zustand-state",
    duration: "35 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# Zustand bilan State Management

## O'rnatish

\`\`\`bash
npm install zustand
\`\`\`

## Store

\`\`\`js
import { create } from "zustand"

export const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}))
\`\`\`

## Komponentda ishlatish

\`\`\`jsx
const { count, increment } = useCounterStore()
\`\`\`
`,
  },
  {
    id: 13,
    course_id: 2,
    order: 5,
    title: "Axios bilan API so'rovlar",
    slug: "axios-api",
    duration: "38 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# Axios bilan API so'rovlar

## O'rnatish

\`\`\`bash
npm install axios
\`\`\`

## API instance

\`\`\`js
import axios from "axios"

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
})

export default api
\`\`\`

## Ishlatish

\`\`\`jsx
useEffect(() => {
  api.get("posts/").then((res) => setPosts(res.data))
}, [])
\`\`\`
`,
  },
  {
    id: 14,
    course_id: 2,
    order: 6,
    title: "React Markdown va Syntax Highlight",
    slug: "react-markdown-syntax",
    duration: "45 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# React Markdown va Syntax Highlight

## O'rnatish

\`\`\`bash
npm install react-markdown rehype-raw remark-gfm
npm install react-syntax-highlighter
\`\`\`

## Komponent

\`\`\`jsx
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"

export default function Markdown({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children }) {
          const lang = className?.replace("language-", "")
          return <SyntaxHighlighter language={lang}>{children}</SyntaxHighlighter>
        }
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
\`\`\`
`,
  },
  {
    id: 15,
    course_id: 2,
    order: 7,
    title: "Production Build va Deploy",
    slug: "react-production-deploy",
    duration: "30 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# Production Build va Deploy

## Build

\`\`\`bash
npm run build
\`\`\`

## Nginx konfiguratsiya

\`\`\`nginx
server {
    listen 80;
    root /var/www/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
\`\`\`

React Router SPA uchun \`try_files\` muhim — barcha yo'llar \`index.html\` ga borishi kerak.
`,
  },

  // ── Docker kursi ─────────────────────────────────────────────────────────
  {
    id: 16,
    course_id: 3,
    order: 1,
    title: "Docker nima va nima uchun kerak",
    slug: "docker-nima",
    duration: "28 daqiqa",
    is_free: true,
    video_id: "dQw4w9WgXcQ",
    content: `# Docker nima va nima uchun kerak

Docker — ilovalarni konteynerlarda ishlatish uchun platforma.

## Asosiy tushunchalar

| Tushuncha | Izoh |
|-----------|------|
| Image | Dastur uchun shablon |
| Container | Ishga tushirilgan image |
| Dockerfile | Image yaratish uchun yo'riqnoma |
| Docker Hub | Image'larni saqlash joyi |

## O'rnatish tekshirish

\`\`\`bash
docker --version
docker run hello-world
\`\`\`
`,
  },
  {
    id: 17,
    course_id: 3,
    order: 2,
    title: "Dockerfile yozish",
    slug: "dockerfile-yozish",
    duration: "40 daqiqa",
    is_free: true,
    video_id: "dQw4w9WgXcQ",
    content: `# Dockerfile yozish

## Python app uchun Dockerfile

\`\`\`dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
\`\`\`

## Build va run

\`\`\`bash
docker build -t my-django-app .
docker run -p 8000:8000 my-django-app
\`\`\`
`,
  },
  {
    id: 18,
    course_id: 3,
    order: 3,
    title: "Docker Compose",
    slug: "docker-compose",
    duration: "50 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# Docker Compose

## docker-compose.yml

\`\`\`yaml
version: "3.9"

services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password

  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgres://user:password@db:5432/mydb

volumes:
  postgres_data:
\`\`\`

## Buyruqlar

\`\`\`bash
docker compose up -d
docker compose logs -f
docker compose down
\`\`\`
`,
  },
  {
    id: 19,
    course_id: 3,
    order: 4,
    title: "GitHub Actions bilan CI/CD",
    slug: "github-actions-cicd",
    duration: "55 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# GitHub Actions bilan CI/CD

## .github/workflows/deploy.yml

\`\`\`yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t app .

      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: \${{ secrets.SERVER_USER }}
          key: \${{ secrets.SSH_KEY }}
          script: |
            cd /app
            git pull
            docker compose up -d --build
\`\`\`
`,
  },
  {
    id: 20,
    course_id: 3,
    order: 5,
    title: "Nginx Reverse Proxy",
    slug: "nginx-reverse-proxy",
    duration: "42 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# Nginx Reverse Proxy

## nginx.conf

\`\`\`nginx
upstream django {
    server web:8000;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /app/static/;
    }
}
\`\`\`

## docker-compose ga qo'shish

\`\`\`yaml
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - web
\`\`\`
`,
  },
  {
    id: 21,
    course_id: 3,
    order: 6,
    title: "SSL/HTTPS — Let's Encrypt",
    slug: "ssl-lets-encrypt",
    duration: "35 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# SSL/HTTPS — Let's Encrypt

## Certbot bilan SSL olish

\`\`\`bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
\`\`\`

## Auto-renew

\`\`\`bash
sudo certbot renew --dry-run
\`\`\`

Certbot crontab orqali avtomatik yangilaydi.
`,
  },

  // ── AI/ML kursi ─────────────────────────────────────────────────────────
  {
    id: 22,
    course_id: 4,
    order: 1,
    title: "OpenAI API bilan ishlash",
    slug: "openai-api",
    duration: "45 daqiqa",
    is_free: true,
    video_id: "dQw4w9WgXcQ",
    content: `# OpenAI API bilan ishlash

## O'rnatish

\`\`\`bash
pip install openai
\`\`\`

## Oddiy chat

\`\`\`python
from openai import OpenAI

client = OpenAI(api_key="your-key")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Salom!"}]
)

print(response.choices[0].message.content)
\`\`\`

## Streaming

\`\`\`python
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hikoya yoz"}],
    stream=True,
)

for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="")
\`\`\`
`,
  },
  {
    id: 23,
    course_id: 4,
    order: 2,
    title: "LangChain asoslari",
    slug: "langchain-asoslari",
    duration: "60 daqiqa",
    is_free: true,
    video_id: "dQw4w9WgXcQ",
    content: `# LangChain asoslari

## O'rnatish

\`\`\`bash
pip install langchain langchain-openai
\`\`\`

## Chain yaratish

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOpenAI(model="gpt-4o")

prompt = ChatPromptTemplate.from_messages([
    ("system", "Sen yordamchi assistantsan."),
    ("user", "{question}"),
])

chain = prompt | llm
result = chain.invoke({"question": "Django nima?"})
print(result.content)
\`\`\`
`,
  },
  {
    id: 24,
    course_id: 4,
    order: 3,
    title: "RAG — Retrieval Augmented Generation",
    slug: "rag-retrieval",
    duration: "75 daqiqa",
    is_free: false,
    video_id: "dQw4w9WgXcQ",
    content: `# RAG — Retrieval Augmented Generation

RAG — GPT ga o'z ma'lumotlaringizni berilib savol-javob qilish usuli.

## Arxitektura

\`\`\`text
PDF/Docs → Chunks → Embeddings → VectorDB
                                      ↓
User Query → Embedding → Search → Context + Query → LLM → Answer
\`\`\`

## FAISS bilan

\`\`\`python
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_texts(texts, embeddings)

retriever = vectorstore.as_retriever()
\`\`\`
`,
  },
]
