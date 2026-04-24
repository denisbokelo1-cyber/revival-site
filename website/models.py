import re
from urllib.parse import parse_qs, urlparse

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from parler.models import TranslatableModel, TranslatedFields


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(_("Date de création"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Date de modification"), auto_now=True)

    class Meta:
        abstract = True


class OrderedPublicationModel(TimeStampedModel):
    is_active = models.BooleanField(_("Actif"), default=True)
    sort_order = models.PositiveIntegerField(_("Ordre d'affichage"), default=0)

    class Meta:
        abstract = True
        ordering = ("sort_order", "-created_at")


class ProjectCategory(TranslatableModel, OrderedPublicationModel):
    code = models.SlugField(_("Code interne"), max_length=80, unique=True)
    translations = TranslatedFields(
        name=models.CharField(_("Nom"), max_length=120),
    )

    class Meta:
        verbose_name = _("Catégorie de projet")
        verbose_name_plural = _("Catégories de projets")

    def __str__(self):
        return self.safe_translation_getter("name", any_language=True) or self.code


class Project(TranslatableModel, OrderedPublicationModel):
    category = models.ForeignKey(
        ProjectCategory,
        verbose_name=_("Catégorie"),
        on_delete=models.PROTECT,
        related_name="projects",
    )
    slug = models.SlugField(_("Slug"), max_length=160, unique=True, blank=True)
    image = models.ImageField(_("Image"), upload_to="projects/", blank=True)
    external_url = models.URLField(_("Lien externe"), blank=True)
    technologies = models.CharField(
        _("Technologies"),
        max_length=255,
        blank=True,
        help_text=_("Liste courte séparée par des virgules."),
    )
    is_featured = models.BooleanField(_("Mis en avant"), default=False)
    published_at = models.DateTimeField(_("Date de publication"), default=timezone.now)
    translations = TranslatedFields(
        title=models.CharField(_("Titre"), max_length=180),
        short_description=models.CharField(_("Description courte"), max_length=280, blank=True),
        description=models.TextField(_("Description"), blank=True),
        seo_title=models.CharField(_("Titre SEO"), max_length=180, blank=True),
        seo_description=models.CharField(_("Description SEO"), max_length=300, blank=True),
    )

    class Meta:
        verbose_name = _("Projet")
        verbose_name_plural = _("Projets")
        ordering = ("sort_order", "-published_at")

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True) or self.slug

    def save(self, *args, **kwargs):
        if not self.slug:
            title = self.safe_translation_getter("title", any_language=True) or "project"
            self.slug = slugify(title)
        super().save(*args, **kwargs)


class FAQ(TranslatableModel, OrderedPublicationModel):
    class Page(models.TextChoices):
        HOME = "home", _("Accueil")
        SERVICES = "services", _("Services")
        PORTFOLIO = "portfolio", _("Portfolio")
        CAREERS = "careers", _("Carrières")
        PARTNERSHIP = "partnership", _("Partenariat")
        CONTACT = "contact", _("Contact")
        GENERAL = "general", _("Général")

    page = models.CharField(_("Page"), max_length=40, choices=Page.choices, default=Page.GENERAL)
    translations = TranslatedFields(
        question=models.CharField(_("Question"), max_length=240),
        answer=models.TextField(_("Réponse")),
    )

    class Meta:
        verbose_name = _("FAQ")
        verbose_name_plural = _("FAQ")

    def __str__(self):
        return self.safe_translation_getter("question", any_language=True) or self.page


class Review(TranslatableModel, OrderedPublicationModel):
    project = models.ForeignKey(
        Project,
        verbose_name=_("Projet lié"),
        on_delete=models.SET_NULL,
        related_name="reviews",
        blank=True,
        null=True,
    )
    client_name = models.CharField(_("Nom du client"), max_length=140)
    company = models.CharField(_("Entreprise"), max_length=160, blank=True)
    avatar = models.ImageField(_("Avatar"), upload_to="reviews/", blank=True)
    rating = models.PositiveSmallIntegerField(
        _("Note"),
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    is_featured = models.BooleanField(_("Mis en avant"), default=False)
    translations = TranslatedFields(
        client_role=models.CharField(_("Fonction du client"), max_length=160, blank=True),
        content=models.TextField(_("Avis")),
    )

    class Meta:
        verbose_name = _("Avis client")
        verbose_name_plural = _("Avis clients")

    def __str__(self):
        return f"{self.client_name} - {self.company}".strip(" -")


class ArticleCategory(TranslatableModel, OrderedPublicationModel):
    slug = models.SlugField(_("Slug"), max_length=100, unique=True)
    translations = TranslatedFields(
        name=models.CharField(_("Nom"), max_length=120),
    )

    class Meta:
        verbose_name = _("Catégorie d'article")
        verbose_name_plural = _("Catégories d'articles")

    def __str__(self):
        return self.safe_translation_getter("name", any_language=True) or self.slug


class Article(TranslatableModel, TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", _("Brouillon")
        PUBLISHED = "published", _("Publié")
        ARCHIVED = "archived", _("Archivé")

    category = models.ForeignKey(
        ArticleCategory,
        verbose_name=_("Catégorie"),
        on_delete=models.PROTECT,
        related_name="articles",
    )
    slug = models.SlugField(_("Slug"), max_length=180, unique=True, blank=True)
    author_name = models.CharField(_("Auteur"), max_length=140, default="Revival")
    cover_image = models.ImageField(_("Image de couverture"), upload_to="articles/", blank=True)
    reading_time = models.PositiveSmallIntegerField(_("Temps de lecture"), default=5)
    status = models.CharField(_("Statut"), max_length=20, choices=Status.choices, default=Status.DRAFT)
    is_featured = models.BooleanField(_("Mis en avant"), default=False)
    published_at = models.DateTimeField(_("Date de publication"), blank=True, null=True)
    translations = TranslatedFields(
        title=models.CharField(_("Titre"), max_length=220),
        excerpt=models.TextField(_("Résumé"), blank=True),
        content=models.TextField(_("Contenu")),
        seo_title=models.CharField(_("Titre SEO"), max_length=180, blank=True),
        seo_description=models.CharField(_("Description SEO"), max_length=300, blank=True),
    )

    class Meta:
        verbose_name = _("Article")
        verbose_name_plural = _("Articles")
        ordering = ("-published_at", "-created_at")

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True) or self.slug

    def save(self, *args, **kwargs):
        if not self.slug:
            title = self.safe_translation_getter("title", any_language=True) or "article"
            self.slug = slugify(title)
        if self.status == self.Status.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)


class JobDepartment(TranslatableModel, OrderedPublicationModel):
    code = models.SlugField(_("Code interne"), max_length=80, unique=True)
    translations = TranslatedFields(
        name=models.CharField(_("Nom"), max_length=120),
    )

    class Meta:
        verbose_name = _("Département")
        verbose_name_plural = _("Départements")

    def __str__(self):
        return self.safe_translation_getter("name", any_language=True) or self.code


class JobOffer(TranslatableModel, OrderedPublicationModel):
    class ContractType(models.TextChoices):
        FULL_TIME = "full_time", _("Temps plein")
        PART_TIME = "part_time", _("Temps partiel")
        FREELANCE = "freelance", _("Freelance")
        INTERNSHIP = "internship", _("Stage")

    department = models.ForeignKey(
        JobDepartment,
        verbose_name=_("Département"),
        on_delete=models.PROTECT,
        related_name="job_offers",
    )
    contract_type = models.CharField(
        _("Type de contrat"),
        max_length=30,
        choices=ContractType.choices,
        default=ContractType.FULL_TIME,
    )
    salary_range = models.CharField(_("Fourchette salariale"), max_length=120, blank=True)
    deadline = models.DateField(_("Date limite"), blank=True, null=True)
    published_at = models.DateTimeField(_("Date de publication"), default=timezone.now)
    translations = TranslatedFields(
        title=models.CharField(_("Titre"), max_length=180),
        location=models.CharField(_("Localisation"), max_length=160, blank=True),
        description=models.TextField(_("Description")),
        requirements=models.TextField(_("Prérequis"), blank=True),
    )

    class Meta:
        verbose_name = _("Offre d'emploi")
        verbose_name_plural = _("Offres d'emploi")
        ordering = ("sort_order", "-published_at")

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True) or str(self.pk)


class JobApplication(TimeStampedModel):
    class Status(models.TextChoices):
        NEW = "new", _("Nouvelle")
        REVIEWED = "reviewed", _("Consultée")
        SHORTLISTED = "shortlisted", _("Préselectionnée")
        REJECTED = "rejected", _("Refusée")
        ARCHIVED = "archived", _("Archivée")

    job = models.ForeignKey(
        JobOffer,
        verbose_name=_("Offre"),
        on_delete=models.SET_NULL,
        related_name="applications",
        blank=True,
        null=True,
    )
    full_name = models.CharField(_("Nom complet"), max_length=180)
    email = models.EmailField(_("Adresse email"))
    salary_expectation = models.CharField(_("Prétention salariale"), max_length=120, blank=True)
    availability = models.CharField(_("Disponibilité"), max_length=120, blank=True)
    cv = models.FileField(_("CV"), upload_to="applications/cv/", blank=True)
    cover_letter = models.FileField(
        _("Lettre de motivation"),
        upload_to="applications/cover_letters/",
        blank=True,
    )
    message = models.TextField(_("Message"), blank=True)
    status = models.CharField(_("Statut"), max_length=30, choices=Status.choices, default=Status.NEW)

    class Meta:
        verbose_name = _("Candidature")
        verbose_name_plural = _("Candidatures")
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.full_name} <{self.email}>"


class PartnershipType(TranslatableModel, OrderedPublicationModel):
    code = models.SlugField(_("Code interne"), max_length=80, unique=True)
    translations = TranslatedFields(
        name=models.CharField(_("Nom"), max_length=140),
        description=models.TextField(_("Description"), blank=True),
    )

    class Meta:
        verbose_name = _("Type de partenariat")
        verbose_name_plural = _("Types de partenariat")

    def __str__(self):
        return self.safe_translation_getter("name", any_language=True) or self.code


class PartnerApplication(TimeStampedModel):
    class Status(models.TextChoices):
        NEW = "new", _("Nouvelle")
        CONTACTED = "contacted", _("Contactée")
        ACCEPTED = "accepted", _("Acceptée")
        REJECTED = "rejected", _("Refusée")
        ARCHIVED = "archived", _("Archivée")

    partnership_type = models.ForeignKey(
        PartnershipType,
        verbose_name=_("Type de partenariat"),
        on_delete=models.SET_NULL,
        related_name="applications",
        blank=True,
        null=True,
    )
    company_name = models.CharField(_("Entreprise"), max_length=180)
    manager_name = models.CharField(_("Responsable"), max_length=180)
    email = models.EmailField(_("Adresse email"))
    phone = models.CharField(_("Téléphone"), max_length=80, blank=True)
    country = models.CharField(_("Pays / ville"), max_length=140, blank=True)
    website = models.URLField(_("Site web"), blank=True)
    objective = models.TextField(_("Objectif du partenariat"))
    status = models.CharField(_("Statut"), max_length=30, choices=Status.choices, default=Status.NEW)

    class Meta:
        verbose_name = _("Demande de partenariat")
        verbose_name_plural = _("Demandes de partenariat")
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.company_name} - {self.email}"


class ContactMessage(TimeStampedModel):
    class Status(models.TextChoices):
        NEW = "new", _("Nouveau")
        READ = "read", _("Lu")
        REPLIED = "replied", _("Répondu")
        ARCHIVED = "archived", _("Archivé")

    first_name = models.CharField(_("Prénom"), max_length=120)
    last_name = models.CharField(_("Nom"), max_length=120)
    email = models.EmailField(_("Adresse email"))
    company = models.CharField(_("Entreprise"), max_length=160, blank=True)
    subject = models.CharField(_("Sujet"), max_length=180, blank=True)
    message = models.TextField(_("Message"))
    status = models.CharField(_("Statut"), max_length=30, choices=Status.choices, default=Status.NEW)

    class Meta:
        verbose_name = _("Message de contact")
        verbose_name_plural = _("Messages de contact")
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"


class NewsletterSubscriber(TimeStampedModel):
    email = models.EmailField(_("Adresse email"), unique=True)
    source = models.CharField(_("Source"), max_length=80, blank=True)
    is_active = models.BooleanField(_("Actif"), default=True)

    class Meta:
        verbose_name = _("Abonné newsletter")
        verbose_name_plural = _("Abonnés newsletter")
        ordering = ("-created_at",)

    def __str__(self):
        return self.email


class VideoCategory(TranslatableModel, OrderedPublicationModel):
    code = models.SlugField(_("Code interne"), max_length=80, unique=True)
    translations = TranslatedFields(
        name=models.CharField(_("Nom"), max_length=120),
    )

    class Meta:
        verbose_name = _("Catégorie vidéo")
        verbose_name_plural = _("Catégories vidéo")

    def __str__(self):
        return self.safe_translation_getter("name", any_language=True) or self.code


class VideoItem(TranslatableModel, OrderedPublicationModel):
    category = models.ForeignKey(
        VideoCategory,
        verbose_name=_("Catégorie"),
        on_delete=models.PROTECT,
        related_name="videos",
    )
    youtube_url = models.URLField(_("URL YouTube"))
    youtube_id = models.CharField(_("ID YouTube"), max_length=32, blank=True, db_index=True)
    thumbnail = models.ImageField(_("Miniature personnalisée"), upload_to="videos/thumbnails/", blank=True)
    published_on_youtube_at = models.DateTimeField(
        _("Date de publication YouTube"),
        blank=True,
        null=True,
    )
    is_featured = models.BooleanField(_("Mis en avant"), default=False)
    translations = TranslatedFields(
        title=models.CharField(_("Titre"), max_length=180),
        description=models.TextField(_("Description"), blank=True),
    )

    class Meta:
        verbose_name = _("Vidéo")
        verbose_name_plural = _("Vidéos")
        ordering = ("sort_order", "-published_on_youtube_at", "-created_at")

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True) or self.youtube_id

    @property
    def watch_url(self):
        if self.youtube_id:
            return f"https://www.youtube.com/watch?v={self.youtube_id}"
        return self.youtube_url

    @property
    def embed_url(self):
        if self.youtube_id:
            return f"https://www.youtube.com/embed/{self.youtube_id}"
        return ""

    def save(self, *args, **kwargs):
        if self.youtube_url and not self.youtube_id:
            self.youtube_id = extract_youtube_id(self.youtube_url)
        super().save(*args, **kwargs)


class VideoComment(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", _("En attente")
        APPROVED = "approved", _("Approuvé")
        REJECTED = "rejected", _("Rejeté")

    video = models.ForeignKey(
        VideoItem,
        verbose_name=_("Vidéo"),
        on_delete=models.CASCADE,
        related_name="comments",
    )
    author_name = models.CharField(_("Nom"), max_length=120, blank=True)
    text = models.TextField(_("Commentaire"))
    status = models.CharField(_("Statut"), max_length=30, choices=Status.choices, default=Status.PENDING)

    class Meta:
        verbose_name = _("Commentaire vidéo")
        verbose_name_plural = _("Commentaires vidéo")
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.author_name or _('Anonyme')} - {self.video}"


class VideoLike(TimeStampedModel):
    video = models.ForeignKey(
        VideoItem,
        verbose_name=_("Vidéo"),
        on_delete=models.CASCADE,
        related_name="likes",
    )
    visitor_key = models.CharField(_("Clé visiteur"), max_length=120)

    class Meta:
        verbose_name = _("Like vidéo")
        verbose_name_plural = _("Likes vidéo")
        unique_together = ("video", "visitor_key")
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.video} - {self.visitor_key}"


def extract_youtube_id(url):
    parsed = urlparse(url)
    host = parsed.netloc.lower().removeprefix("www.")

    if host == "youtu.be":
        return parsed.path.strip("/").split("/")[0]

    if host.endswith("youtube.com"):
        if parsed.path == "/watch":
            return parse_qs(parsed.query).get("v", [""])[0]
        match = re.match(r"^/(embed|shorts)/(?P<id>[A-Za-z0-9_-]{6,})", parsed.path)
        if match:
            return match.group("id")

    return ""
