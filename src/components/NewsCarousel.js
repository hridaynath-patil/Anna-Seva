'use client';

import React, { useState, useEffect } from 'react';

const newsItems = [
  {
    id: 6,
    title: "'अन्नसेवा' डिजिटल उपक्रमामुळे उपाशी पोटाला मिळणार आधार",
    source: "Apal Man (आपलं मणू)",
    date: "17 Jun 2026",
    image: "/news/news-6.jpg",
    description: "लातूर व मराठवाड्यातील पहिल्या 'डिजिटल अन्नदान' उपक्रमाचा प्रारंभ. २५ स्वयंसेवी संस्थांच्या मदतीने मंगल कार्यालये, हॉटेल्स व केटर्समधील अतिरिक्त अन्न गरजूंपर्यंत सुरक्षितपणे पोहोचवण्यासाठी 'अन्नसेवा' हे स्वयंचलित डिजिटल पोर्टल सुरू करण्यात आले आहे."
  },
  {
    id: 1,
    title: "डिजिटल तंत्रज्ञानातून अन्नदानाचा महायज्ञ",
    source: "Sakal (सकाळ वृत्तसेवा)",
    date: "09 Jun 2026",
    image: "/news/news-2.jpg",
    description: "श्री विश्वनाथराव शामराव पाटील चॅरिटेबल ट्रस्ट अंतर्गत 'अन्न सेवा' या नावीन्यपूर्ण डिजिटल अन्नदान उपक्रमाची सुरुवात करण्यात आली आहे. याकरिता ट्रस्टचे प्रमुख हृदयनाथ पाटील या तरुणाने पुढाकार घेतला."
  },
  {
    id: 2,
    title: "२५ स्वयंसेवी संस्थांच्या मदतीने गरिबांसाठी 'अन्नसेवा'",
    source: "Ekmat (एकमत)",
    date: "08 Jun 2026",
    image: "/news/news-3.jpg",
    description: "लातूर व मराठवाड्यातील पहिलेच स्वयंचलित डिजिटल पोर्टल 'अन्नसेवा' सुरू झाले आहे. २५ संस्था या उपक्रमासाठी जोडल्या गेल्या असून गरिबांसाठी अन्न वाटप सोपे झाले आहे."
  },
  {
    id: 3,
    title: "'अन्नसेवा'मुळे उपाशी पोटाला मिळणार दोन घास!",
    source: "Lokmat (लोकमत)",
    date: "07 Jun 2026",
    image: "/news/news-4.jpg",
    description: "हॉटेल्स, केटर्स, मंगल कार्यालयात लग्न समारंभात वाया जाणाऱ्या अन्नाचा योग्य व पुरेपूर उपयोग व्हावा म्हणून 'अन्नसेवा' उपक्रम राबवला जात आहे. यामुळे हजारो उपाशी लोकांना अन्न मिळेल."
  },
  {
    id: 4,
    title: "स्वयंचलित डिजिटल पोर्टल 'अन्न सेवा'",
    source: "Trust Initiative Spotlight",
    date: "07 Jun 2026",
    image: "/news/news-1.jpg",
    description: "लातूर आणि मराठवाड्यासारख्या निमशहरी व ग्रामीण भागांसाठी थेट स्वयंचलित काम करणारे हे पहिलेच डिजिटल पोर्टल ठरले आहे. संपूर्ण तांत्रिक रचना स्वतः विकसित केली आहे."
  },
  {
    id: 5,
    title: "संस्थापक अध्यक्ष संदेश - 'अन्नसेवा'",
    source: "President's Message (संस्थापक संदेश)",
    date: "06 Jun 2026",
    image: "/news/news-5.jpg",
    description: "संस्थेचे संस्थापक अध्यक्ष हृदयनाथ पाटील यांचा संदेश - आपल्या परिसरातील एकही व्यक्ती उपाशी राहू नये, तसेच अन्नाचा एकही कण वाया जाऊ नये म्हणून आमचा हा प्रामाणिक प्रयत्न आहे."
  }
];

export default function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, newsItems.length - visibleCards);

  // Reset index if visible cards change and make index out of bounds
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCards, maxIndex, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-slide effect
  useEffect(() => {
    if (isPaused || maxIndex === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, maxIndex]);

  // Handle lightbox escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section
      className="news-carousel-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="public-container" style={{ margin: '0 auto', position: 'relative' }}>

        {/* Section Header */}
        <div className="news-header">
          <span className="news-section-tag">MEDIA SPOTLIGHT & COVERAGE</span>
          <h2 className="news-section-title">अन्न सेवा वृत्तपत्र प्रसिद्धी</h2>
          <p className="news-section-subtitle">
            See what leading newspapers say about our efforts to reduce food waste and coordinate deliveries to feed the needy across Latur and Marathwada.
          </p>
        </div>

        {/* Carousel Slider Outer Container */}
        <div className="carousel-outer">

          {/* Navigation Arrows */}
          {maxIndex > 0 && (
            <>
              <button
                onClick={handlePrev}
                className="carousel-nav-btn prev"
                aria-label="Previous News Card"
              >
                &#8592;
              </button>
              <button
                onClick={handleNext}
                className="carousel-nav-btn next"
                aria-label="Next News Card"
              >
                &#8594;
              </button>
            </>
          )}

          {/* Slider Track Area */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(calc(-${currentIndex} * (100% + var(--carousel-gap, 24px)) / ${visibleCards}))`
              }}
            >
              {newsItems.map((item) => (
                <div key={item.id} className="news-card">
                  {/* News Card Image wrapper */}
                  <div
                    className="news-card-image-box"
                    onClick={() => setLightboxImage(item.image)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="news-card-image"
                    />
                    <div className="news-card-image-overlay">
                      <span className="zoom-badge">🔍 Click to Zoom / Read</span>
                    </div>
                  </div>

                  {/* Card Content details */}
                  <div className="news-card-body">
                    <div className="news-card-meta">
                      <span className="news-card-source">{item.source}</span>
                      <span className="news-card-date">{item.date}</span>
                    </div>
                    <h3 className="news-card-title">{item.title}</h3>
                    <p className="news-card-desc">{item.description}</p>

                    <button
                      onClick={() => setLightboxImage(item.image)}
                      className="news-card-btn"
                    >
                      📰 View Full Newspaper Clip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Indicator Dots */}
        {maxIndex > 0 && (
          <div className="carousel-dots">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

      </div>

      {/* Lightbox / Zoom Modal popup */}
      {lightboxImage && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxImage(null)}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setLightboxImage(null)}
              aria-label="Close zoomed image"
            >
              &times;
            </button>
            <div className="lightbox-image-wrapper">
              <img
                src={lightboxImage}
                alt="Zoomed News Coverage Clipping"
                className="lightbox-image"
              />
            </div>
            <p className="lightbox-caption">Press ESC or click anywhere outside to close</p>
          </div>
        </div>
      )}
    </section>
  );
}
