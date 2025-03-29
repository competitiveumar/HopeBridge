from django.contrib import admin
from .models import Category, Article, Video, FeaturedStory

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'status', 'featured', 'published_at', 'created_at')
    list_filter = ('status', 'featured', 'category', 'created_at', 'published_at')
    search_fields = ('title', 'excerpt', 'content')
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ('author',)
    date_hierarchy = 'published_at'
    ordering = ('-published_at', '-created_at')
    filter_horizontal = ()
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'category', 'author', 'status', 'featured')
        }),
        ('Content', {
            'fields': ('excerpt', 'content', 'image')
        }),
        ('Date Information', {
            'fields': ('published_at', 'created_at', 'updated_at')
        }),
    )

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'youtube_id', 'featured', 'published_at', 'created_at')
    list_filter = ('featured', 'category', 'created_at', 'published_at')
    search_fields = ('title', 'description', 'youtube_id')
    raw_id_fields = ()
    date_hierarchy = 'published_at'
    ordering = ('-published_at', '-created_at')
    readonly_fields = ('created_at', 'thumbnail_url')
    fieldsets = (
        (None, {
            'fields': ('title', 'category', 'featured')
        }),
        ('Video Information', {
            'fields': ('description', 'youtube_id', 'thumbnail', 'thumbnail_url')
        }),
        ('Date Information', {
            'fields': ('published_at', 'created_at')
        }),
    )

@admin.register(FeaturedStory)
class FeaturedStoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'active', 'created_at')
    list_filter = ('active', 'created_at')
    search_fields = ('title', 'excerpt', 'content')
    raw_id_fields = ('article',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('title', 'category', 'active', 'article')
        }),
        ('Content', {
            'fields': ('excerpt', 'content', 'image')
        }),
        ('Date Information', {
            'fields': ('created_at', 'updated_at')
        }),
    ) 