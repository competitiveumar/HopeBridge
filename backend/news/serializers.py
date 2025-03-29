from rest_framework import serializers
from .models import Category, Article, Video, FeaturedStory
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class ArticleListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'image', 
            'category', 'category_name', 'author', 'author_name',
            'featured', 'published_at', 'created_at'
        ]
    
    def get_author_name(self, obj):
        if obj.author.first_name and obj.author.last_name:
            return f"{obj.author.first_name} {obj.author.last_name}"
        return obj.author.username

class ArticleDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'image',
            'category', 'author', 'featured', 'status',
            'published_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class VideoSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Video
        fields = [
            'id', 'title', 'description', 'youtube_id', 
            'thumbnail_url', 'category', 'category_name',
            'featured', 'published_at', 'created_at'
        ]

class FeaturedStorySerializer(serializers.ModelSerializer):
    article_slug = serializers.SlugField(source='article.slug', read_only=True)
    
    class Meta:
        model = FeaturedStory
        fields = [
            'id', 'title', 'excerpt', 'content', 'image',
            'category', 'article', 'article_slug', 'active',
            'created_at', 'updated_at'
        ] 