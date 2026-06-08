import json
from typing import Any

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.utils import timezone
from django.utils.translation import gettext as _
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

from website.models import (
    ContactMessage,
    FAQ,
    JobApplication,
    JobDepartment,
    JobOffer,
    NewsletterSubscriber,
    Project,
    ProjectCategory,
    Review,
)


class RevivalTemplateView(TemplateView):
    active_page = ""

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["active_page"] = self.active_page
        return context


class HomeView(RevivalTemplateView):
    template_name = "website/home.html"
    active_page = "home"

    def get_context_data(self, **kwargs) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context["faqs"] = FAQ.objects.filter(page=FAQ.Page.HOME, is_active=True)
        context["reviews"] = Review.objects.filter(is_active=True, is_featured=True)
        context["projects"] = Project.objects.filter(is_active=True, is_featured=True)
        return context


class AboutView(RevivalTemplateView):
    template_name = "website/about.html"
    active_page = "about"


class SolutionsView(RevivalTemplateView):
    template_name = "website/solutions.html"
    active_page = "solutions"


class CareersView(RevivalTemplateView):
    template_name = "website/careers.html"
    active_page = "careers"

    def get_context_data(self, **kwargs) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        job_offers = (
            JobOffer.objects.filter(is_active=True)
            .select_related("department")
            .order_by("sort_order", "-published_at")
        )

        dept_ids = {
            offer.department_id
            for offer in job_offers
            if getattr(offer, "department_id", None) is not None
        }
        departments = (
            JobDepartment.objects.filter(id__in=dept_ids, is_active=True)
            .order_by("sort_order", "code")
        )

        context["job_offers"] = job_offers
        context["job_departments"] = departments
        return context


class ProductsView(RevivalTemplateView):
    template_name = "website/products.html"
    active_page = "products"


class PortfolioView(RevivalTemplateView):
    template_name = "website/portfolio.html"
    active_page = "portfolio"

    def get_context_data(self, **kwargs) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        projects = (
            Project.objects.filter(is_active=True)
            .select_related("category")
            .order_by("sort_order", "-published_at")
        )

        category_ids = {
            project.category_id
            for project in projects
            if getattr(project, "category_id", None) is not None
        }
        project_categories = (
            ProjectCategory.objects.filter(id__in=category_ids, is_active=True)
            .order_by("sort_order", "code")
        )

        stats = {
            "projects_count": projects.count(),
            "categories_count": project_categories.count(),
            "featured_count": sum(1 for p in projects if p.is_featured),
            "with_link_count": sum(1 for p in projects if p.external_url),
        }

        context["projects"] = projects
        context["project_categories"] = project_categories
        context["portfolio_stats"] = stats
        return context


class VideosView(RevivalTemplateView):
    template_name = "website/videos.html"
    active_page = "videos"


class PartenaireView(RevivalTemplateView):
    template_name = "website/partenaire.html"
    active_page = "partenaire"


class DonateView(RevivalTemplateView):
    template_name = "website/don.html"
    active_page = "don"


class BlogView(RevivalTemplateView):
    template_name = "website/blog.html"
    active_page = "blog"


class ContactView(RevivalTemplateView):
    template_name = "website/contact.html"
    active_page = "contact"


class PartnershipTermsView(RevivalTemplateView):
    template_name = "website/conditions-partenariat.html"


class PrivacyPolicyView(RevivalTemplateView):
    template_name = "website/politique-confidentialite.html"


class SplashView(TemplateView):
    template_name = "website/splash.html"


class ComingSoonView(TemplateView):
    template_name = "website/coming-soon.html"


class ArticleView(RevivalTemplateView):
    active_page = "blog"


class AvenirDigitalRdcView(ArticleView):
    template_name = "website/articles/avenir-digital-rdc.html"


class CybersecuriteView(ArticleView):
    template_name = "website/articles/cybersecurite.html"


class DigitaliserPmeView(ArticleView):
    template_name = "website/articles/digitaliser-pme-2026.html"


class EcomnexArticleView(ArticleView):
    template_name = "website/articles/ecomnex.html"


class FreelaArticleView(ArticleView):
    template_name = "website/articles/freela.html"


class KulatableArticleView(ArticleView):
    template_name = "website/articles/kulatable.html"


class PoshubArticleView(ArticleView):
    template_name = "website/articles/poshub.html"


@csrf_exempt
def contact_submit(request):
    if request.method != "POST":
        return JsonResponse(
            {"success": False, "message": _("Method not allowed")}, status=405
        )

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        payload = request.POST.dict()

    submission_type = (payload.get("type") or "contact").strip().lower()
    if submission_type != "contact":
        # Preserve backward compatibility for other temporary frontend flows.
        return JsonResponse({"success": True})

    first_name = (payload.get("first_name") or payload.get("firstName") or "").strip()
    last_name = (payload.get("last_name") or payload.get("lastName") or "").strip()
    email = (payload.get("email") or "").strip()
    company = (payload.get("company") or "").strip()
    subject = (payload.get("subject") or "").strip()
    message = (payload.get("message") or "").strip()

    missing_fields = []
    if not first_name:
        missing_fields.append("first_name")
    if not last_name:
        missing_fields.append("last_name")
    if not email:
        missing_fields.append("email")
    if not message:
        missing_fields.append("message")

    if missing_fields:
        return JsonResponse(
            {
                "success": False,
                "message": _("Veuillez remplir tous les champs obligatoires."),
                "errors": {"missing_fields": missing_fields},
            },
            status=400,
        )

    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse(
            {"success": False, "message": _("Adresse email invalide.")},
            status=400,
        )

    contact_message = ContactMessage(
        first_name=first_name,
        last_name=last_name,
        email=email,
        company=company,
        subject=subject,
        message=message,
    )
    try:
        contact_message.full_clean()
        contact_message.save()
    except ValidationError as exc:
        return JsonResponse(
            {
                "success": False,
                "message": _("Données invalides."),
                "errors": exc.message_dict,
            },
            status=400,
        )

    return JsonResponse(
        {
            "success": True,
            "message": _("Message envoyé avec succès."),
            "id": contact_message.pk,
        }
    )


@csrf_exempt
def newsletter_subscribe(request):
    if request.method != "POST":
        return JsonResponse(
            {"success": False, "message": _("Method not allowed")}, status=405
        )

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        payload = request.POST.dict()

    email = (payload.get("email") or "").strip()
    source = (payload.get("source") or "").strip()

    if not email:
        return JsonResponse(
            {
                "success": False,
                "message": _("Veuillez remplir tous les champs obligatoires."),
                "errors": {"missing_fields": ["email"]},
            },
            status=400,
        )

    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse(
            {"success": False, "message": _("Adresse email invalide.")},
            status=400,
        )

    subscriber, created = NewsletterSubscriber.objects.get_or_create(
        email=email,
        defaults={"source": source, "is_active": True},
    )
    if not created:
        subscriber.is_active = True
        if source:
            subscriber.source = source
        subscriber.save(update_fields=["is_active", "source", "updated_at"])

    return JsonResponse(
        {
            "success": True,
            "message": _("✓ Merci ! Vous êtes bien inscrit(e) à la newsletter Revival."),
            "id": subscriber.pk,
        }
    )


@csrf_exempt
def application_submit(request):
    if request.method != "POST":
        return JsonResponse(
            {"success": False, "message": _("Method not allowed")}, status=405
        )

    full_name = (request.POST.get("full_name") or "").strip()
    email = (request.POST.get("email") or "").strip()
    salary_expectation = (request.POST.get("salary_expectation") or "").strip()
    availability = (request.POST.get("availability") or "").strip()
    rgpd_consent = (request.POST.get("rgpd_consent") or "").strip()

    job_id = (request.POST.get("job_id") or "").strip()
    job_title = (request.POST.get("job_title") or "").strip()
    job_company = (request.POST.get("job_company") or "").strip()
    job_location = (request.POST.get("job_location") or "").strip()
    job_description = (request.POST.get("job_description") or "").strip()

    cv = request.FILES.get("cv")
    cover_letter = request.FILES.get("cover_letter")

    missing_fields = []
    if not full_name:
        missing_fields.append("full_name")
    if not email:
        missing_fields.append("email")
    if not availability:
        missing_fields.append("availability")
    if not rgpd_consent:
        missing_fields.append("rgpd_consent")
    if not cv:
        missing_fields.append("cv")
    if not cover_letter:
        missing_fields.append("cover_letter")

    if missing_fields:
        return JsonResponse(
            {
                "success": False,
                "message": _("Veuillez remplir tous les champs obligatoires."),
                "errors": {"missing_fields": missing_fields},
            },
            status=400,
        )

    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse(
            {"success": False, "message": _("Adresse email invalide.")},
            status=400,
        )

    job = None
    if job_id:
        try:
            job = JobOffer.objects.get(pk=int(job_id))
        except (ValueError, JobOffer.DoesNotExist):
            return JsonResponse(
                {"success": False, "message": _("Offre invalide.")},
                status=400,
            )

    metadata_chunks = []
    if job_title:
        metadata_chunks.append(f"Poste: {job_title}")
    if job_company:
        metadata_chunks.append(f"Entreprise: {job_company}")
    if job_location:
        metadata_chunks.append(f"Localisation: {job_location}")
    if job_description:
        metadata_chunks.append(f"Description: {job_description}")

    app_message = "\n".join(metadata_chunks)

    application = JobApplication(
        job=job,
        full_name=full_name,
        email=email,
        salary_expectation=salary_expectation,
        availability=availability,
        cv=cv,
        cover_letter=cover_letter,
        message=app_message,
    )

    try:
        application.full_clean()
        application.save()
    except ValidationError as exc:
        return JsonResponse(
            {
                "success": False,
                "message": _("Données invalides."),
                "errors": exc.message_dict,
            },
            status=400,
        )

    return JsonResponse(
        {
            "success": True,
            "message": _("Candidature enregistrée avec succès."),
            "id": application.pk,
        }
    )


@csrf_exempt
def video_interactions(request):
    action = request.GET.get("action", "")

    if action == "get_video":
        return JsonResponse({"success": True, "data": {"likes_count": 0}})

    if action == "get_comments":
        return JsonResponse(
            {
                "success": True,
                "data": {"comments": [], "pagination": {"total": 0}},
            }
        )

    if action == "add_like" and request.method == "POST":
        return JsonResponse({"success": True, "data": {"liked": True}})

    if action == "add_comment" and request.method == "POST":
        try:
            payload = json.loads(request.body.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            payload = {}
        return JsonResponse(
            {
                "success": True,
                "data": {
                    "id": int(timezone.now().timestamp()),
                    "author": payload.get("author") or _("Anonyme"),
                    "text": payload.get("text") or "",
                    "created_at": timezone.now().isoformat(),
                },
            }
        )

    return JsonResponse({"success": False, "message": _("Action inconnue")}, status=400)
