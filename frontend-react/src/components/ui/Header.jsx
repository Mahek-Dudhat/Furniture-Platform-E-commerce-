import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import './Header.css'
import { useProducts } from '../../context/FurnitureProductsProvider'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [searchResults, setSearchResults] = useState([]);

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const searchInputRef = useRef(null)

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/login');
    }

    const { products, getCartCount } = useProducts();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
    }

    const closeSearch = () => {
        setIsSearchOpen(false)
        if (searchInputRef.current) searchInputRef.current.value = '';
    }

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearchChange = (e) => {
        const query = e.target.value;

        if (query.trim() !== '') {
            const results = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const searchValue = searchInputRef.current?.value;
        if (searchValue?.trim()) {
            navigate(`/collections/all?search=${encodeURIComponent(searchValue)}`);
            closeSearch();
            setSearchResults([]);
            searchInputRef.current.value = '';
        }
    }

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
                <div className="header-logo">
                    <NavLink to="/" onClick={closeMenu}>
                        <img src='./header/header.png' alt='Aura Vista Furniture' />
                    </NavLink>
                </div>

                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <button className="close-btn" onClick={closeMenu}>&times;</button>

                    <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                        HOME
                    </NavLink>
                    <NavLink to="/collections/all" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                        PRODUCTS
                    </NavLink>
                    <NavLink to="/blog" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                        BLOG
                    </NavLink>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                        CONTACT
                    </NavLink>
                </nav>

                <div className="header-icons">
                    <button className="icon-btn search-btn" onClick={toggleSearch}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                    {user ? (
                        <div className="user-menu-container">
                            <button className="icon-btn user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </button>
                            <span> {user.fullname}</span>

                            {showUserMenu && (
                                <div className="user-dropdown">
                                    <NavLink to="/profile" className="user-info" onClick={() => setShowUserMenu(false)}>My Profile</NavLink>
                                    <NavLink to="/my-orders" className="user-info my-orders-btn" onClick={() => setShowUserMenu(false)}>My Orders</NavLink>
                                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NavLink to="/login">
                            <button className="icon-btn user-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </button>
                        </NavLink>
                    )}
                    <NavLink to="/cart">
                        <button className="icon-btn cart-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            {getCartCount() > 0 && (<span className="cart-count">{getCartCount()}</span>)}
                        </button>
                    </NavLink>
                </div>

                <button className={`hamburger ${isMenuOpen ? 'hidden' : ''}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`}>
                <button className="search-close" onClick={closeSearch}>&times;</button>
                <div className={`search-content ${searchResults.length > 0 ? 'active' : ''}`}>
                    <h2 className="search-title">What Are You Looking For?</h2>
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="search-input"
                            placeholder="Search the product..."
                            onChange={handleSearchChange}
                        />
                    </form>
                </div>

                {searchResults.length > 0 && (
                    <div className="search-results active">
                        {searchResults.map((product) => (
                            <NavLink to={`/product/${product._id}`} className="search-item" key={product._id} onClick={closeSearch}>
                                <div className="search-image">
                                    <img src={product.images[0]?.url} alt={product.name} />
                                </div>
                                <div className="search-details">
                                    <h3 className="search-name">{product.name}</h3>
                                    <p className="search-description">{product.description}</p>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                )
                }
            </div>
        </header>
    )
}

export default Header

