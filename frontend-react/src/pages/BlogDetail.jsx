import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import './BlogDetail.css';

function BlogDetail() {
  const { blogId } = useParams();
  const navigate = useNavigate();

  const blogPosts = [
    {
      id: 1,
      title: "How to Choose the Perfect Sofa for Your Living Room",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      content: "Choosing the perfect sofa is one of the most important decisions you'll make for your living room. A sofa is not just a piece of furniture; it's the centerpiece of your space where you'll spend countless hours relaxing, entertaining, and making memories.\n\nFirst, consider the size of your room. Measure your space carefully and ensure there's enough room for people to walk around comfortably. A sofa that's too large can make your room feel cramped, while one that's too small can look out of place.\n\nNext, think about your lifestyle. Do you have kids or pets? If so, you'll want a durable, easy-to-clean fabric. Leather and microfiber are excellent choices for busy households. If you entertain frequently, consider a sectional or a sofa with a pull-out bed.\n\nComfort is paramount. Test the sofa in person if possible. Sit on it for at least 10 minutes to ensure it provides adequate support. Pay attention to the seat depth, cushion firmness, and back support.\n\nStyle matters too. Your sofa should complement your existing decor. Classic styles like Chesterfield or mid-century modern never go out of fashion, while contemporary designs can make a bold statement.\n\nFinally, consider your budget. A quality sofa is an investment that should last 7-15 years. Don't compromise on quality for price, but also look for sales and financing options to make your purchase more affordable.",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
      author: "Sarah Johnson",
      date: "May 06 2025",
      tag: "Interior Design"
    },
    {
      id: 2,
      title: "Top 10 Must-Have Furniture Pieces for a Modern Home",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      content: "Creating a modern home requires careful selection of furniture pieces that combine functionality with aesthetic appeal. Here are the top 10 must-have pieces that will transform your space.\n\n1. Statement Sofa: The foundation of your living room should be a comfortable, stylish sofa that reflects your personality.\n\n2. Coffee Table: Choose a piece that's both functional and beautiful. Glass, wood, or marble tops work well in modern spaces.\n\n3. Dining Table: A sleek dining table with clean lines is essential for both everyday meals and entertaining guests.\n\n4. Comfortable Bed Frame: Your bedroom deserves a quality bed frame that provides support and style.\n\n5. Storage Solutions: Modern homes need smart storage. Consider floating shelves, minimalist cabinets, or multi-functional pieces.\n\n6. Accent Chairs: Add personality with unique accent chairs that provide extra seating and visual interest.\n\n7. Desk: With remote work becoming common, a functional workspace is essential.\n\n8. Nightstands: Practical and stylish bedside tables complete your bedroom setup.\n\n9. Media Console: A sleek TV stand or media console keeps your entertainment area organized.\n\n10. Outdoor Furniture: Don't forget your outdoor spaces. Quality patio furniture extends your living area.\n\nRemember, quality over quantity is key in modern design. Each piece should serve a purpose and contribute to the overall aesthetic of your home.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
      author: "Michael Chen",
      date: "May 06 2025",
      tag: "Furniture Tips"
    },
    {
      id: 3,
      title: "Creating a Cozy Reading Nook in Your Home",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      content: "A reading nook is a personal sanctuary where you can escape into the pages of a good book. Creating the perfect reading space doesn't require a lot of room – just thoughtful planning and the right elements.\n\nStart by finding the perfect spot. Look for a quiet corner with natural light, preferably near a window. Natural light is easier on the eyes and creates a pleasant atmosphere for reading.\n\nSeating is crucial. A comfortable armchair or a window seat with plush cushions is ideal. Make sure the seat has good back support and is deep enough to curl up in. Add throw pillows for extra comfort.\n\nLighting is essential for reading. While natural light is wonderful during the day, you'll need good artificial lighting for evening reading. A floor lamp or a wall-mounted reading light with adjustable brightness is perfect.\n\nCreate ambiance with textiles. A soft throw blanket, a cozy rug, and curtains that can filter light add warmth and comfort to your nook.\n\nStorage for books is a must. A small bookshelf or floating shelves within arm's reach keep your current reads accessible.\n\nPersonalize your space with items that bring you joy – a small plant, artwork, or a scented candle can make your reading nook feel special.\n\nFinally, minimize distractions. Keep technology out of your reading nook to create a true escape from the digital world.",
      image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&q=80",
      author: "David Martinez",
      date: "February 02 2025",
      tag: "Interior Design"
    },
    {
      id: 4,
      title: "Minimalist Furniture Design Trends for 2025",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      content: "Minimalism continues to dominate furniture design in 2025, but with exciting new twists that make spaces feel warm and inviting rather than stark and cold.\n\nClean lines remain fundamental, but designers are incorporating subtle curves and organic shapes to soften the aesthetic. Think rounded edges on tables and chairs that maintain simplicity while adding visual interest.\n\nNatural materials are taking center stage. Wood, stone, and natural fibers are being used in their most authentic forms, celebrating imperfections and unique grain patterns. This brings warmth to minimalist spaces.\n\nMulti-functional furniture is more important than ever. Pieces that serve multiple purposes without sacrificing style are in high demand. Coffee tables with hidden storage, beds with built-in drawers, and expandable dining tables are perfect examples.\n\nNeutral color palettes dominate, but 2025 sees the introduction of warm earth tones. Terracotta, sage green, and warm beige complement traditional minimalist whites and grays.\n\nSustainability is no longer optional. Minimalist design now emphasizes quality pieces made from sustainable materials that will last for years, reducing waste and environmental impact.\n\nNegative space is being used more intentionally. Rather than filling every corner, designers are creating breathing room that makes spaces feel larger and more peaceful.\n\nThe key to modern minimalism is creating spaces that feel curated rather than empty, intentional rather than sparse.",
      image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=80",
      author: "Lisa Anderson",
      date: "January 28 2025",
      tag: "Trends"
    },
    {
      id: 5,
      title: "How to Mix and Match Furniture Styles Like a Pro",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      content: "Mixing furniture styles can create a unique, personalized space that reflects your personality. The key is knowing how to blend different aesthetics without creating chaos.\n\nStart with a dominant style. Choose one style as your foundation – whether it's modern, traditional, or industrial – and let it occupy about 60-70% of your space. This creates cohesion.\n\nFind common elements. Look for pieces that share similar colors, materials, or shapes. A modern chair and a vintage table can work together if they share a wood tone or color palette.\n\nBalance is crucial. If you have a heavy, ornate piece, balance it with something light and simple. Mix curved lines with straight edges, and ornate details with clean surfaces.\n\nUse color as a unifier. A consistent color scheme can tie together disparate styles. Neutral backgrounds allow different furniture styles to coexist peacefully.\n\nScale matters. Ensure your furniture pieces are proportional to each other and to your room. Mixing styles doesn't mean mixing sizes randomly.\n\nCreate intentional contrast. Pair a sleek modern sofa with a rustic coffee table, or place contemporary art above a traditional sideboard. These deliberate contrasts create visual interest.\n\nDon't overthink it. Trust your instincts. If pieces feel right together, they probably are. Your home should reflect your personal taste, not follow rigid rules.\n\nRemember, the goal is an eclectic look that feels curated, not cluttered.",
      image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80",
      author: "Tom Roberts",
      date: "January 25 2025",
      tag: "Interior Design"
    },
    {
      id: 6,
      title: "Sustainable Furniture: Eco-Friendly Choices for Your Home",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      content: "Making sustainable furniture choices is one of the most impactful ways to reduce your environmental footprint while creating a beautiful home.\n\nChoose quality over quantity. Investing in well-made furniture that lasts decades is more sustainable than buying cheap pieces that need frequent replacement. Look for solid wood construction and quality joinery.\n\nSeek certified materials. Look for FSC-certified wood, which ensures forests are managed responsibly. GREENGUARD certification indicates low chemical emissions.\n\nConsider reclaimed and recycled materials. Furniture made from reclaimed wood or recycled metal reduces demand for new resources and often has unique character.\n\nSupport local artisans. Buying locally made furniture reduces transportation emissions and supports your community's economy.\n\nChoose natural fabrics. Organic cotton, linen, hemp, and wool are renewable and biodegradable. Avoid synthetic fabrics when possible.\n\nLook for non-toxic finishes. Many furniture pieces are treated with harmful chemicals. Seek out natural oils, waxes, and water-based finishes.\n\nBuy vintage or secondhand. Giving existing furniture a new life is the most sustainable option. Vintage pieces often have better craftsmanship than modern equivalents.\n\nConsider modular furniture. Pieces that can be reconfigured or expanded adapt to your changing needs, reducing the need for new purchases.\n\nRepair rather than replace. Learn basic furniture repair skills or find local craftspeople who can restore damaged pieces.\n\nRemember, sustainable choices benefit both the planet and your home's aesthetic.",
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=80",
      author: "Rachel Green",
      date: "January 20 2025",
      tag: "Lifestyle"
    },
    {
      id: 7,
      title: "Small Space Solutions: Furniture for Compact Living",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      content: "Living in a small space doesn't mean sacrificing style or functionality. With smart furniture choices, you can create a comfortable, beautiful home in any size space.\n\nMulti-functional furniture is your best friend. Sofa beds, ottoman storage, and drop-leaf tables serve multiple purposes without taking up extra space.\n\nGo vertical. Use wall space for storage with floating shelves, wall-mounted desks, and tall bookcases. This keeps floor space open and makes rooms feel larger.\n\nChoose furniture with exposed legs. Pieces that sit on legs rather than the floor create visual space underneath, making rooms feel more open.\n\nUse mirrors strategically. Large mirrors reflect light and create the illusion of more space. Place them opposite windows for maximum effect.\n\nOpt for transparent furniture. Glass or acrylic pieces don't visually clutter a space, making rooms feel larger.\n\nScale appropriately. Choose furniture that fits your space. A loveseat might work better than a full sofa, and a round table takes up less visual space than a rectangular one.\n\nCreate zones. Use furniture placement to define different areas in an open space – a rug under the dining table, a bookshelf as a room divider.\n\nKeep it light. Light colors make spaces feel larger. Choose furniture in whites, creams, or light woods.\n\nMinimize clutter. In small spaces, every item should earn its place. Regular decluttering keeps your space feeling open and peaceful.\n\nRemember, small spaces can be cozy and stylish with the right approach.",
      image: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200&q=80",
      author: "James Wilson",
      date: "January 15 2025",
      tag: "Furniture Tips"
    },
    {
      id: 8,
      title: "DIY Furniture Makeover Ideas on a Budget",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      content: "Transforming old furniture into stunning pieces doesn't require a big budget – just creativity and a little elbow grease.\n\nPainting is the easiest transformation. A fresh coat of paint can completely change a piece's look. Use chalk paint for a matte, vintage finish, or high-gloss paint for a modern aesthetic. Don't forget to sand and prime first.\n\nReplace hardware. New knobs, pulls, and handles can dramatically update dressers, cabinets, and nightstands. This simple change makes a big impact.\n\nReupholster chairs. If you have basic sewing skills, reupholstering dining chairs or an ottoman is achievable. Choose a bold fabric to make a statement.\n\nAdd wallpaper or contact paper. Line drawer interiors or back panels of bookcases with decorative paper for a pop of pattern.\n\nStain or refinish wood. Strip old finish and apply new stain to reveal beautiful wood grain. This works wonderfully on tables and dressers.\n\nCreate a distressed look. Sand edges and corners after painting to reveal wood underneath for a shabby chic aesthetic.\n\nAdd legs. Replace or add new legs to furniture pieces. Hairpin legs can modernize a dresser, while turned legs add traditional charm.\n\nUse stencils. Create patterns on furniture surfaces with stencils and paint for a custom look.\n\nApply decoupage. Use decorative paper or fabric with decoupage medium to create unique designs on furniture surfaces.\n\nRemember, patience is key. Take your time, and don't be afraid to experiment.",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
      author: "Sophia Lee",
      date: "January 10 2025",
      tag: "DIY"
    },
    {
      id: 9,
      title: "The Ultimate Guide to Bedroom Furniture Layout",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      content: "A well-planned bedroom layout creates a peaceful retreat that's both functional and beautiful. Here's how to arrange your bedroom furniture for optimal comfort and flow.\n\nStart with the bed. It's the focal point and largest piece, so place it first. Ideally, position it against the longest wall, centered if possible. Ensure you can walk around both sides easily.\n\nLeave walking space. Maintain at least 24-36 inches of clearance around the bed and other furniture for comfortable movement.\n\nPosition nightstands symmetrically. Place matching nightstands on both sides of the bed for balance. They should be the same height as your mattress or slightly lower.\n\nConsider the dresser placement. Position dressers where they're easily accessible but don't block natural light or traffic flow. Across from the bed works well if space allows.\n\nCreate a seating area if space permits. A comfortable chair with a small side table in a corner creates a reading nook or dressing area.\n\nThink about the closet. Ensure dresser and closet placement allows doors to open fully without obstruction.\n\nPosition mirrors thoughtfully. Place mirrors where they reflect light but not directly facing the bed, which some find unsettling.\n\nConsider TV placement. If you have a TV, mount it at eye level when sitting in bed, or place it on a low dresser.\n\nBalance the room. Distribute visual weight evenly. If you have a large dresser on one side, balance it with a seating area or tall plant on the other.\n\nRemember, your bedroom should feel calm and uncluttered. Less is often more.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
      author: "Alex Turner",
      date: "January 05 2025",
      tag: "Interior Design"
    },
    {
      id: 10,
      title: "Outdoor Furniture: Choosing Pieces That Last",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      content: "Investing in quality outdoor furniture ensures your patio or deck remains beautiful and functional for years. Here's what to consider when choosing outdoor pieces.\n\nMaterial matters most. Teak, cedar, and eucalyptus are naturally weather-resistant woods. Aluminum and powder-coated steel resist rust. All-weather wicker and resin are durable and low-maintenance.\n\nConsider your climate. Harsh sun requires UV-resistant materials. Humid climates need rust-proof metals. Cold winters demand furniture that can withstand freezing temperatures.\n\nCushion quality is crucial. Look for solution-dyed acrylic fabrics that resist fading and mildew. Quick-dry foam prevents moisture retention.\n\nThink about maintenance. Some materials require regular sealing or oiling. Others need only occasional cleaning. Choose based on how much upkeep you're willing to do.\n\nSize appropriately. Measure your space and leave room for movement. Outdoor furniture often looks smaller in stores than in your actual space.\n\nInvest in covers. Even weather-resistant furniture lasts longer with protection. Quality covers prevent sun damage and moisture accumulation.\n\nConsider storage. If you have harsh winters, can you store furniture indoors? Folding or stackable pieces are easier to store.\n\nTest comfort. Sit on furniture before buying. Outdoor pieces should be as comfortable as indoor furniture since you'll spend hours relaxing on them.\n\nThink about style. Your outdoor furniture should complement your home's architecture and your indoor style for a cohesive look.\n\nRemember, quality outdoor furniture is an investment in your outdoor living experience.",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
      author: "Nina Patel",
      date: "December 30 2024",
      tag: "Lifestyle"
    },
    {
      id: 11,
      title: "Color Psychology in Furniture Selection",
      excerpt: "Augue ut lectus arcu bibendum at varius vel. Ipsum nunc aliquet bibendum enim facilisis. Quam elementum pulvinar etiam non quam...",
      content: "Colors profoundly affect our mood and behavior. Understanding color psychology helps you choose furniture that creates the atmosphere you desire in each room.\n\nBlue promotes calm and productivity. Navy sofas or blue accent chairs create serene living spaces. Lighter blues work well in bedrooms for restful sleep.\n\nGreen connects us to nature. Green furniture brings freshness and balance. It's perfect for home offices and living rooms, promoting both relaxation and focus.\n\nNeutral tones provide versatility. Beige, gray, and white furniture creates a calm backdrop that works with any decor style. These colors make spaces feel larger and brighter.\n\nWarm colors energize. Red, orange, and yellow furniture pieces add energy and warmth. Use them as accents rather than dominant pieces to avoid overwhelming spaces.\n\nPurple suggests luxury. Deep purple or lavender furniture adds sophistication. Use it in bedrooms or formal living areas for an elegant touch.\n\nBrown grounds spaces. Wood furniture and brown upholstery create warmth and stability. They work in any room and pair well with most color schemes.\n\nBlack adds drama. Black furniture makes bold statements and adds sophistication. Balance it with lighter elements to prevent spaces from feeling heavy.\n\nWhite creates openness. White furniture makes rooms feel spacious and clean. It's perfect for small spaces and minimalist aesthetics.\n\nConsider room function. Bedrooms benefit from calming colors, while social spaces can handle more energetic hues.\n\nRemember, choose colors that resonate with you personally. Your home should reflect your preferences and make you feel comfortable.",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      author: "Chris Martin",
      date: "December 25 2024",
      tag: "Trends"
    }
  ];

  const currentBlog = blogPosts.find(post => post.id === parseInt(blogId));

  if (!currentBlog) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-container">
          <h2>Blog post not found</h2>
          <button onClick={() => navigate('/blog')} className="back-btn">
            <ArrowLeft size={20} /> Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const recommendedBlogs = blogPosts
    .filter(post => post.id !== currentBlog.id && post.tag === currentBlog.tag)
    .slice(0, 3);

  if (recommendedBlogs.length < 3) {
    const additionalBlogs = blogPosts
      .filter(post => post.id !== currentBlog.id && !recommendedBlogs.includes(post))
      .slice(0, 3 - recommendedBlogs.length);
    recommendedBlogs.push(...additionalBlogs);
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        <button onClick={() => navigate('/blog')} className="back-btn">
          <ArrowLeft size={20} /> Back to Blog
        </button>

        <article className="blog-detail-content">
          <div className="blog-detail-header">
            <div className="blog-meta">
              <span className="meta-item">
                <Calendar size={16} /> {currentBlog.date}
              </span>
              <span className="meta-item">
                <User size={16} /> {currentBlog.author}
              </span>
              <span className="meta-item">
                <Tag size={16} /> {currentBlog.tag}
              </span>
            </div>
            <h1>{currentBlog.title}</h1>
          </div>

          <div className="blog-detail-image">
            <img src={currentBlog.image} alt={currentBlog.title} />
          </div>

          <div className="blog-detail-body">
            {currentBlog.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        <section className="recommended-blogs">
          <h2>Recommended Articles</h2>
          <div className="recommended-grid">
            {recommendedBlogs.map(blog => (
              <div 
                key={blog.id} 
                className="recommended-card"
                onClick={() => navigate(`/blog/${blog.id}`)}
              >
                <div className="recommended-image">
                  <img src={blog.image} alt={blog.title} />
                </div>
                <div className="recommended-content">
                  <span className="recommended-date">{blog.date}</span>
                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>
                  <span className="recommended-tag">{blog.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default BlogDetail;
