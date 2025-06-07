import React, { useState } from 'react';
import './BlogCard.css';

const BlogCard = ({ title = '', description = '', link = '#', imageUrl = '' }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card">
      <div
        className="image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="content">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <span className="title">{title}</span>
        </a>
        <p className={`desc ${expanded ? 'expanded' : ''}`}>
          {expanded ? description : `${description.slice(0, 100)}...`}
        </p>
        {/* <button className="action" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show less' : 'Read more'} <span>{expanded ? '↑' : '→'}</span>
        </button> */}
      </div>
    </div>
  );
};

export default BlogCard;
