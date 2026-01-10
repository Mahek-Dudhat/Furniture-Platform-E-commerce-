import { useEffect, useState, useRef } from 'react'
import FilterSidebar from './FilterSidebar'
import ProductsGrid from './ProductsGrid'
import './ProductsSection.css'
import { useParams, useSearchParams } from 'react-router-dom';


function ProductsSection() {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const isInitialMount = useRef(true);

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        minPrice: Number(searchParams.get('minPrice')) || 0,
        maxPrice: Number(searchParams.get('maxPrice')) || 150000,
        selectedBrands: searchParams.getAll('brand') || [],
        selectedColors: searchParams.getAll('color') || [],
        selectedMaterials: searchParams.getAll('material') || [],
        inStock: searchParams.get('inStock') || '',
        search: searchParams.get('search') || '',
        sort: searchParams.get('sort') || '',
        order: searchParams.get('order') || 'asc',
        page: Number(searchParams.get('page')) || 1
    });

    // Sync filters with URL changes
    useEffect(() => {
        setFilters({
            category: searchParams.get('category') || '',
            minPrice: Number(searchParams.get('minPrice')) || 0,
            maxPrice: Number(searchParams.get('maxPrice')) || 150000,
            selectedBrands: searchParams.getAll('brand') || [],
            selectedColors: searchParams.getAll('color') || [],
            selectedMaterials: searchParams.getAll('material') || [],
            inStock: searchParams.get('inStock') || '',
            search: searchParams.get('search') || '',
            sort: searchParams.get('sort') || '',
            order: searchParams.get('order') || 'asc',
            page: Number(searchParams.get('page')) || 1
        });
    }, [searchParams]);

    // Update URL when filters change from sidebar
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const newParams = new URLSearchParams();

        if (filters.search) newParams.set('search', filters.search);
        if (filters.category) newParams.set('category', filters.category);
        if (filters.minPrice > 0) newParams.set('minPrice', filters.minPrice);
        if (filters.maxPrice < 150000) newParams.set('maxPrice', filters.maxPrice);
        filters.selectedBrands.forEach(b => newParams.append('brand', b));
        filters.selectedColors.forEach(c => newParams.append('color', c));
        filters.selectedMaterials.forEach(m => newParams.append('material', m));
        if (filters.inStock) newParams.set('inStock', filters.inStock);
        if (filters.sort) newParams.set('sort', filters.sort);
        if (filters.order) newParams.set('order', filters.order);
        if (filters.page > 1) newParams.set('page', filters.page);

        setSearchParams(newParams, { replace: true });
    }, [filters, setSearchParams]);

    return (
        <section className="products-section">
            <div className="container">
                <div className="products-layout">
                    <FilterSidebar setFilters={setFilters} filters={filters} category={params.category} />
                    <ProductsGrid filters={filters} setFilters={setFilters} category={params.category} />
                </div>
            </div>
        </section>
    )
}

export default ProductsSection
