// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Claude API configuration
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

// Endpoint for swap analysis
app.post('/api/analyze-swap', async (req, res) => {
    try {
        const { tokenIn, tokenOut, amountIn, marketData } = req.body;
        
        // Call Claude API
        const analysis = await callClaudeAPI({
            tokenIn,
            tokenOut, 
            amountIn,
            marketData
        });
        
        res.json(analysis);
    } catch (error) {
        console.error('Claude API Error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

async function callClaudeAPI(swapData) {
    const prompt = `
    Analyze this DeFi swap for MEV risks:
    Token In: ${swapData.tokenIn}
    Token Out: ${swapData.tokenOut}  
    Amount: ${swapData.amountIn}
    Gas Price: ${swapData.marketData.gasPrice} gwei
    Pool Liquidity: $${swapData.marketData.liquidity}
    
    Respond with JSON:
    {
        "riskLevel": "Low|Medium|High",
        "approved": true/false,
        "warnings": ["array of warnings"],
        "recommendations": ["array of recommendations"],
        "reasoning": "detailed explanation"
    }
    `;

    const response = await axios.post(CLAUDE_API_URL, {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
            role: 'user',
            content: prompt
        }]
    }, {
        headers: {
            'Authorization': `Bearer ${CLAUDE_API_KEY}`,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
        }
    });

    return JSON.parse(response.data.content[0].text);
}

app.listen(3001, () => {
    console.log('Backend server running on port 3001');
});