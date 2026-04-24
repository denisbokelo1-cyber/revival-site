from django.urls import path
from django.views.i18n import JavaScriptCatalog

from . import views

app_name = "website"

urlpatterns = [
    path("", views.HomeView.as_view(), name="home"),
    path("index.html", views.HomeView.as_view()),
    path("about.html", views.AboutView.as_view(), name="about"),
    path("solutions.html", views.SolutionsView.as_view(), name="solutions"),
    path("careers.html", views.CareersView.as_view(), name="careers"),
    path("products.html", views.ProductsView.as_view(), name="products"),
    path("portfolio.html", views.PortfolioView.as_view(), name="portfolio"),
    path("videos.html", views.VideosView.as_view(), name="videos"),
    path("partenaire.html", views.PartenaireView.as_view(), name="partenaire"),
    path("blog.html", views.BlogView.as_view(), name="blog"),
    path("contact.html", views.ContactView.as_view(), name="contact"),
    path(
        "conditions-partenariat.html",
        views.PartnershipTermsView.as_view(),
        name="partnership_terms",
    ),
    path(
        "politique-confidentialite.html",
        views.PrivacyPolicyView.as_view(),
        name="privacy_policy",
    ),
    path("splash.html", views.SplashView.as_view(), name="splash"),
    path("coming-soon.html", views.ComingSoonView.as_view(), name="coming_soon"),
    path(
        "articles/avenir-digital-rdc.html",
        views.AvenirDigitalRdcView.as_view(),
        name="article_avenir_digital_rdc",
    ),
    path(
        "articles/cybersecurite.html",
        views.CybersecuriteView.as_view(),
        name="article_cybersecurite",
    ),
    path(
        "articles/digitaliser-pme-2026.html",
        views.DigitaliserPmeView.as_view(),
        name="article_digitaliser_pme_2026",
    ),
    path("articles/ecomnex.html", views.EcomnexArticleView.as_view(), name="article_ecomnex"),
    path("articles/freela.html", views.FreelaArticleView.as_view(), name="article_freela"),
    path("articles/kulatable.html", views.KulatableArticleView.as_view(), name="article_kulatable"),
    path("articles/poshub.html", views.PoshubArticleView.as_view(), name="article_poshub"),
    path("api/contact/", views.contact_submit, name="contact_submit"),
    path("api/application/", views.application_submit, name="application_submit"),
    path("api/video-interactions/", views.video_interactions, name="video_interactions"),
    path("jsi18n/", JavaScriptCatalog.as_view(), name="javascript_catalog"),
]
