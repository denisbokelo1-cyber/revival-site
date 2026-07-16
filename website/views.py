import json
from typing import Any

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.utils import timezone
from django.utils.translation import gettext as _
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

from website.email_utils import OutboundEmail, build_kv_body, send_to_contact_email
from website.models import (
    ContactMessage,
    FAQ,
    JobApplication,
    JobDepartment,
    JobOffer,
    NewsletterSubscriber,
    PartnerApplication,
    PartnerDocument,
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


class CguView(RevivalTemplateView):
    template_name = "website/cgu.html"


class LegalMentionsView(RevivalTemplateView):
    template_name = "website/mentions-legales.html"


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
def partner_submit(request):
    if request.method != "POST":
        return JsonResponse(
            {"success": False, "message": _("Method not allowed")}, status=405
        )



    company_name = request.POST.get("companyName", "").strip()
    manager_name = request.POST.get("managerName", "").strip()
    email = request.POST.get("email", "").strip()
    phone = request.POST.get("phone", "").strip()
    country = request.POST.get("country", "").strip()
    objective = request.POST.get("objective", "").strip()
    job_title = request.POST.get("jobTitle", "").strip()
    sector = request.POST.get("sector", "").strip()
    company_size = request.POST.get("companySize", "").strip()
    website = request.POST.get("website", "").strip()
    partner_type = request.POST.get("partner_type", "").strip()
    services = request.POST.get("services", "").strip()
    cgp_consent = request.POST.get("cgp_consent", "0") == "1"
    rgpd_consent = request.POST.get("rgpd_consent", "0") == "1"

    missing_fields = []
    if not company_name:
        missing_fields.append("companyName")
    if not manager_name:
        missing_fields.append("managerName")
    if not email:
        missing_fields.append("email")
    if not objective:
        missing_fields.append("objective")
    if not partner_type:
        missing_fields.append("partner_type")

    if missing_fields:
        return JsonResponse(
            {
                "success": False,
                "code": "VALIDATION_ERROR",
                "message": "Votre candidature n'a pas pu être soumise.",
                "errors": {f: "Ce champ est obligatoire." for f in missing_fields},
            },
            status=400,
        )

    if not cgp_consent:
        return JsonResponse(
            {
                "success": False,
                "code": "VALIDATION_ERROR",
                "message": "Votre candidature n'a pas pu être soumise.",
                "errors": {"cgp": "Vous devez accepter les conditions de partenariat."},
            },
            status=400,
        )

    if not rgpd_consent:
        return JsonResponse(
            {
                "success": False,
                "code": "VALIDATION_ERROR",
                "message": "Votre candidature n'a pas pu être soumise.",
                "errors": {"rgpd": "Vous devez consentir au traitement de vos données."},
            },
            status=400,
        )

    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse(
            {
                "success": False,
                "code": "VALIDATION_ERROR",
                "message": "Votre candidature n'a pas pu être soumise.",
                "errors": {"email": "Adresse email invalide."},
            },
            status=400,
        )

    application = PartnerApplication(
        company_name=company_name,
        manager_name=manager_name,
        email=email,
        phone=phone,
        country=country,
        website=website,
        objective=objective,
        job_title=job_title,
        sector=sector,
        company_size=company_size,
        partner_type=partner_type,
        services=services,
        cgp_consent=cgp_consent,
        rgpd_consent=rgpd_consent,
    )

    presentation_file = request.FILES.get("presentation")
    portfolio_file = request.FILES.get("portfolio")

    import mimetypes

    for file_field, doc_type in [(presentation_file, "presentation"), (portfolio_file, "portfolio")]:
        if file_field:
            if file_field.size == 0:
                return JsonResponse(
                    {
                        "success": False,
                        "code": "VALIDATION_ERROR",
                        "message": "Fichier vide.",
                        "errors": {doc_type: "Le fichier semble vide."},
                    },
                    status=400,
                )

            if file_field.size > 20 * 1024 * 1024:
                return JsonResponse(
                    {
                        "success": False,
                        "code": "VALIDATION_ERROR",
                        "message": "Fichier trop volumineux.",
                        "errors": {doc_type: f"Le fichier '{file_field.name}' dépasse la limite autorisée (20 Mo)."},
                    },
                    status=413,
                )

            mime_type, _ = mimetypes.guess_type(file_field.name)
            allowed_mimes = {
                "application/pdf",
                "image/jpeg",
                "image/png",
                "application/zip",
                "application/x-zip-compressed",
            }
            ext = file_field.name.rsplit(".", 1)[-1].lower() if "." in file_field.name else ""
            if ext not in {"pdf", "jpg", "jpeg", "png", "zip"}:
                return JsonResponse(
                    {
                        "success": False,
                        "code": "VALIDATION_ERROR",
                        "message": "Format non accepté.",
                        "errors": {doc_type: f"Le fichier '{file_field.name}' n'est pas dans un format autorisé (PDF, JPG, PNG, ZIP)."},
                    },
                    status=415,
                )

    try:
        application.full_clean()
        application.save()
    except ValidationError as exc:
        return JsonResponse(
            {
                "success": False,
                "code": "VALIDATION_ERROR",
                "message": "Données invalides.",
                "errors": exc.message_dict,
            },
            status=400,
        )

    # Save files linked to the application
    for file_field, doc_type in [(presentation_file, "presentation"), (portfolio_file, "portfolio")]:
        if file_field:
            PartnerDocument.objects.create(
                application=application,
                file=file_field,
                document_type=doc_type,
                original_name=file_field.name,
                file_size=file_field.size,
                file_type=file_field.mime_type if hasattr(file_field, 'mime_type') else "",
            )

    try:
        attachments = []
        for file_field, doc_type in [(presentation_file, "presentation"), (portfolio_file, "portfolio")]:
            if not file_field:
                continue
            try:
                file_field.open("rb")
                content = file_field.read()
                file_field.close()
            except Exception:
                content = b""
            # If content is empty, still attach name (some email providers may reject empty files)
            if content:
                attachments.append((file_field.name, content, file_field.content_type or "application/octet-stream"))

        mail_body = build_kv_body(
            "Nouvelle demande de partenariat Revival",
            {
                "company_name": application.company_name,
                "manager_name": application.manager_name,
                "email": application.email,
                "phone": application.phone,
                "country": application.country,
                "website": application.website,
                "objective": application.objective,
                "job_title": application.job_title,
                "sector": application.sector,
                "company_size": application.company_size,
                "partner_type": application.partner_type,
                "services": application.services,
                "cgp_consent": application.cgp_consent,
                "rgpd_consent": application.rgpd_consent,
                "application_id": application.pk,
            },
        )

        send_to_contact_email(
            email=OutboundEmail(
                subject=f"[Revival] Partenariat - {application.company_name}",
                body_text=mail_body,
                attachments=attachments,
            )
        )
    except Exception as exc:
        return JsonResponse(
            {
                "success": False,
                "message": _("Impossible d'envoyer la notification par e-mail. Merci de réessayer."),
                "errors": {"email": str(exc)},
            },
            status=500,
        )

    return JsonResponse(
        {
            "success": True,
            "message": "Demande de partenariat envoyée avec succès.",
            "id": application.pk,
        }
    )



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

    try:
        mail_body = build_kv_body(
            "Nouveau message de contact Revival",
            {
                "first_name": contact_message.first_name,
                "last_name": contact_message.last_name,
                "email": contact_message.email,
                "company": contact_message.company,
                "subject": contact_message.subject,
                "message": contact_message.message,
                "contact_message_id": contact_message.pk,
            },
        )

        send_to_contact_email(
            email=OutboundEmail(
                subject=f"[Revival] Contact - {contact_message.first_name} {contact_message.last_name}",
                body_text=mail_body,
            )
        )
    except Exception as exc:
        return JsonResponse(
            {
                "success": False,
                "message": _("Impossible d'envoyer la notification par e-mail. Merci de réessayer."),
                "errors": {"email": str(exc)},
            },
            status=500,
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

    try:
        mail_body = build_kv_body(
            "Nouvel abonnement newsletter Revival",
            {
                "email": subscriber.email,
                "source": subscriber.source,
                "is_active": subscriber.is_active,
                "newsletter_subscriber_id": subscriber.pk,
            },
        )
        send_to_contact_email(
            email=OutboundEmail(
                subject=f"[Revival] Newsletter - {subscriber.email}",
                body_text=mail_body,
            )
        )
    except Exception as exc:
        return JsonResponse(
            {
                "success": False,
                "message": _("Impossible d'envoyer la notification par e-mail. Merci de réessayer."),
                "errors": {"email": str(exc)},
            },
            status=500,
        )

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

    try:
        attachments = []
        for file_field in [cv, cover_letter]:
            if not file_field:
                continue
            try:
                file_field.open("rb")
                content = file_field.read()
                file_field.close()
            except Exception:
                content = b""
            if content:
                attachments.append((file_field.name, content, file_field.content_type or "application/octet-stream"))

        mail_body = build_kv_body(
            "Nouvelle candidature Revival",
            {
                "full_name": application.full_name,
                "email": application.email,
                "salary_expectation": application.salary_expectation,
                "availability": application.availability,
                "job_id": application.job_id,
                "job_title": application.job.translation_getter("title", any_language=True) if getattr(application, 'job', None) else "",
                "application_id": application.pk,
            },
        )

        send_to_contact_email(
            email=OutboundEmail(
                subject=f"[Revival] Carrière - {application.full_name}",
                body_text=mail_body,
                attachments=attachments,
            )
        )
    except Exception as exc:
        return JsonResponse(
            {
                "success": False,
                "message": _("Impossible d'envoyer la notification par e-mail. Merci de réessayer."),
                "errors": {"email": str(exc)},
            },
            status=500,
        )

    return JsonResponse(
        {
            "success": True,
            "message": _("Candidature enregistrée avec succès."),
            "id": application.pk,
        }
    )



@csrf_exempt
def donation_submit(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": _("Method not allowed")}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        payload = request.POST.dict()

    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    phone = (payload.get("phone") or "").strip()
    country = (payload.get("country") or "").strip()
    message = (payload.get("message") or "").strip()

    amount = payload.get("amount")
    try:
        amount_value = float(amount)
    except (TypeError, ValueError):
        amount_value = None

    donation_type = (payload.get("donation_type") or "").strip()
    currency = (payload.get("currency") or "USD").strip()
    anonymous = bool(payload.get("anonymous"))
    payment_method = (payload.get("paymentMethod") or "").strip()

    missing_fields = []
    if not name:
        missing_fields.append("name")
    if not email:
        missing_fields.append("email")
    if not phone:
        missing_fields.append("phone")
    if not country:
        missing_fields.append("country")
    if amount_value is None or amount_value <= 0:
        missing_fields.append("amount")

    if missing_fields:
        return JsonResponse({"success": False, "message": _("Champs obligatoires manquants."), "errors": {"missing_fields": missing_fields}}, status=400)

    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({"success": False, "message": _("Adresse email invalide."), "errors": {"email": "Adresse email invalide."}}, status=400)

    display_name = "Anonyme" if anonymous else name

    mail_body = build_kv_body(
        "Nouvelle demande de don Revival",
        {
            "name": display_name,
            "email": email,
            "phone": phone,
            "country": country,
            "message": message or "",
            "donation_type": donation_type or payload.get("type") or "Don",
            "amount": amount_value,
            "currency": currency,
            "payment_method": payment_method,
        },
    )

    try:
        # Email admin/contact (comme les autres formulaires)
        send_to_contact_email(
            email=OutboundEmail(
                subject=f"[Revival] Don - {display_name}",
                body_text=mail_body,
            )
        )

        # Email de confirmation au donateur (le "mail du compagnon" du formulaire)
        donor_body = build_kv_body(
            "Merci pour votre don à Revival",
            {
                "name": display_name,
                "don_amount": amount_value,
                "currency": currency,
                "donation_type": donation_type or payload.get("type") or "Don",
                "payment_method": payment_method,
                "message": message or "",
            },
        )

        send_to_contact_email(
            email=OutboundEmail(
                subject="[Revival] Confirmation de votre don",
                body_text=donor_body,
                to=[email],
                reply_to=[email] if email else [],
            )
        )
    except Exception as exc:
        return JsonResponse(
            {
                "success": False,
                "message": _(
                    "Impossible d'envoyer la notification par e-mail. Merci de réessayer."
                ),
                "errors": {"email": str(exc)},
            },
            status=500,
        )

    return JsonResponse(
        {"success": True, "message": _("Demande de don envoyée avec succès."), "id": None}
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
