import React from "react";
import "../css/AdBanner.css";
import brickBreakerImg from "../assets/ads/brick_breaker.jpg";
import punchImg from "../assets/ads/punch.webp";
import puzzleImg from "../assets/ads/fifteen_puzzle.svg";

const adsData = [
    {
        id: 1,
        title: "Brick Breaker",
        image: brickBreakerImg,
        url: "https://brick-breaker-lyart.vercel.app/",
        hasMascot: true,
    },
    {
        id: 2,
        title: "15 Puzzle",
        image: puzzleImg,
        url: "https://fifteen-puzzle-five.vercel.app/",
        hasMascot: false,
    },
    {
        id: 3,
        title: "Punch Game",
        image: punchImg,
        url: "https://punch-09.vercel.app/",
        hasMascot: false,
    },
];

const AdBanner = ({ onClose }) => {
    const handleAdClick = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="ad-banner-container" onClick={(e) => e.stopPropagation()}>
            <div className="ad-banner-header">
                <span className="ad-label">Suggested Games</span>
                <div className="ad-controls">
                    <button className="ad-control-btn" title="Close" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            </div>

            <div className="ad-cards-container">
                {adsData.map((ad) => (
                    <div key={ad.id} className="ad-card" onClick={() => handleAdClick(ad.url)}>
                        <div className="ad-card-inner">
                            <div className="ad-image-wrapper">
                                <img src={ad.image} alt={ad.title} className="ad-image" />
                            </div>
                            {ad.hasMascot && (
                                <div className="frog-mascot">
                                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="50" cy="50" r="40" fill="#00D4FF" stroke="black" strokeWidth="4" />
                                        <circle cx="35" cy="40" r="8" fill="white" stroke="black" strokeWidth="2" />
                                        <circle cx="65" cy="40" r="8" fill="white" stroke="black" strokeWidth="2" />
                                        <circle cx="35" cy="40" r="3" fill="black" />
                                        <circle cx="65" cy="40" r="3" fill="black" />
                                        <path d="M35 65Q50 75 65 65" stroke="black" strokeWidth="4" strokeLinecap="round" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="ad-title-simple">{ad.title}</div>
                    </div>
                ))}
            </div>

            <div className="ad-info-icon-bottom" title="Information">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4db8ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
        </div>
    );
};

export default AdBanner;
