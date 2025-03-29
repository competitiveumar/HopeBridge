from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Category, Article, Video, FeaturedStory
import tempfile
from PIL import Image
import io

User = get_user_model()

def get_temporary_image():
    """Create a temporary image for testing"""
    image = Image.new('RGB', (100, 100), color='red')
    image_file = io.BytesIO()
    image.save(image_file, 'jpeg')
    image_file.name = 'test.jpg'
    image_file.seek(0)
    return image_file

class CategoryModelTests(TestCase):
    def test_category_creation(self):
        category = Category.objects.create(name="Test Category")
        self.assertEqual(category.slug, "test-category")
        self.assertEqual(str(category), "Test Category")

class ArticleModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.category = Category.objects.create(name="Test Category")
        
    def test_article_creation(self):
        article = Article.objects.create(
            title="Test Article",
            category=self.category,
            author=self.user,
            excerpt="This is a test excerpt",
            content="This is test content",
            status="published",
            published_at=timezone.now()
        )
        self.assertEqual(article.slug, "test-article")
        self.assertEqual(str(article), "Test Article")
        self.assertEqual(article.author, self.user)
        self.assertEqual(article.category, self.category)

class VideoModelTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Test Category")
        
    def test_video_creation(self):
        video = Video.objects.create(
            title="Test Video",
            description="This is a test video",
            youtube_id="dQw4w9WgXcQ",
            category=self.category,
            published_at=timezone.now()
        )
        self.assertEqual(str(video), "Test Video")
        self.assertEqual(video.thumbnail_url, "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg")

class FeaturedStoryModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.category = Category.objects.create(name="Test Category")
        self.article = Article.objects.create(
            title="Test Article",
            category=self.category,
            author=self.user,
            excerpt="This is a test excerpt",
            content="This is test content",
            status="published",
            published_at=timezone.now()
        )
        
    def test_featured_story_creation(self):
        featured_story = FeaturedStory.objects.create(
            title="Featured Test Story",
            excerpt="This is a featured test excerpt",
            content="This is featured test content",
            article=self.article,
            active=True
        )
        self.assertEqual(str(featured_story), "Featured Test Story")
        self.assertTrue(featured_story.active)
        
    def test_only_one_active_featured_story(self):
        featured_story1 = FeaturedStory.objects.create(
            title="Featured Test Story 1",
            excerpt="This is a featured test excerpt 1",
            content="This is featured test content 1",
            active=True
        )
        featured_story2 = FeaturedStory.objects.create(
            title="Featured Test Story 2",
            excerpt="This is a featured test excerpt 2",
            content="This is featured test content 2",
            active=True
        )
        
        # Refresh from database
        featured_story1.refresh_from_db()
        
        # The first one should now be inactive
        self.assertFalse(featured_story1.active)
        self.assertTrue(featured_story2.active)

class NewsAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.staff_user = User.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='staffpass123',
            is_staff=True
        )
        self.category = Category.objects.create(name="Test Category")
        
        # Create test articles
        self.published_article = Article.objects.create(
            title="Published Article",
            category=self.category,
            author=self.user,
            excerpt="This is a published article",
            content="This is published content",
            status="published",
            published_at=timezone.now()
        )
        
        self.draft_article = Article.objects.create(
            title="Draft Article",
            category=self.category,
            author=self.user,
            excerpt="This is a draft article",
            content="This is draft content",
            status="draft"
        )
        
        # Create test video
        self.video = Video.objects.create(
            title="Test Video",
            description="This is a test video",
            youtube_id="dQw4w9WgXcQ",
            category=self.category,
            published_at=timezone.now()
        )
        
        # Create featured story
        self.featured_story = FeaturedStory.objects.create(
            title="Featured Test Story",
            excerpt="This is a featured test excerpt",
            content="This is featured test content",
            article=self.published_article,
            active=True
        )
        
        # URLs
        self.articles_url = reverse('news:article-list')
        self.videos_url = reverse('news:video-list')
        self.featured_story_url = reverse('news:active-featured-story')
    
    def test_get_articles_list(self):
        """Test retrieving a list of articles"""
        response = self.client.get(self.articles_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Only published articles should be visible to anonymous users
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Published Article")
    
    def test_staff_can_see_draft_articles(self):
        """Test that staff users can see draft articles"""
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(self.articles_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Staff should see both published and draft articles
        self.assertEqual(len(response.data['results']), 2)
    
    def test_get_article_detail(self):
        """Test retrieving a single article"""
        url = reverse('news:article-detail', args=[self.published_article.slug])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Published Article")
    
    def test_filter_articles_by_category(self):
        """Test filtering articles by category"""
        response = self.client.get(f"{self.articles_url}?category=test")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_search_articles(self):
        """Test searching articles by title/content"""
        response = self.client.get(f"{self.articles_url}?search=published")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Published Article")
    
    def test_get_videos(self):
        """Test retrieving videos"""
        response = self.client.get(self.videos_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Test Video")
    
    def test_get_active_featured_story(self):
        """Test retrieving the active featured story"""
        response = self.client.get(self.featured_story_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Featured Test Story")
    
    def test_create_article_unauthorized(self):
        """Test creating an article without authentication fails"""
        data = {
            'title': 'New Article',
            'category': self.category.id,
            'excerpt': 'New excerpt',
            'content': 'New content',
            'status': 'published'
        }
        response = self.client.post(self.articles_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_article_authorized(self):
        """Test creating an article with authentication succeeds"""
        self.client.force_authenticate(user=self.user)
        
        # Create a temporary image file
        image_file = get_temporary_image()
        
        data = {
            'title': 'New Article',
            'category': self.category.id,
            'excerpt': 'New excerpt',
            'content': 'New content',
            'status': 'published',
            'image': image_file
        }
        response = self.client.post(self.articles_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Article.objects.count(), 3)
        self.assertEqual(Article.objects.get(title='New Article').author, self.user) 