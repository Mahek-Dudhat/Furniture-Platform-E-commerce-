import { useParams } from 'react-router-dom';
import BreadCrumb from '../components/layouts/ProductLayout/BreadCrumb'
import Categories from '../components/layouts/ProductLayout/Categories'
import ProductsHeader from '../components/layouts/ProductLayout/ProductsHeader'
import ProductsSection from '../components/layouts/ProductLayout/ProductsSection';

function Products() {
  const params = useParams();
  
  return (
    <>
      <BreadCrumb params={params} />
      <main>
        <div className="container">
          <ProductsHeader />
          <Categories />
          <ProductsSection />
        </div>
      </main>    
    </>
  )
}

export default Products
