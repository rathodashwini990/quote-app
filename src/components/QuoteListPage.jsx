import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuotes } from '../services/api';
import './QuoteListPage.scss';

function QuoteListPage() {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuotes = async () => {
            const token = localStorage.getItem('token');
            try {
                const data = await getQuotes(token, 20, offset);  // Ensure this returns an object with 'data' array
                console.log('API Response:', data);  // Log the response to check its structure

                if (data && Array.isArray(data.data)) {
                    // If no quotes are returned, stop pagination
                    if (data.data.length === 0) {
                        setHasMore(false);
                    }

                    // Filter out already loaded quotes to avoid duplicates
                    const newQuotes = data.data.filter((quote) =>
                        !quotes.some((existingQuote) => existingQuote.id === quote.id)
                    );

                    // Append new unique quotes
                    setQuotes((prevQuotes) => [...prevQuotes, ...newQuotes]);

                    if (newQuotes.length < 20) {
                        setHasMore(false);  // No more quotes to fetch
                    }
                } else {
                    setError('Received data is not in the expected format');
                }
            } catch (err) {
                setError('Failed to fetch quotes.');
            } finally {
                setLoading(false);
            }
        };

        // Fetch quotes only when offset changes
        if (hasMore) {
            fetchQuotes();
        }
    }, [offset, hasMore]);  // Only fetch when offset or hasMore changes

    // Use useCallback to memoize the handleScroll function
    const handleScroll = useCallback(() => {
        if (hasMore && !loading) {
            const bottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
            if (bottom) {
                setOffset((prevOffset) => prevOffset + 20); // Increment offset for next page
            }
        }
    }, [hasMore, loading]);  // Only recreate handleScroll when hasMore or loading changes

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);  // Pass handleScroll as the dependency

    const handleCreateQuote = () => {
        navigate('/create-quote');
    };

    return (
        <div className="quote-list-page">
            <h2>Quotes</h2>
            {error && <p className="error">{error}</p>}

            {/* Floating action button */}
            <button className="fab" onClick={handleCreateQuote}>+</button>

            <div className="quote-list">
                {quotes.length === 0 ? (
                    <p>No quotes available.</p>
                ) : (
                    quotes.map((quote) => (
                        <div className="quote-card" key={quote.id}>
                        {console.log("quote", quote)}
                            <div className="quote-image-container">
                                <img src={quote.mediaUrl} alt="quote" className="quote-image" />
                            </div>
                            <div className="quote-details">
                                <div className="quote-text">{quote.text}</div>
                                <div className="username">{quote.username}</div>
                                <div className="created-at">{quote.created_at}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default QuoteListPage;