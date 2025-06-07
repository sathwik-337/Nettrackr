import React from 'react';
import styled from 'styled-components';

const Card = ({ icon, title, description, onClick }) => {
  return (
    <StyledWrapper onClick={onClick}>
      <div className="card">
        <img src={icon} alt={title} className="card-icon" />
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description}</p>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    box-sizing: border-box;
    width: 90%;
    max-width: 320px;
    background: #f5f7fa; /* soft light gray */
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    user-select: none;
    border: 1px solid #e1e4e8; /* subtle border */
  }

  .card-icon {
    width: 4rem;
    height: auto;
    margin-bottom: 1rem;
    /* keep image as-is, no filter */
  }

  .card-title {
    color: #222; /* dark but soft */
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .card-desc {
    color: #555; /* medium gray */
    font-size: 1rem;
    line-height: 1.4;
    margin: 0;
  }

  .card:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); /* very subtle shadow on hover */
  }

  .card:active {
    transform: scale(0.98);
  }

  @media (min-width: 640px) {
    .card {
      width: 300px;
      padding: 2rem;
    }

    .card-title {
      font-size: 1.5rem;
    }

    .card-desc {
      font-size: 1.1rem;
    }
  }
`;

export default Card;
