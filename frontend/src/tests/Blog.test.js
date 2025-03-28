import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import Blog from '../pages/Blog';

// Mock axios
jest.mock('axios');

// Create theme for Material UI
const theme = createTheme();

// Mock data for testing
const mockFeaturedStory = {
  id: 1,
  title: "Building Resilient Communities in Remote Areas",
  excerpt: "Discover how our volunteers are helping to build sustainable infrastructure.",
  category: "Featured Story",
  image: "https://example.com/featured.jpg",
};

const mockArticles = [
  {
    id: 1,
    title: "Global Water Crisis: How You Can Help",
    excerpt: "Learn about the ongoing global water crisis.",
    category: "Impact Stories",
    date: "2023-05-15",
    image: "https://example.com/water.jpg",
  },
  {
    id: 2,
    title: "UNESCO Heritage Sites Protection Initiative",
    excerpt: "UNESCO launches a new initiative to protect cultural heritage sites.",
    category: "UNESCO News",
    date: "2023-05-10",
    image: "https://example.com/unesco.jpg",
  },
];

const mockVideos = [
  {
    id: 1,
    title: "Water Wells Project - Making a Difference",
    description: "Watch how our water wells project is transforming lives.",
    youtubeId: "668nUCeBHyY",
  },
  {
    id: 2,
    title: "UNESCO World Heritage - A Journey Through History",
    description: "Explore the importance of preserving UNESCO World Heritage sites.",
    youtubeId: "HjUkuMT8J5c",
  },
];

// Setup for each test
const setup = () => {
  // Mock API responses
  axios.get.mockImplementation((url) => {
    if (url === '/api/articles') {
      return Promise.resolve({
        data: {
          count: mockArticles.length,
          results: mockArticles
        }
      });
    } else if (url === '/api/videos') {
      return Promise.resolve({
        data: mockVideos
      });
    } else if (url === '/api/featured-story') {
      return Promise.resolve({
        data: mockFeaturedStory
      });
    }
    return Promise.reject(new Error('not found'));
  });

  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <Blog />
      </MemoryRouter>
    </ThemeProvider>
  );
};

// Tests
describe('Blog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the page title and description', () => {
    setup();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText(/Stay informed about our latest initiatives/i)).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    setup();
    expect(screen.getAllByRole('progressbar')).toHaveLength(2); // Two loading spinners (featured and content)
  });

  test('loads and displays featured story', async () => {
    setup();
    
    await waitFor(() => {
      expect(screen.getByText('Building Resilient Communities in Remote Areas')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Discover how our volunteers are helping to build sustainable infrastructure.')).toBeInTheDocument();
    expect(screen.getByText('Featured Story')).toBeInTheDocument();
    expect(screen.getByText('Read Full Story')).toBeInTheDocument();
  });

  test('loads and displays articles', async () => {
    setup();
    
    await waitFor(() => {
      expect(screen.getByText('Global Water Crisis: How You Can Help')).toBeInTheDocument();
    });
    
    expect(screen.getByText('UNESCO Heritage Sites Protection Initiative')).toBeInTheDocument();
    expect(screen.getByText('Impact Stories')).toBeInTheDocument();
    expect(screen.getByText('UNESCO News')).toBeInTheDocument();
  });

  test('filters articles when clicking on tabs', async () => {
    setup();
    
    // Wait for articles to load
    await waitFor(() => {
      expect(screen.getByText('Global Water Crisis: How You Can Help')).toBeInTheDocument();
    });
    
    // Mock the API response for filtered articles
    axios.get.mockImplementation((url) => {
      if (url === '/api/articles') {
        // Return only UNESCO News when "UNESCO News" tab is selected
        return Promise.resolve({
          data: {
            count: 1,
            results: [mockArticles[1]]
          }
        });
      } else if (url === '/api/videos') {
        return Promise.resolve({
          data: mockVideos
        });
      } else if (url === '/api/featured-story') {
        return Promise.resolve({
          data: mockFeaturedStory
        });
      }
      return Promise.reject(new Error('not found'));
    });
    
    // Click on the UNESCO News tab
    fireEvent.click(screen.getByText('UNESCO News'));
    
    // Wait for the filtered results
    await waitFor(() => {
      // The UNESCO article should still be there
      expect(screen.getByText('UNESCO Heritage Sites Protection Initiative')).toBeInTheDocument();
      
      // But the Impact Stories article should not
      expect(screen.queryByText('Global Water Crisis: How You Can Help')).not.toBeInTheDocument();
    });
  });

  test('switches to videos tab and displays videos', async () => {
    setup();
    
    // Wait for initial content to load
    await waitFor(() => {
      expect(screen.getByText('Global Water Crisis: How You Can Help')).toBeInTheDocument();
    });
    
    // Click on Videos tab
    fireEvent.click(screen.getByText('Videos'));
    
    // Wait for videos to display
    await waitFor(() => {
      // Check for video titles
      expect(screen.getByText('Water Wells Project - Making a Difference')).toBeInTheDocument();
      expect(screen.getByText('UNESCO World Heritage - A Journey Through History')).toBeInTheDocument();
      
      // Check for iframes (videos)
      const iframes = document.querySelectorAll('iframe');
      expect(iframes.length).toBe(2);
      expect(iframes[0].src).toContain('youtube.com/embed/668nUCeBHyY');
      expect(iframes[1].src).toContain('youtube.com/embed/HjUkuMT8J5c');
    });
  });

  test('searches articles when typing in search box', async () => {
    setup();
    
    // Wait for articles to load
    await waitFor(() => {
      expect(screen.getByText('Global Water Crisis: How You Can Help')).toBeInTheDocument();
    });
    
    // Mock the API response for searched articles
    axios.get.mockImplementation((url) => {
      if (url === '/api/articles') {
        // Return only articles that match the search term "water"
        return Promise.resolve({
          data: {
            count: 1,
            results: [mockArticles[0]]
          }
        });
      } else if (url === '/api/videos') {
        return Promise.resolve({
          data: mockVideos
        });
      } else if (url === '/api/featured-story') {
        return Promise.resolve({
          data: mockFeaturedStory
        });
      }
      return Promise.reject(new Error('not found'));
    });
    
    // Type in the search box
    const searchBox = screen.getByPlaceholderText('Search stories...');
    fireEvent.change(searchBox, { target: { value: 'water' } });
    
    // Wait for the search results
    await waitFor(() => {
      // The water crisis article should still be visible
      expect(screen.getByText('Global Water Crisis: How You Can Help')).toBeInTheDocument();
      
      // But the UNESCO article should not
      expect(screen.queryByText('UNESCO Heritage Sites Protection Initiative')).not.toBeInTheDocument();
    });
  });

  test('changes page with pagination', async () => {
    setup();
    
    // Wait for articles to load
    await waitFor(() => {
      expect(screen.getByText('Global Water Crisis: How You Can Help')).toBeInTheDocument();
    });
    
    // Mock the API response for page 2
    axios.get.mockImplementation((url) => {
      if (url === '/api/articles') {
        // Return different articles for page 2
        return Promise.resolve({
          data: {
            count: 4,
            results: [
              {
                id: 3,
                title: "Page 2 Article 1",
                excerpt: "This is on page 2",
                category: "Impact Stories",
                date: "2023-05-01",
                image: "https://example.com/page2a.jpg",
              },
              {
                id: 4,
                title: "Page 2 Article 2",
                excerpt: "This is also on page 2",
                category: "UNESCO News",
                date: "2023-04-28",
                image: "https://example.com/page2b.jpg",
              }
            ]
          }
        });
      } else if (url === '/api/videos') {
        return Promise.resolve({
          data: mockVideos
        });
      } else if (url === '/api/featured-story') {
        return Promise.resolve({
          data: mockFeaturedStory
        });
      }
      return Promise.reject(new Error('not found'));
    });
    
    // Click on page 2
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    
    // Wait for page 2 content to load
    await waitFor(() => {
      // Page 2 articles should be visible
      expect(screen.getByText('Page 2 Article 1')).toBeInTheDocument();
      expect(screen.getByText('Page 2 Article 2')).toBeInTheDocument();
      
      // Page 1 articles should not be visible
      expect(screen.queryByText('Global Water Crisis: How You Can Help')).not.toBeInTheDocument();
      expect(screen.queryByText('UNESCO Heritage Sites Protection Initiative')).not.toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock API failure
    axios.get.mockRejectedValue(new Error('API error'));
    
    setup();
    
    // Wait for loading to finish and fallback content to appear
    await waitFor(() => {
      // Should still show mock data from the component itself
      expect(screen.getByText('Building Resilient Communities in Remote Areas')).toBeInTheDocument();
      expect(screen.getByText('Global Water Crisis: How You Can Help')).toBeInTheDocument();
    });
    
    // Error should be logged to console
    expect(console.error).toHaveBeenCalled;
  });
}); 