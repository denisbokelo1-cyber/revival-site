from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from parler.admin import TranslatableAdmin

from .models import (
    Article,
    ArticleCategory,
    ContactMessage,
    FAQ,
    JobApplication,
    JobDepartment,
    JobOffer,
    NewsletterSubscriber,
    PartnerApplication,
    PartnershipType,
    Project,
    ProjectCategory,
    Review,
    VideoCategory,
    VideoComment,
    VideoItem,
    VideoLike,
)


admin.site.site_header = "Revival Administration"
admin.site.site_title = "Revival Admin"
admin.site.index_title = "Gestion du site Revival"


@admin.action(description=_("Activer les éléments sélectionnés"))
def activate_items(modeladmin, request, queryset):
    queryset.update(is_active=True)


@admin.action(description=_("Désactiver les éléments sélectionnés"))
def deactivate_items(modeladmin, request, queryset):
    queryset.update(is_active=False)


@admin.action(description=_("Mettre en avant les éléments sélectionnés"))
def feature_items(modeladmin, request, queryset):
    queryset.update(is_featured=True)


@admin.action(description=_("Retirer la mise en avant"))
def unfeature_items(modeladmin, request, queryset):
    queryset.update(is_featured=False)


@admin.action(description=_("Publier les articles sélectionnés"))
def publish_articles(modeladmin, request, queryset):
    queryset.update(status=Article.Status.PUBLISHED, published_at=timezone.now())


@admin.action(description=_("Archiver les articles sélectionnés"))
def archive_articles(modeladmin, request, queryset):
    queryset.update(status=Article.Status.ARCHIVED)


@admin.action(description=_("Approuver les commentaires sélectionnés"))
def approve_comments(modeladmin, request, queryset):
    queryset.update(status=VideoComment.Status.APPROVED)


@admin.action(description=_("Rejeter les commentaires sélectionnés"))
def reject_comments(modeladmin, request, queryset):
    queryset.update(status=VideoComment.Status.REJECTED)


class TranslationLabelMixin:
    @admin.display(description=_("Titre / Nom"))
    def translated_label(self, obj):
        obj_title = (
            getattr(obj, "title", None)
            or getattr(obj, "name", None)
            or getattr(obj, "question", None)
            or str(obj.pk)
        )
        return obj_title


class PublicationAdminMixin:
    list_editable = ("sort_order", "is_active")
    list_filter = ("is_active",)
    actions = (activate_items, deactivate_items)
    readonly_fields = ("created_at", "updated_at")


class FeaturedPublicationAdminMixin(PublicationAdminMixin):
    list_filter = ("is_active", "is_featured")
    actions = (activate_items, deactivate_items, feature_items, unfeature_items)


class VideoCommentInline(admin.TabularInline):
    model = VideoComment
    extra = 0
    fields = ("author_name", "text", "status", "created_at")
    readonly_fields = ("author_name", "text", "created_at")
    can_delete = False
    show_change_link = True

    def has_add_permission(self, request, obj=None):
        return False


class VideoLikeInline(admin.TabularInline):
    model = VideoLike
    extra = 0
    fields = ("visitor_key", "created_at")
    readonly_fields = ("visitor_key", "created_at")
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(
    TranslationLabelMixin, PublicationAdminMixin, TranslatableAdmin
):
    list_display = ("translated_label", "code", "sort_order", "is_active", "updated_at")
    search_fields = ("code", "translations__name")
    fields = ("code", "name", "sort_order", "is_active", "created_at", "updated_at")


@admin.register(Project)
class ProjectAdmin(
    TranslationLabelMixin, FeaturedPublicationAdminMixin, TranslatableAdmin
):
    list_display = (
        "translated_label",
        "category",
        "is_featured",
        "is_active",
        "sort_order",
        "published_at",
        "image_preview",
    )
    list_editable = ("is_featured", "is_active", "sort_order")
    list_filter = ("category", "is_featured", "is_active", "published_at")
    search_fields = (
        "slug",
        "translations__title",
        "translations__short_description",
        "technologies",
    )
    autocomplete_fields = ("category",)
    readonly_fields = ("image_preview", "created_at", "updated_at")
    fieldsets = (
        (
            _("Contenu traduit"),
            {"fields": ("title", "short_description", "description")},
        ),
        (
            _("Classement"),
            {"fields": ("category", "slug", "technologies", "sort_order")},
        ),
        (_("Médias et liens"), {"fields": ("image", "image_preview", "external_url")}),
        (_("Publication"), {"fields": ("is_featured", "is_active", "published_at")}),
        (
            _("SEO"),
            {"fields": ("seo_title", "seo_description"), "classes": ("collapse",)},
        ),
        (
            _("Suivi"),
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    @admin.display(description=_("Image"))
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:42px;border-radius:6px;" />', obj.image.url
            )
        return "-"


@admin.register(FAQ)
class FAQAdmin(TranslationLabelMixin, PublicationAdminMixin, TranslatableAdmin):
    list_display = ("translated_label", "page", "sort_order", "is_active", "updated_at")
    list_filter = ("page", "is_active")
    search_fields = ("translations__question", "translations__answer")
    fields = (
        "page",
        "question",
        "answer",
        "sort_order",
        "is_active",
        "created_at",
        "updated_at",
    )


@admin.register(Review)
class ReviewAdmin(FeaturedPublicationAdminMixin, TranslatableAdmin):
    list_display = (
        "client_name",
        "company",
        "project",
        "rating",
        "is_featured",
        "is_active",
        "sort_order",
    )
    list_editable = ("rating", "is_featured", "is_active", "sort_order")
    list_filter = ("rating", "is_featured", "is_active")
    search_fields = (
        "client_name",
        "company",
        "translations__client_role",
        "translations__content",
    )
    autocomplete_fields = ("project",)
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (_("Client"), {"fields": ("client_name", "company", "client_role", "avatar")}),
        (_("Avis"), {"fields": ("project", "rating", "content")}),
        (_("Publication"), {"fields": ("is_featured", "is_active", "sort_order")}),
        (
            _("Suivi"),
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


@admin.register(ArticleCategory)
class ArticleCategoryAdmin(
    TranslationLabelMixin, PublicationAdminMixin, TranslatableAdmin
):
    list_display = ("translated_label", "slug", "sort_order", "is_active", "updated_at")
    search_fields = ("slug", "translations__name")
    fields = ("slug", "name", "sort_order", "is_active", "created_at", "updated_at")


@admin.register(Article)
class ArticleAdmin(TranslationLabelMixin, TranslatableAdmin):
    list_display = (
        "translated_label",
        "category",
        "status",
        "is_featured",
        "published_at",
        "updated_at",
    )
    list_filter = ("status", "is_featured", "category", "published_at")
    list_editable = ("status", "is_featured")
    search_fields = (
        "slug",
        "author_name",
        "translations__title",
        "translations__excerpt",
    )
    autocomplete_fields = ("category",)
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "published_at"
    actions = (publish_articles, archive_articles)
    fieldsets = (
        (_("Contenu traduit"), {"fields": ("title", "excerpt", "content")}),
        (
            _("Classement"),
            {"fields": ("category", "slug", "author_name", "reading_time")},
        ),
        (_("Média"), {"fields": ("cover_image",)}),
        (_("Publication"), {"fields": ("status", "is_featured", "published_at")}),
        (
            _("SEO"),
            {"fields": ("seo_title", "seo_description"), "classes": ("collapse",)},
        ),
        (
            _("Suivi"),
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


@admin.register(JobDepartment)
class JobDepartmentAdmin(
    TranslationLabelMixin, PublicationAdminMixin, TranslatableAdmin
):
    list_display = ("translated_label", "code", "sort_order", "is_active", "updated_at")
    search_fields = ("code", "translations__name")
    fields = ("code", "name", "sort_order", "is_active", "created_at", "updated_at")


@admin.register(JobOffer)
class JobOfferAdmin(TranslationLabelMixin, PublicationAdminMixin, TranslatableAdmin):
    list_display = (
        "translated_label",
        "department",
        "contract_type",
        "deadline",
        "is_active",
        "sort_order",
        "published_at",
    )
    list_filter = ("department", "contract_type", "is_active", "deadline")
    search_fields = (
        "translations__title",
        "translations__location",
        "translations__description",
    )
    autocomplete_fields = ("department",)
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "published_at"
    fieldsets = (
        (
            _("Contenu traduit"),
            {"fields": ("title", "location", "description", "requirements")},
        ),
        (
            _("Contrat"),
            {"fields": ("department", "contract_type", "salary_range", "deadline")},
        ),
        (_("Publication"), {"fields": ("is_active", "sort_order", "published_at")}),
        (
            _("Suivi"),
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "job", "status", "created_at")
    list_filter = ("status", "created_at", "job")
    search_fields = ("full_name", "email", "message", "job__translations__title")
    autocomplete_fields = ("job",)
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"
    fieldsets = (
        (
            _("Candidat"),
            {"fields": ("full_name", "email", "salary_expectation", "availability")},
        ),
        (_("Offre et message"), {"fields": ("job", "message", "status")}),
        (_("Fichiers"), {"fields": ("cv", "cover_letter")}),
        (
            _("Suivi"),
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


@admin.register(PartnershipType)
class PartnershipTypeAdmin(
    TranslationLabelMixin, PublicationAdminMixin, TranslatableAdmin
):
    list_display = ("translated_label", "code", "sort_order", "is_active", "updated_at")
    search_fields = ("code", "translations__name", "translations__description")
    fields = (
        "code",
        "name",
        "description",
        "sort_order",
        "is_active",
        "created_at",
        "updated_at",
    )


@admin.register(PartnerApplication)
class PartnerApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "company_name",
        "manager_name",
        "email",
        "partnership_type",
        "status",
        "created_at",
    )
    list_filter = ("status", "partnership_type", "created_at")
    search_fields = (
        "company_name",
        "manager_name",
        "email",
        "phone",
        "country",
        "objective",
    )
    autocomplete_fields = ("partnership_type",)
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"
    fieldsets = (
        (
            _("Entreprise"),
            {
                "fields": (
                    "company_name",
                    "manager_name",
                    "email",
                    "phone",
                    "country",
                    "website",
                )
            },
        ),
        (_("Partenariat"), {"fields": ("partnership_type", "objective", "status")}),
        (
            _("Suivi"),
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "company", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = (
        "first_name",
        "last_name",
        "email",
        "company",
        "subject",
        "message",
    )
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"
    fieldsets = (
        (_("Contact"), {"fields": ("first_name", "last_name", "email", "company")}),
        (_("Message"), {"fields": ("subject", "message", "status")}),
        (
            _("Suivi"),
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    @admin.display(description=_("Nom"))
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "source", "is_active", "created_at")
    list_filter = ("is_active", "source", "created_at")
    list_editable = ("is_active",)
    search_fields = ("email", "source")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"


@admin.register(VideoCategory)
class VideoCategoryAdmin(
    TranslationLabelMixin, PublicationAdminMixin, TranslatableAdmin
):
    list_display = ("translated_label", "code", "sort_order", "is_active", "updated_at")
    search_fields = ("code", "translations__name")
    fields = ("code", "name", "sort_order", "is_active", "created_at", "updated_at")


@admin.register(VideoItem)
class VideoItemAdmin(
    TranslationLabelMixin, FeaturedPublicationAdminMixin, TranslatableAdmin
):
    list_display = (
        "translated_label",
        "category",
        "youtube_id",
        "is_featured",
        "is_active",
        "sort_order",
        "published_on_youtube_at",
    )
    list_editable = ("is_featured", "is_active", "sort_order")
    list_filter = ("category", "is_featured", "is_active", "published_on_youtube_at")
    search_fields = (
        "youtube_id",
        "youtube_url",
        "translations__title",
        "translations__description",
    )
    autocomplete_fields = ("category",)
    readonly_fields = ("youtube_id", "youtube_embed_link", "created_at", "updated_at")
    date_hierarchy = "published_on_youtube_at"
    inlines = (VideoCommentInline, VideoLikeInline)
    fieldsets = (
        (_("Contenu traduit"), {"fields": ("title", "description")}),
        (
            _("YouTube"),
            {
                "fields": (
                    "youtube_url",
                    "youtube_id",
                    "youtube_embed_link",
                    "published_on_youtube_at",
                )
            },
        ),
        (
            _("Classement"),
            {
                "fields": (
                    "category",
                    "thumbnail",
                    "is_featured",
                    "is_active",
                    "sort_order",
                )
            },
        ),
        (
            _("Suivi"),
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    @admin.display(description=_("Lecture"))
    def youtube_embed_link(self, obj):
        if obj.watch_url:
            return format_html(
                '<a href="{}" target="_blank" rel="noopener">{}</a>',
                obj.watch_url,
                _("Ouvrir sur YouTube"),
            )
        return "-"


@admin.register(VideoComment)
class VideoCommentAdmin(admin.ModelAdmin):
    list_display = ("video", "author_name", "status", "created_at")
    list_filter = ("status", "created_at", "video")
    search_fields = ("author_name", "text", "video__translations__title")
    autocomplete_fields = ("video",)
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"
    actions = (approve_comments, reject_comments)


@admin.register(VideoLike)
class VideoLikeAdmin(admin.ModelAdmin):
    list_display = ("video", "visitor_key", "created_at")
    list_filter = ("created_at", "video")
    search_fields = ("visitor_key", "video__translations__title")
    autocomplete_fields = ("video",)
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"
