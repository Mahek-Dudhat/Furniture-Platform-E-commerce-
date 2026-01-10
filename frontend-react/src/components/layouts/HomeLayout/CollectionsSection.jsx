import './CollectionsSection.css'
import { NavLink } from 'react-router-dom'
import productsData from '../../../data/products.json'

function CollectionsSection() {
    const collections = [
        { name: 'Table', title: 'Dining Room Sets', image: productsData?.find(p => p.category === 'Table')?.image || '' },
        { name: 'Chair', title: 'Office & Workspace', image: productsData?.find(p => p.category === 'Chair')?.image || '' },
        { name: 'Bed', title: 'Modern Bedroom Furniture', image: productsData?.find(p => p.category === 'Bed')?.image || '' },
        { name: 'Storage', title: 'Storage & Organization Solutions', image: productsData?.find(p => p.category === 'Storage')?.image || '' },
        { name: 'Sofa', title: 'Living Room Essentials', image: productsData?.find(p => p.category === 'Sofa')?.image || '' }
    ]

    return (
        <section className="collections-section">
            <div className="container">
                <div className="collections-header">
                    <h3>Furniture picks every room style</h3>
                    <h1>Our Best Collections</h1>
                </div>
                <div className="row g-3">
                    {collections.map((collection) => (
                        <div key={collection.name} className="col-12 col-sm-6 col-md-4 col-lg">
                            <NavLink to={`/collections/${collection.name.toLowerCase()}`} className="collection-card">
                                <img src={collection.image} alt={collection.title} />
                                <div className="collection-overlay">
                                    <h3>{collection.title}</h3>
                                </div>
                            </NavLink>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CollectionsSection
