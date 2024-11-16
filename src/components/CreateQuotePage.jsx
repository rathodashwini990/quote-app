import React, { useState } from 'react';
import { createQuote, uploadMedia } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateQuotePage = () => {
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Start loading indicator

        try {
            // Check if file is selected
            if (!file) {
                setError('No file selected.');
                setLoading(false);
                return;
            }

            // Upload media and get mediaUrl
            const mediaUrl = await uploadMedia(file);

            // Check if mediaUrl is valid
            if (!mediaUrl) {
                setError('Failed to upload image. No media URL received.');
                setLoading(false);
                return;
            }

            console.log('Uploaded Media URL:', mediaUrl); // Log the media URL for debugging

            // Create quote with text and mediaUrl
            const response = await createQuote(token, text, mediaUrl);
            console.log('Create Quote Response:', response); // Log the response

            if (response && response.success) {
                // Reset form after success
                setText('');
                setFile(null);
                setSuccess(true);
                setLoading(false);

            
                setTimeout(() => {
                    navigate('/quotes'); 
                }, 1000);
            } else {
                setError('Failed to create quote. Please try again.');
                setLoading(false);
            }

        } catch (err) {
            console.error('Error:', err);
            setError('Failed to create quote.');
            setLoading(false);
        }
    };

    return (
        <div className="create-quote-page">
            <h2>Create a Quote</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Enter your quote"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
                {success && <p>Quote created successfully!</p>}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default CreateQuotePage;