import './NewArrival.css'
import { NavLink } from 'react-router-dom'
import { useProducts } from '../../../context/FurnitureProductsProvider'
import SkeletonLoader from '../../common/SkeletonLoader'

function NewArrival() {
  const { newArrivals } = useProducts();

  return (
    <section className="new-arrival-section">
      <div className="container">
        <div className="new-arrival-header">
          <h3>Discover Our Latest Collections</h3>
          <h1>New Arrivals</h1>
        </div>
        <div className="row g-5">
          {!newArrivals || newArrivals.length === 0 ? (
            [...Array(6)].map((_, index) => (
              <div key={index} className="p-2 col-12 col-sm-6 col-md-4 col-lg">
                <div className="skeleton-card">
                  <div className="skeleton-image" style={{ height: '250px' }}></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text short"></div>
                  </div>
                </div>
              </div>
            ))
          ) : newArrivals.map((product) => (
            <div key={product._id} className="p-2 col-12 col-sm-6 col-md-4 col-lg">
              <NavLink to={`/product/${product._id}`} className="product-card">
                <div className="product-image">
                  <img src={product.images[0]?.url} alt={product.name} />
                  {product.discount > 0 && <span className="badge">{product.discount}% OFF</span>}
                </div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="price">₹{product.price.toLocaleString()}</p>
                </div>
              </NavLink>
            </div>
          ))
          }
        </div>
      </div>
    </section>
  )
}

export default NewArrival
