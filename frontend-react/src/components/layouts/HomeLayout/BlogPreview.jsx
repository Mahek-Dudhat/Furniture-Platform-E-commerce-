import './BlogPreview.css'

function BlogPreview() {
  const blogs = [
    {
      id: 1,
      title: "How to Style Your Living Room",
      excerpt: "Transform your living space with these expert tips on furniture arrangement, color schemes, and decor choices.",
      image: "https://qx-plank.myshopify.com/cdn/shop/articles/blog-2_d52220e2-47ff-477d-8e25-e6b8daf09062_540x.jpg?v=1747553764",
      date: "March 15, 2025"
    },
    {
      id: 2,
      title: "2025 Furniture Trends",
      excerpt: "Discover the hottest furniture trends of 2025, from sustainable materials to bold colors and minimalist designs.",
      image: "https://qx-plank.myshopify.com/cdn/shop/articles/blog-6_52b3e6b4-1c19-4cce-b306-3bed7887f15a_540x.jpg?v=1747553781",
      date: "March 10, 2025"
    },
    {
      id: 3,
      title: "Choosing the Perfect Sofa",
      excerpt: "A comprehensive guide to selecting the ideal sofa for your home, considering comfort, style, and durability.",
      image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
      date: "March 5, 2025"
    }
  ]

  return (
    <section className="blog-preview">
      <div className="blog-container">
        <h2>Latest from Our Blog</h2>
        <p className="blog-subtitle">Tips, trends, and inspiration for your home</p>

        <div className="row g-5">
          {blogs.map(blog => (
            <div  key={blog.id} className="p-5 p-sm-3 col-12 col-sm-6 col-md-6 col-lg-4">
              <div className="blog-card ">
                <div className="blog-image">
                  <img src={blog.image} alt={blog.title} />
                </div>
                <div className="blog-content">
                  <span className="blog-date">{blog.date}</span>
                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>
                  <button className="read-more">Read More →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogPreview
