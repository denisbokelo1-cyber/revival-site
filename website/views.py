import json
from typing import Any

from django.http import JsonResponse
from django.utils import timezone
from django.utils.translation import gettext as _
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

from website.models import FAQ, Review


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


class ProductsView(RevivalTemplateView):
    template_name = "website/products.html"
    active_page = "products"


class PortfolioView(RevivalTemplateView):
    template_name = "website/portfolio.html"
    active_page = "portfolio"


class VideosView(RevivalTemplateView):
    template_name = "website/videos.html"
    active_page = "videos"


class PartenaireView(RevivalTemplateView):
    template_name = "website/partenaire.html"
    active_page = "partenaire"


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
    return JsonResponse({"success": True})


@csrf_exempt
def application_submit(request):
    if request.method != "POST":
        return JsonResponse(
            {"success": False, "message": _("Method not allowed")}, status=405
        )
    return JsonResponse({"success": True})


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
