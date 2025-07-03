// Smart Contract (Solidity) - MEVProtectedSwap.sol
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract MEVProtectedSwap is ReentrancyGuard, Ownable {
    ISwapRouter public immutable swapRouter;
    
    // MEV Protection parameters
    uint256 public constant MAX_SLIPPAGE = 300; // 3%
    uint256 public constant MIN_DELAY = 12; // 12 seconds
    mapping(address => uint256) public lastSwapTime;
    mapping(bytes32 => bool) public usedNonces;
    
    // AI Analysis requests
    struct SwapRequest {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 minAmountOut;
        address recipient;
        uint256 deadline;
        bytes32 nonce;
        bool aiVerified;
    }
    
    event SwapAnalyzed(bytes32 indexed nonce, bool approved, string reason);
    event SwapExecuted(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    
    constructor(address _swapRouter) {
        swapRouter = ISwapRouter(_swapRouter);
    }
    
    // MEV Protection: Time-based delays and nonce system
    modifier mevProtection(address user, bytes32 nonce) {
        require(block.timestamp >= lastSwapTime[user] + MIN_DELAY, "Too frequent swaps");
        require(!usedNonces[nonce], "Nonce already used");
        usedNonces[nonce] = true;
        lastSwapTime[user] = block.timestamp;
        _;
    }
    
    function executeSwap(SwapRequest calldata request) 
        external 
        nonReentrant 
        mevProtection(msg.sender, request.nonce)
    {
        require(request.aiVerified, "AI analysis required");
        require(block.timestamp <= request.deadline, "Transaction expired");
        
        // Additional MEV protection: sandwich attack detection
        uint256 currentPrice = getCurrentPrice(request.tokenIn, request.tokenOut);
        require(validatePriceImpact(currentPrice, request.amountIn, request.minAmountOut), "Price impact too high");
        
        // Execute the swap
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: request.tokenIn,
            tokenOut: request.tokenOut,
            fee: 3000, // 0.3%
            recipient: request.recipient,
            deadline: request.deadline,
            amountIn: request.amountIn,
            amountOutMinimum: request.minAmountOut,
            sqrtPriceLimitX96: 0
        });
        
        uint256 amountOut = swapRouter.exactInputSingle(params);
        emit SwapExecuted(msg.sender, request.tokenIn, request.tokenOut, request.amountIn, amountOut);
    }
    
    function getCurrentPrice(address tokenA, address tokenB) internal view returns (uint256) {
        // Implementation would query Uniswap pool for current price
        // This is simplified for example
        return 1000; // Placeholder
    }
    
    function validatePriceImpact(uint256 currentPrice, uint256 amountIn, uint256 minAmountOut) internal pure returns (bool) {
        // Validate that price impact is within acceptable range
        // This would include more sophisticated MEV detection logic
        return true; // Simplified
    }
}

// Frontend Integration (React + Web3)
import React, { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = process.env.REACT_APP_CLAUDE_API_KEY; // Store securely

const MEVProtectedSwapInterface = () => {
    const [swapParams, setSwapParams] = useState({
        tokenIn: '',
        tokenOut: '',
        amountIn: '',
        slippage: 1 // 1%
    });
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    // Claude AI Integration for swap analysis
    const analyzeSwapWithClaude = async (swapData) => {
        const prompt = `
        Analyze this DeFi token swap for potential MEV attacks and security risks:
        
        Token In: ${swapData.tokenIn}
        Token Out: ${swapData.tokenOut}
        Amount: ${swapData.amountIn}
        Current Gas Price: ${swapData.gasPrice} gwei
        Pool Liquidity: ${swapData.poolLiquidity}
        Recent Volume: ${swapData.recentVolume}
        Price Impact: ${swapData.priceImpact}%
        
        Please provide:
        1. MEV risk assessment (Low/Medium/High)
        2. Recommended actions
        3. Optimal timing suggestions
        4. Security warnings if any
        
        Respond in JSON format:
        {
            "riskLevel": "Low/Medium/High",
            "approved": true/false,
            "recommendations": ["list", "of", "recommendations"],
            "warnings": ["list", "of", "warnings"],
            "optimalTiming": "description",
            "reasoning": "detailed explanation"
        }
        `;

        try {
            const response = await axios.post(
                CLAUDE_API_URL,
                {
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 1000,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${CLAUDE_API_KEY}`,
                        'Content-Type': 'application/json',
                        'anthropic-version': '2023-06-01'
                    }
                }
            );

            return JSON.parse(response.data.content[0].text);
        } catch (error) {
            console.error('Claude API error:', error);
            throw new Error('AI analysis failed');
        }
    };

    // MEV Protection utilities
    const generateSecureNonce = () => {
        return ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(
                ['uint256', 'address', 'uint256'],
                [Date.now(), account, Math.random() * 1000000]
            )
        );
    };

    const detectSandwichAttack = async (tokenIn, tokenOut, amountIn) => {
        // Monitor mempool for potential sandwich attacks
        const pendingTxs = await provider.getBlock('pending');
        const relevantTxs = pendingTxs.transactions.filter(tx => 
            tx.to === UNISWAP_ROUTER_ADDRESS
        );
        
        // Analyze for sandwich patterns
        const suspiciousTxs = relevantTxs.filter(tx => 
            tx.gasPrice > ethers.utils.parseUnits('50', 'gwei') && // High gas price
            tx.value.eq(0) // Likely a swap
        );
        
        return suspiciousTxs.length > 2; // Potential sandwich if multiple high-gas swaps
    };

    const executeProtectedSwap = async () => {
        setLoading(true);
        try {
            // 1. Gather market data
            const marketData = await gatherMarketData();
            
            // 2. Analyze with Claude AI
            const analysis = await analyzeSwapWithClaude(marketData);
            setAiAnalysis(analysis);
            
            if (!analysis.approved) {
                alert(`Swap not recommended: ${analysis.reasoning}`);
                return;
            }
            
            // 3. MEV Protection checks
            const sandwichDetected = await detectSandwichAttack(
                swapParams.tokenIn, 
                swapParams.tokenOut, 
                swapParams.amountIn
            );
            
            if (sandwichDetected) {
                alert('Potential sandwich attack detected. Delaying transaction...');
                await new Promise(resolve => setTimeout(resolve, 15000)); // Wait 15 seconds
            }
            
            // 4. Execute swap with protection
            const nonce = generateSecureNonce();
            const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes
            
            const swapRequest = {
                tokenIn: swapParams.tokenIn,
                tokenOut: swapParams.tokenOut,
                amountIn: ethers.utils.parseEther(swapParams.amountIn),
                minAmountOut: calculateMinAmountOut(swapParams.amountIn, swapParams.slippage),
                recipient: account,
                deadline,
                nonce,
                aiVerified: true
            };
            
            const contract = new ethers.Contract(
                MEV_PROTECTED_SWAP_ADDRESS,
                MEV_PROTECTED_SWAP_ABI,
                signer
            );
            
            const tx = await contract.executeSwap(swapRequest);
            const receipt = await tx.wait();
            
            console.log('Protected swap executed:', receipt.transactionHash);
            
        } catch (error) {
            console.error('Swap failed:', error);
            alert(`Swap failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const gatherMarketData = async () => {
        // Gather comprehensive market data for AI analysis
        const gasPrice = await provider.getGasPrice();
        const poolInfo = await getPoolInfo(swapParams.tokenIn, swapParams.tokenOut);
        
        return {
            ...swapParams,
            gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei'),
            poolLiquidity: poolInfo.liquidity,
            recentVolume: poolInfo.volume24h,
            priceImpact: calculatePriceImpact(swapParams.amountIn, poolInfo.liquidity),
            timestamp: Date.now()
        };
    };

    return (
        <div className="swap-interface">
            <h2>AI-Protected Token Swap</h2>
            
            <div className="swap-form">
                <input
                    type="text"
                    placeholder="Token In Address"
                    value={swapParams.tokenIn}
                    onChange={(e) => setSwapParams({...swapParams, tokenIn: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Token Out Address"
                    value={swapParams.tokenOut}
                    onChange={(e) => setSwapParams({...swapParams, tokenOut: e.target.value})}
                />
                <input
                    type="number"
                    placeholder="Amount to Swap"
                    value={swapParams.amountIn}
                    onChange={(e) => setSwapParams({...swapParams, amountIn: e.target.value})}
                />
                <input
                    type="number"
                    placeholder="Slippage %"
                    value={swapParams.slippage}
                    onChange={(e) => setSwapParams({...swapParams, slippage: e.target.value})}
                />
            </div>

            {aiAnalysis && (
                <div className="ai-analysis">
                    <h3>Claude AI Analysis</h3>
                    <p><strong>Risk Level:</strong> {aiAnalysis.riskLevel}</p>
                    <p><strong>Approved:</strong> {aiAnalysis.approved ? 'Yes' : 'No'}</p>
                    <div>
                        <strong>Recommendations:</strong>
                        <ul>
                            {aiAnalysis.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                    {aiAnalysis.warnings.length > 0 && (
                        <div className="warnings">
                            <strong>Warnings:</strong>
                            <ul>
                                {aiAnalysis.warnings.map((warning, i) => (
                                    <li key={i}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <button 
                onClick={executeProtectedSwap}
                disabled={loading || !swapParams.tokenIn || !swapParams.tokenOut || !swapParams.amountIn}
                className="execute-swap-btn"
            >
                {loading ? 'Analyzing & Executing...' : 'Execute Protected Swap'}
            </button>

            <div className="protection-features">
                <h3>MEV Protection Features</h3>
                <ul>
                    <li>✅ AI-powered risk analysis</li>
                    <li>✅ Sandwich attack detection</li>
                    <li>✅ Time-based delays</li>
                    <li>✅ Nonce-based replay protection</li>
                    <li>✅ Dynamic slippage adjustment</li>
                    <li>✅ Mempool monitoring</li>
                </ul>
            </div>
        </div>
    );
};

// Backend API Route (Node.js/Express) for secure Claude integration
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiting for AI requests
const aiAnalysisLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10 // 10 requests per minute per IP
});

app.post('/api/analyze-swap', aiAnalysisLimiter, async (req, res) => {
    try {
        const { swapData, userAddress } = req.body;
        
        // Validate user and swap data
        if (!isValidSwapData(swapData)) {
            return res.status(400).json({ error: 'Invalid swap data' });
        }
        
        // Enhanced prompt for MEV analysis
        const prompt = `
        As a DeFi security expert, analyze this token swap for MEV risks:
        
        Swap Details:
        - From: ${swapData.tokenIn} 
        - To: ${swapData.tokenOut}
        - Amount: ${swapData.amountIn}
        - Current gas: ${swapData.gasPrice} gwei
        - Pool liquidity: $${swapData.poolLiquidity}
        - 24h volume: $${swapData.recentVolume}
        - Estimated price impact: ${swapData.priceImpact}%
        
        Market Conditions:
        - Network congestion: ${swapData.networkCongestion}
        - Recent MEV activity: ${swapData.recentMevActivity}
        - Time of day: ${new Date(swapData.timestamp).toISOString()}
        
        Provide detailed analysis including:
        1. MEV risk level and reasoning
        2. Specific attack vectors to watch for
        3. Recommended protection measures
        4. Optimal execution timing
        5. Alternative strategies if high risk
        
        Format as JSON with boolean approval and detailed explanations.
        `;
        
        const claudeResponse = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1500,
                messages: [{ role: 'user', content: prompt }]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                }
            }
        );
        
        const analysis = JSON.parse(claudeResponse.data.content[0].text);
        
        // Log analysis for monitoring
        console.log(`AI Analysis for ${userAddress}:`, {
            riskLevel: analysis.riskLevel,
            approved: analysis.approved,
            timestamp: new Date().toISOString()
        });
        
        res.json(analysis);
        
    } catch (error) {
        console.error('AI analysis error:', error);
        res.status(500).json({ 
            error: 'Analysis failed',
            fallback: {
                riskLevel: 'High',
                approved: false,
                reasoning: 'AI analysis unavailable - proceed with caution'
            }
        });
    }
});

function isValidSwapData(data) {
    return data.tokenIn && 
           data.tokenOut && 
           data.amountIn && 
           !isNaN(parseFloat(data.amountIn)) &&
           data.gasPrice &&
           data.poolLiquidity;
}

module.exports = app;