import React, { useState } from 'react';
import '../css/level.css';

const LEVELS_PER_PAGE = 12;

const LevelSelect = ({ levels, currentLevelIdx, unlockedLevel, onSelect, onClose }) => {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(levels.length / LEVELS_PER_PAGE);

    const startIndex = page * LEVELS_PER_PAGE;
    const currentLevels = levels.slice(startIndex, startIndex + LEVELS_PER_PAGE);

    const nextPage = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    const prevPage = () => {
        if (page > 0) setPage(page - 1);
    };

    return (
        <div className="level-select-overlay">

            <div className="level-header">
                <h1>SELECT LEVEL</h1>
            </div>

            <div className="grid-container">
                <div
                    className={`arrow-btn ${page === 0 ? 'disabled' : ''}`}
                    onClick={prevPage}
                    style={{ opacity: page === 0 ? 0.3 : 1, cursor: page === 0 ? 'default' : 'pointer' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>

                <div className="levels-grid">
                    {currentLevels.map((level, localIdx) => {
                        const idx = startIndex + localIdx;
                        const isLocked = idx > unlockedLevel;
                        return (
                            <div
                                key={idx}
                                className={`level-btn ${isLocked ? 'locked' : 'active'} ${idx === currentLevelIdx ? 'current' : ''}`}
                                onClick={() => !isLocked && onSelect(idx)}
                            >
                                {isLocked ? (
                                    <svg className="lock-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                ) : (
                                    <span>{idx + 1}</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div
                    className={`arrow-btn ${page === totalPages - 1 ? 'disabled' : ''}`}
                    onClick={nextPage}
                    style={{ backgroundColor: '#00B4DB', color: 'white', opacity: page === totalPages - 1 ? 0.5 : 1, cursor: page === totalPages - 1 ? 'default' : 'pointer' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
            </div>

            {/* <div className="page-indicator" style={{ marginTop: '20px', color: 'var(--ink)', fontWeight: 'bold' }}>
                PAGE {page + 1} / {totalPages}
            </div> */}
        </div>
    );
};

export default LevelSelect;
