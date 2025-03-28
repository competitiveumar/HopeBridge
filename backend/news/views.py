from django.shortcuts import get_object_or_404
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Article, Video, FeaturedStory
from .serializers import (
    CategorySerializer, 
    ArticleListSerializer, 
    ArticleDetailSerializer,
    VideoSerializer,
    FeaturedStorySerializer
)
from django.utils import timezone

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'status', 'featured']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'created_at', 'title']
    ordering = ['-published_at']
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Article.objects.all()
        if self.action == 'list':
            # For public API, only show published articles
            if not self.request.user.is_staff:
                queryset = queryset.filter(status='published', published_at__lte=timezone.now())
        
        # Filter by category name if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__name__icontains=category)
            
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ArticleDetailSerializer
        return ArticleListSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Return featured articles for homepage display"""
        queryset = self.get_queryset().filter(featured=True)[:5]
        serializer = ArticleListSerializer(queryset, many=True)
        return Response(serializer.data)

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'featured']
    search_fields = ['title', 'description']
    ordering_fields = ['published_at', 'created_at', 'title']
    ordering = ['-published_at']
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Return featured videos for homepage display"""
        queryset = self.get_queryset().filter(featured=True)[:3]
        serializer = VideoSerializer(queryset, many=True)
        return Response(serializer.data)

class FeaturedStoryViewSet(viewsets.ModelViewSet):
    queryset = FeaturedStory.objects.all()
    serializer_class = FeaturedStorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Return the currently active featured story"""
        featured_story = get_object_or_404(FeaturedStory, active=True)
        serializer = FeaturedStorySerializer(featured_story)
        return Response(serializer.data) 