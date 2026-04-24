from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class WebsiteConfig(AppConfig):
    name = 'website'
    verbose_name = _("Interface Web")
