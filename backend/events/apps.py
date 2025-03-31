from django.apps import AppConfig


class EventsConfig(AppConfig):
    name = 'events'
    verbose_name = 'Events'
    
    def ready(self):
        """Import signals when app is ready"""
        try:
            import events.signals
        except ImportError:
            # Handle the case where signals might not exist yet
            pass 