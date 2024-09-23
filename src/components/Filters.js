import React from 'react';

const Filters = ({ onSearch }) => {
    return (
        <div className="pr-4 pl-2 mt-2 border-b border-gray-400/50">
            <input
                type="text"
                placeholder="Buscar por nombre..."
                className="w-full p-2 mb-3 border rounded-lg text-black bg-white placeholder-gray-500"
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
};

export default React.memo(Filters);
