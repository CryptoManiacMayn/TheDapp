// SwapComponent.js
import React, { useState } from 'react';
import axios from 'axios';

const SwapComponent = () => {
    const [swapData, setSwapData] = useState({
        tokenIn: '',
        tokenOut: '',
        amountIn: ''
    });
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    // Call your backend which calls Claude
    const analyzeSwap = async () => {
        setLoading(true);
        try {
            // Gather market data first
            const marketData = await gatherMarketData();
            
            // Call your backend endpoint
            const response = await axios.post('http://localhost:3001/api/analyze-swap', {
                ...swapData,
                marketData
            });
            
            setAnalysis(response.data);
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('AI analysis failed');
        } finally {
            setLoading(false);
        }
    };

    const gatherMarketData = async () => {
        // This would fetch real market data
        return {
            gasPrice: '30',
            liquidity: '1000000',
            volume24h: '500000',
            priceImpact: '0.5'
        };
    };

    const executeSwap = async () => {
        if (!analysis || !analysis.approved) {
            alert('Please get AI approval first');
            return;
        }
        
        // Execute your blockchain transaction here
        console.log('Executing swap with AI approval...');
    };

    return (
        <div>
            <h2>AI-Protected Token Swap</h2>
            
            <div>
                <input
                    placeholder="Token In Address"
                    value={swapData.tokenIn}
                    onChange={(e) => setSwapData({...swapData, tokenIn: e.target.value})}
                />
                <input
                    placeholder="Token Out Address"
                    value={swapData.tokenOut}
                    onChange={(e) => setSwapData({...swapData, tokenOut: e.target.value})}
                />
                <input
                    placeholder="Amount"
                    value={swapData.amountIn}
                    onChange={(e) => setSwapData({...swapData, amountIn: e.target.value})}
                />
            </div>

            <button 
                onClick={analyzeSwap} 
                disabled={loading}
            >
                {loading ? 'Analyzing with Claude...' : 'Analyze Swap'}
            </button>

            {analysis && (
                <div style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginTop: '10px',
                    backgroundColor: analysis.approved ? '#d4edda' : '#f8d7da'
                }}>
                    <h3>Claude AI Analysis</h3>
                    <p><strong>Risk Level:</strong> {analysis.riskLevel}</p>
                    <p><strong>Approved:</strong> {analysis.approved ? 'Yes' : 'No'}</p>
                    <p><strong>Reasoning:</strong> {analysis.reasoning}</p>
                    
                    {analysis.warnings.length > 0 && (
                        <div>
                            <strong>Warnings:</strong>
                            <ul>
                                {analysis.warnings.map((warning, i) => (
                                    <li key={i}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <button 
                onClick={executeSwap}
                disabled={!analysis || !analysis.approved}
                style={{
                    backgroundColor: analysis?.approved ? '#28a745' : '#6c757d',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    marginTop: '10px'
                }}
            >
                Execute Swap
            </button>
        </div>
    );
};

export default SwapComponent;