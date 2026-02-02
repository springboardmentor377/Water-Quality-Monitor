function FilterSidebar({ status, setStatus, ph, setPh }) {
  return (
    <div className="w-64 bg-gray-800 text-white p-5">
      <h2 className="text-xl font-bold mb-6">Filters</h2>

      {/* Status Filter */}
      <div className="mb-6">
        <label className="block mb-2">Water Status</label>
        <select
          className="w-full p-2 rounded text-black"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="Safe">Safe</option>
          <option value="Unsafe">Unsafe</option>
        </select>
      </div>

      {/* pH Filter */}
      <div>
        <label className="block mb-2">Max pH: {ph}</label>
        <input
          type="range"
          min="0"
          max="14"
          step="0.1"
          value={ph}
          onChange={(e) => setPh(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default FilterSidebar;
