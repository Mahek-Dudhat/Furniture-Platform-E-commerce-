import { useEffect, useState, useTransition } from 'react'
import './FilterSidebar.css'
import { getFilterOptions } from '../../../api/productservice';

function FilterSidebar({ filters, setFilters, category }) {

    const [expandedFilters, setExpandedFilters] = useState({
        availability: true,
        price: true,
        brand: false,
        category: false,
        color: false,
        material: false
    });

    const [filterOptions, setFilterOptions] = useState({
        brands: [],
        colors: [],
        materials: [],
        categories: [],
        priceRange: { minPrice: 0, maxPrice: 150000 }
    });

    // Fetch filter options from backend

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await getFilterOptions(category);
                if (response.success) {
                    console.log("Filter response data:", response.data)
                    setFilterOptions(response.data);
                }
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchOptions();
    }, [category]);

    const toggleFilter = (filterId) => {
        setExpandedFilters(prev => ({ ...prev, [filterId]: !prev[filterId] }));
    };

    const handleCheckboxChange = (filterId, option) => {
        const filterMap = {
            brand: 'selectedBrands',
            color: 'selectedColors',
            material: 'selectedMaterials',
            productType: 'selectedProductTypes',
            availability: 'availability',
            category: "category",
        };
        const key = filterMap[filterId];
        if (!key) return;

        setFilters(prev => {
            const current = prev[key];
            let updated;

            if (Array.isArray(current)) {
                updated = current.includes(option)
                    ? current.filter(item => item !== option)
                    : [...current, option];
            } else {
                updated = current === option ? '' : option;
            }

            return { ...prev, [key]: updated, page: 1 }; // Reset to page 1
        });

    }

    const handleAvalibilityChange = (value) => {
        setFilters((prev) => ({
            ...prev,
            inStock: prev.inStock === value ? '' : value,
            page: 1
        }));
    }


    const filtersList = [
        {
            id: 'availability',
            label: 'Availability',
            options: [
                { label: 'In Stock', value: 'true' },
                { label: 'Out of Stock', value: 'false' }
            ]
        },
        { id: 'price', label: 'Price', type: 'range' },
        { id: 'brand', label: 'Brand', options: filterOptions.brands },
        { id: 'category', label: 'Category', options: filterOptions.categories },
        { id: 'color', label: 'Color', options: filterOptions.colors },
        { id: 'material', label: 'Material', options: filterOptions.materials }
    ];

    const clearAllFilters = () => {
        setFilters({
            category: '',
            minPrice: 0,
            maxPrice: 150000,
            selectedBrands: [],
            selectedColors: [],
            selectedMaterials: [],
            inStock: '',
            search: '',
            sort: '',
            order: 'asc',
            page: 1
        });
    };

    return (
        <aside className="filter-sidebar">
            <div className="filter-header-main">
                <h2>Filters</h2>
                <button className="clear-all-btn" onClick={clearAllFilters}>
                    Clear All
                </button>
            </div>
            {filtersList?.map(filter =>(

                <div key={filter.id} className="filter-item">
                    <button className="filter-header" onClick={() => toggleFilter(filter.id)}>
                        <span>{filter.label}</span>
                        <span className="arrow">{expandedFilters[filter.id] ? '−' : '>'}</span>
                    </button>
                    {expandedFilters[filter.id] && (
                        <div className="filter-content">
                            {filter?.type === 'range' ? (
                                <div className="price-range-container">
                                    <div className="range-slider">
                                        <input
                                            type="range"
                                            min={filterOptions?.priceRange?.minPrice}
                                            max={filterOptions?.priceRange?.maxPrice}
                                            value={filters?.minPrice}
                                            onChange={(e) => setFilters(prev => ({
                                                ...prev,
                                                minPrice: Number(e.target.value),
                                                page: 1
                                            }))}
                                            className="range-min"
                                        />
                                        <input
                                            type="range"
                                            min={filterOptions?.priceRange?.minPrice}
                                            max={filterOptions?.priceRange?.maxPrice}
                                            value={filters?.maxPrice}
                                            onChange={(e) => setFilters(prev => ({
                                                ...prev,
                                                maxPrice: Number(e.target.value),
                                                page: 1
                                            }))}
                                            className="range-max"
                                        />
                                    </div>
                                    <div className="price-inputs">
                                        <div className="price-input">
                                            <span>₹</span>
                                            <input type="number" value={filters?.minPrice} readOnly />
                                        </div>
                                        <div className="price-input">
                                            <span>₹</span>
                                            <input type="number" value={filters?.maxPrice} readOnly />
                                        </div>
                                    </div>
                                </div>
                            ) : filter.id === 'availability' ? (
                                filter?.options.map(option => (

                                    <label key={option.value} className="material-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={filters?.inStock === option.value}
                                            onChange={() => handleAvalibilityChange(option.value)}
                                        />
                                        <span className="checkmark"></span>
                                        {option.label}
                                    </label>
                                ))
                            ) : (
                                filter?.options?.map(option => {
                                    const filterMap = {
                                        brand: 'selectedBrands',
                                        color: 'selectedColors',
                                        material: 'selectedMaterials',
                                        category: 'category'
                                    };
                                    const key = filterMap[filter.id];
                                    const isChecked = Array.isArray(filters[key])
                                        ? filters[key].includes(option)
                                        : filters[key] === option;
                                    return (
                                        <label key={option} className="material-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleCheckboxChange(filter.id, option)}
                                            />
                                            <span className="checkmark"></span>
                                            {option}
                                        </label>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            ))}
        </aside>
    );
}

export default FilterSidebar
