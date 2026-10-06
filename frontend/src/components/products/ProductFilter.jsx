const ProductFilter = ({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  onClearFilters,
}) => {
  return (
    <aside className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(249,115,22,0.08)] sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
            Refine Products
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Filters
          </h2>
        </div>

        <button
          type="button"
          onClick={onClearFilters}
          className="text-xs font-black text-orange-600 transition hover:text-orange-800"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="border-b border-orange-50 pb-6">
        <label className="mb-3 block text-sm font-black text-slate-800">
          Category
        </label>

        <select
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(event.target.value)
          }
          className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Maximum Price */}
      <div className="border-b border-orange-50 py-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <label className="text-sm font-black text-slate-800">
            Maximum Price
          </label>

          <span className="text-sm font-black text-orange-600">
            Rs. {Number(maxPrice).toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="500000"
          step="1000"
          value={maxPrice}
          onChange={(event) =>
            setMaxPrice(Number(event.target.value))
          }
          className="w-full accent-orange-600"
        />

        <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-400">
          <span>Rs. 0</span>
          <span>Rs. 500,000+</span>
        </div>
      </div>

      {/* Sorting */}
      <div className="pt-6">
        <label className="mb-3 block text-sm font-black text-slate-800">
          Sort Products
        </label>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
        >
          <option value="latest">Latest Products</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name-a-z">Name: A to Z</option>
          <option value="name-z-a">Name: Z to A</option>
          <option value="stock">Stock Available</option>
        </select>
      </div>
    </aside>
  );
};

export default ProductFilter;