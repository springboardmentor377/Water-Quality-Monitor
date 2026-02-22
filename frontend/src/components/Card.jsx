import React from 'react';

const Card = ({ title, children }) => (
  <div className="bg-white shadow rounded p-4 mb-4">
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    {children}
  </div>
);

export default Card;
