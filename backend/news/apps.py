from django.apps import AppConfig


class NewsConfig(AppConfig):
    name = 'news'
    verbose_name = 'News'
    
    def ready(self):
        """Import signals when app is ready"""
        try:
            import news.signals
        except ImportError:
            # Handle the case where signals might not exist yet
            pass 