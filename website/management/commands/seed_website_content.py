import json
from datetime import datetime
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from website.models import (
    Article,
    ArticleCategory,
    FAQ,
    JobDepartment,
    JobOffer,
    PartnershipType,
    Project,
    ProjectCategory,
    Review,
    VideoCategory,
    VideoItem,
    extract_youtube_id,
)


SEED_DIR = Path(__file__).resolve().parents[2] / "seed_data"
LANGUAGES = ("fr", "en")


def parse_datetime(value):
    if not value:
        return None
    parsed = datetime.fromisoformat(value)
    if timezone.is_naive(parsed):
        return timezone.make_aware(parsed)
    return parsed


def section(data, name):
    return data.get(name, [])


class Command(BaseCommand):
    help = "Seed idempotent du contenu initial depuis les JSON fr/en."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Affiche le plan sans écrire en base.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        self.dry_run = options["dry_run"]
        self.data = self.load_seed_data()
        self.fr = self.data["fr"]
        self.en = self.data["en"]

        counts = {
            "project_categories": self.seed_project_categories(),
            "projects": self.seed_projects(),
            "faqs": self.seed_faqs(),
            "reviews": self.seed_reviews(),
            "article_categories": self.seed_article_categories(),
            "articles": self.seed_articles(),
            "job_departments": self.seed_job_departments(),
            "job_offers": self.seed_jobs(),
            "partnership_types": self.seed_partnership_types(),
            "video_categories": self.seed_video_categories(),
            "videos": self.seed_videos(),
        }

        mode = "DRY RUN" if self.dry_run else "OK"
        for key, value in counts.items():
            self.stdout.write(f"{mode} {key}: {value}")

        if self.dry_run:
            transaction.set_rollback(True)

    def load_seed_data(self):
        data = {}
        for language in LANGUAGES:
            path = SEED_DIR / f"initial_content.{language}.json"
            if not path.exists():
                raise CommandError(f"Fichier de seed introuvable: {path}")
            with path.open(encoding="utf-8") as file:
                data[language] = json.load(file)
        return data

    def translated_item(self, section_name, key, value, language):
        for item in section(self.data[language], section_name):
            if item.get(key) == value:
                return item
        return None

    def translated_ordered_item(self, section_name, order, language):
        items = section(self.data[language], section_name)
        if order - 1 < len(items):
            return items[order - 1]
        return None

    def translate(self, obj, fields_by_language):
        for language, fields in fields_by_language.items():
            obj.set_current_language(language)
            for field, value in fields.items():
                setattr(obj, field, value or "")
            obj.save()

    def seed_project_categories(self):
        count = 0
        for order, item in enumerate(section(self.fr, "project_categories"), start=1):
            obj, _ = ProjectCategory.objects.update_or_create(
                code=item["code"],
                defaults={"sort_order": order, "is_active": True},
            )
            translations = {}
            for language in LANGUAGES:
                translated = (
                    self.translated_item(
                        "project_categories", "code", item["code"], language
                    )
                    or item
                )
                translations[language] = {"name": translated["name"]}
            self.translate(obj, translations)
            count += 1
        return count

    def seed_projects(self):
        categories = {item.code: item for item in ProjectCategory.objects.all()}
        count = 0
        for order, item in enumerate(section(self.fr, "projects"), start=1):
            obj, _ = Project.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "category": categories[item["category"]],
                    "technologies": item.get("technologies", ""),
                    "external_url": item.get("external_url", ""),
                    "is_featured": item.get("is_featured", False),
                    "is_active": item.get("is_active", True),
                    "sort_order": order,
                    "published_at": parse_datetime(item.get("published_at"))
                    or timezone.now(),
                },
            )
            translations = {}
            for language in LANGUAGES:
                translated = (
                    self.translated_item("projects", "slug", item["slug"], language)
                    or item
                )
                translations[language] = {
                    "title": translated["title"],
                    "short_description": translated.get("short_description", ""),
                    "description": translated.get("description", ""),
                    "seo_title": translated.get("seo_title", ""),
                    "seo_description": translated.get("seo_description", ""),
                }
            self.translate(obj, translations)
            count += 1
        return count

    def seed_faqs(self):
        count = 0
        for order, item in enumerate(section(self.fr, "faqs"), start=1):
            obj, _ = FAQ.objects.update_or_create(
                page=FAQ.Page.HOME,
                sort_order=order,
                defaults={"sort_order": order, "is_active": True},
            )
            translations = {}
            for language in LANGUAGES:
                translated = (
                    self.translated_ordered_item("faqs", order, language) or item
                )
                translations[language] = {
                    "question": translated["question"],
                    "answer": translated["answer"],
                }
            self.translate(obj, translations)
            count += 1
        return count

    def seed_reviews(self):
        count = 0
        for order, item in enumerate(section(self.fr, "reviews"), start=1):
            obj, _ = Review.objects.update_or_create(
                client_name=item["client_name"],
                company=item.get("company", ""),
                defaults={
                    "rating": item.get("rating", 5),
                    "is_featured": item.get("is_featured", True),
                    "is_active": item.get("is_active", True),
                    "sort_order": order,
                },
            )
            translations = {}
            for language in LANGUAGES:
                translated = (
                    self.translated_ordered_item("reviews", order, language) or item
                )
                translations[language] = {
                    "client_role": translated.get("client_role", ""),
                    "content": translated["content"],
                }
            self.translate(obj, translations)
            count += 1
        return count

    def seed_article_categories(self):
        count = 0
        for order, item in enumerate(section(self.fr, "article_categories"), start=1):
            obj, _ = ArticleCategory.objects.update_or_create(
                slug=item["slug"],
                defaults={"sort_order": order, "is_active": True},
            )
            translations = {}
            for language in LANGUAGES:
                translated = (
                    self.translated_item(
                        "article_categories", "slug", item["slug"], language
                    )
                    or item
                )
                translations[language] = {"name": translated["name"]}
            self.translate(obj, translations)
            count += 1
        return count

    def seed_articles(self):
        categories = {item.slug: item for item in ArticleCategory.objects.all()}
        count = 0
        for item in section(self.fr, "articles"):
            obj, _ = Article.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "category": categories[item["category"]],
                    "author_name": item.get("author_name", "Revival"),
                    "reading_time": item.get("reading_time", 5),
                    "status": item.get("status", Article.Status.PUBLISHED),
                    "is_featured": item.get("is_featured", False),
                    "published_at": parse_datetime(item.get("published_at")),
                },
            )
            translations = {}
            for language in LANGUAGES:
                translated = (
                    self.translated_item("articles", "slug", item["slug"], language)
                    or item
                )
                translations[language] = {
                    "title": translated["title"],
                    "excerpt": translated.get("excerpt", ""),
                    "content": translated.get("content", ""),
                    "seo_title": translated.get("seo_title", ""),
                    "seo_description": translated.get("seo_description", ""),
                }
            self.translate(obj, translations)
            count += 1
        return count

    def seed_job_departments(self):
        count = 0
        for order, item in enumerate(section(self.fr, "job_departments"), start=1):
            obj, _ = JobDepartment.objects.update_or_create(
                code=item["code"],
                defaults={"sort_order": order, "is_active": True},
            )
            translations = {}
            for language in LANGUAGES:
                translated = (
                    self.translated_item(
                        "job_departments", "code", item["code"], language
                    )
                    or item
                )
                translations[language] = {"name": translated["name"]}
            self.translate(obj, translations)
            count += 1
        return count

    def seed_jobs(self):
        departments = {item.code: item for item in JobDepartment.objects.all()}
        count = 0
        for order, item in enumerate(section(self.fr, "job_offers"), start=1):
            obj, _ = JobOffer.objects.update_or_create(
                department=departments[item["department"]],
                sort_order=order,
                defaults={
                    "contract_type": item.get(
                        "contract_type", JobOffer.ContractType.FULL_TIME
                    ),
                    "salary_range": item.get("salary_range", ""),
                    "deadline": item.get("deadline") or None,
                    "published_at": parse_datetime(item.get("published_at"))
                    or timezone.now(),
                    "is_active": item.get("is_active", True),
                    "sort_order": order,
                },
            )
            translations = {}
            for language in LANGUAGES:
                translated = (
                    self.translated_ordered_item("job_offers", order, language) or item
                )
                translations[language] = {
                    "title": translated["title"],
                    "location": translated.get("location", ""),
                    "description": translated.get("description", ""),
                    "requirements": translated.get("requirements", ""),
                }
            self.translate(obj, translations)
            count += 1
        return count

    def seed_partnership_types(self):
        count = 0
        for order, item in enumerate(section(self.fr, "partnership_types"), start=1):
            obj, _ = PartnershipType.objects.update_or_create(
                code=item["code"],
                defaults={"sort_order": order, "is_active": True},
            )
            translations = {}
            for language in LANGUAGES:
                translated = (
                    self.translated_item(
                        "partnership_types", "code", item["code"], language
                    )
                    or item
                )
                translations[language] = {
                    "name": translated["name"],
                    "description": translated.get("description", ""),
                }
            self.translate(obj, translations)
            count += 1
        return count

    def seed_video_categories(self):
        count = 0
        for order, item in enumerate(section(self.fr, "video_categories"), start=1):
            obj, _ = VideoCategory.objects.update_or_create(
                code=item["code"],
                defaults={"sort_order": order, "is_active": True},
            )
            translations = {}
            for language in LANGUAGES:
                translated = (
                    self.translated_item(
                        "video_categories", "code", item["code"], language
                    )
                    or item
                )
                translations[language] = {"name": translated["name"]}
            self.translate(obj, translations)
            count += 1
        return count

    def seed_videos(self):
        categories = {item.code: item for item in VideoCategory.objects.all()}
        count = 0
        for order, item in enumerate(section(self.fr, "videos"), start=1):
            youtube_id = extract_youtube_id(item["youtube_url"])
            obj, _ = VideoItem.objects.update_or_create(
                sort_order=order,
                defaults={
                    "category": categories[item["category"]],
                    "youtube_url": item["youtube_url"],
                    "youtube_id": youtube_id,
                    "is_active": item.get("is_active", True),
                    "is_featured": item.get("is_featured", order <= 3),
                    "sort_order": order,
                },
            )
            translations = {}
            for language in LANGUAGES:
                translated = (
                    self.translated_ordered_item("videos", order, language) or item
                )
                translations[language] = {
                    "title": translated["title"],
                    "description": translated.get("description", ""),
                }
            self.translate(obj, translations)
            count += 1
        return count
