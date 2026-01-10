import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './Blog.css';

function Blog() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState('All');
  const postsPerPage = 6;

  const tags = ['All', 'Interior Design', 'Furniture Tips', 'Trends', 'Lifestyle', 'DIY'];

  const blogPosts = [
    {
      id: 1,
      title: "How to Choose the Perfect Sofa for Your Living Room",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
      author: "Sarah Johnson",
      date: "May 06 2025",
      tag: "Interior Design"
    },
    {
      id: 2,
      title: "Top 10 Must-Have Furniture Pieces for a Modern Home",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
      author: "Michael Chen",
      date: "May 06 2025",
      tag: "Furniture Tips"
    },
    
    {
      id: 3,
      title: "Creating a Cozy Reading Nook in Your Home",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&q=80",
      author: "David Martinez",
      date: "February 02 2025",
      tag: "Interior Design"
    },
    {
      id: 4,
      title: "Minimalist Furniture Design Trends for 2025",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=80",
      author: "Lisa Anderson",
      date: "January 28 2025",
      tag: "Trends"
    },
    {
      id: 5,
      title: "How to Mix and Match Furniture Styles Like a Pro",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80",
      author: "Tom Roberts",
      date: "January 25 2025",
      tag: "Interior Design"
    },
    {
      id: 6,
      title: "Sustainable Furniture: Eco-Friendly Choices for Your Home",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=80",
      author: "Rachel Green",
      date: "January 20 2025",
      tag: "Lifestyle"
    },
    {
      id: 7,
      title: "Small Space Solutions: Furniture for Compact Living",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      image: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200&q=80",
      author: "James Wilson",
      date: "January 15 2025",
      tag: "Furniture Tips"
    },
    {
      id: 8,
      title: "DIY Furniture Makeover Ideas on a Budget",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
      author: "Sophia Lee",
      date: "January 10 2025",
      tag: "DIY"
    },
    {
      id: 9,
      title: "The Ultimate Guide to Bedroom Furniture Layout",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
      author: "Alex Turner",
      date: "January 05 2025",
      tag: "Interior Design"
    },
    {
      id: 10,
      title: "Outdoor Furniture: Choosing Pieces That Last",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
      author: "Nina Patel",
      date: "December 30 2024",
      tag: "Lifestyle"
    },
    {
      id: 11,
      title: "Color Psychology in Furniture Selection",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      author: "Chris Martin",
      date: "December 25 2024",
      tag: "Trends"
    }
  ];

  const recentPosts = blogPosts.slice(0, 3);

  const filteredPosts = selectedTag === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.tag === selectedTag);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  return (
    <div className="blog-page">
      <div className="blog-container">
        <div className="blog-layout">
          {/* Sidebar */}
          <aside className="blog-sidebar">
            <div className="sidebar-section">
              <h3>About Author</h3>
              <div className="author-card">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" alt="Author" />
                <p>Etiam vel magna sed leo feugiat cursus. Cras mollis blandit dolor. Praesent vulputate justo quis volutpat pharetra. Suspendisse</p>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Recent Post</h3>
              <div className="recent-posts">
                {recentPosts.map(post => (
                  <div 
                    key={post.id} 
                    className="recent-post-item"
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <img src={post.image} alt={post.title} />
                    <div className="recent-post-info">
                      <span className="recent-date">{post.date}</span>
                      <h4>{post.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Tags</h3>
              <div className="tags-list">
                {tags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
                    onClick={() => handleTagChange(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="blog-main">
            {currentPosts.map(post => (
              <article key={post.id} className="blog-post">
                <div className="post-image">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="post-content">
                  <span className="post-date">{post.date}</span>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <button 
                    className="read-more-btn"
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    READ MORE
                  </button>
                </div>
              </article>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Blog;
