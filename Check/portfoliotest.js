



        async function loadPortfolioData() {
            if (!isWalletConnected()) {
                console.log('No wallet connected for portfolio data');
                return;
            }

            try {
                console.log('Loading portfolio data for:', userAccount);

                // Get ETH balance
                const balance = await provider.getBalance(userAccount);
                const ethBalance = ethers.formatEther(balance);
                const ethPrice = 2400; // Mock price for demo
                const ethValue = parseFloat(ethBalance) * ethPrice;

                // Get network info
                const network = await provider.getNetwork();
                console.log('Connected to network:', network.name);

                // Update portfolio cards
                document.getElementById('totalValue').textContent = `$${ethValue.toFixed(2)}`;
                document.getElementById('totalChange').textContent = '+$23.45 (0.97%)';
                document.getElementById('totalStaked').textContent = `$${(ethValue * 0.3).toFixed(2)}`;
                document.getElementById('stakedRewards').textContent = '+$12.34 rewards';
                document.getElementById('totalLending').textContent = `$${(ethValue * 0.2).toFixed(2)}`;
                document.getElementById('lendingAPY').textContent = '4.25% APY';
                document.getElementById('totalYield').textContent = `$${(ethValue * 0.15).toFixed(2)}`;
                document.getElementById('yieldAPY').textContent = '8.5% APY';

                // Update assets table
                const assetsTableBody = document.getElementById('assetsTableBody');
                assetsTableBody.innerHTML = `
                    <tr>
                        <td>
                            <div class="asset-info">
                                <div class="asset-icon">ETH</div>
                                <div>
                                    <div style="font-weight: 600;">Ethereum</div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary);">ETH</div>
                                </div>
                            </div>
                        </td>
                        <td>${parseFloat(ethBalance).toFixed(4)} ETH</td>
                        <td>$${ethValue.toFixed(2)}</td>
                        <td class="positive">+2.34%</td>
                        <td>${ethValue > 0 ? '100%' : '0%'}</td>
                    </tr>
                    ${
                        ethValue > 0
                            ? `
                    <tr>
                        <td>
                            <div class="asset-info">
                                <div class="asset-icon">USDC</div>
                                <div>
                                    <div style="font-weight: 600;">USD Coin</div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary);">USDC</div>
                                </div>
                            </div>
                        </td>
                        <td>0.00 USDC</td>
                        <td>$0.00</td>
                        <td class="positive">+0.01%</td>
                        <td>0%</td>
                    </tr>`
                            : ''
                    }
                `;

                console.log('Portfolio data loaded successfully');
                showMessage('Portfolio data updated!', 'success');
            } catch (error) {
                console.error('Failed to load portfolio data:', error);
                showMessage('Failed to load portfolio data: ' + error.message, 'error');
                clearPortfolioData();
            }
        }
                async function loadStakingData() {
            if (!isWalletConnected()) {
                console.log('No wallet connected for staking data');
                return;
            }

            try {
                // Mock staking data
                const balance = await provider.getBalance(userAccount);
                const ethBalance = ethers.formatEther(balance);
                const ethPrice = 2400; // Mock price for demo
                const ethValue = parseFloat(ethBalance) * ethPrice;

                // Update staking table
                const stakingTableBody = document.getElementById('stakingTableBody');
                if (ethValue > 0) {
                    stakingTableBody.innerHTML = `
                        <tr>
                            <td>
                                <div class="asset-info">
                                    <div class="asset-icon">ETH</div>
                                    <div>
                                        <div style="font-weight: 600;">Ethereum</div>
                                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Staked ETH</div>
                                    </div>
                                </div>
                            </td>
                            <td>${(parseFloat(ethBalance) * 0.3).toFixed(4)} ETH</td>
                            <td>$${(ethValue * 0.3).toFixed(2)}</td>
                            <td class="positive">+0.0056 ETH</td>
                            <td>
                                <button class="staking-btn" style="padding: 6px 12px; font-size: 0.8rem;">Claim</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="asset-info">
                                    <div class="asset-icon">stETH</div>
                                    <div>
                                        <div style="font-weight: 600;">Liquid Staked ETH</div>
                                        <div style="font-size: 0.8rem; color: var(--text-secondary);">stETH</div>
                                    </div>
                                </div>
                            </td>
                            <td>${(parseFloat(ethBalance) * 0.2).toFixed(4)} stETH</td>
                            <td>$${(ethValue * 0.2).toFixed(2)}</td>
                            <td class="positive">+0.0032 stETH</td>
                            <td>
                                <button class="staking-btn" style="padding: 6px 12px; font-size: 0.8rem;">Unstake</button>
                            </td>
                        </tr>
                    `;
                } else {
                    stakingTableBody.innerHTML = `
                        <tr>
                            <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 40px; font-size: 1.1rem;">
                                <div style="margin-bottom: 10px">🔄 No staked assets found</div>
                                <div style="font-size: 0.9rem; opacity: 0.8">Stake your assets to start earning rewards</div>
                            </td>
                        </tr>
                    `;
                }

                console.log('Staking data loaded successfully');
            } catch (error) {
                console.error('Failed to load staking data:', error);
                showMessage('Failed to load staking data: ' + error.message, 'error');
                clearStakingData();
            }
        }

        // Data clearing functions
        function clearAllData() {
            clearPortfolioData();
            clearStakingData();
        }

        function clearPortfolioData() {
            // Reset to default values
            document.getElementById('totalValue').textContent = '$0.00';
            document.getElementById('totalChange').textContent = '+$0.00 (0.00%)';
            document.getElementById('totalStaked').textContent = '$0.00';
            document.getElementById('stakedRewards').textContent = '+$0.00 rewards';
            document.getElementById('totalLending').textContent = '$0.00';
            document.getElementById('lendingAPY').textContent = '0.00% APY';
            document.getElementById('totalYield').textContent = '$0.00';
            document.getElementById('yieldAPY').textContent = '0.00% APY';

            const assetsTableBody = document.getElementById('assetsTableBody');
            assetsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 40px; font-size: 1.1rem;">
                        <div style="margin-bottom: 10px;">🔒 Connect your wallet to view your portfolio</div>
                        <div style="font-size: 0.9rem; opacity: 0.8;">Your assets and balances will appear here once connected</div>
                    </td>
                </tr>
            `;
        }

        // Message display function
        function showMessage(message, type) {
            const portfolioStatus = document.getElementById('portfolioStatus');
            const existingMessage = portfolioStatus.querySelector('.success-message, .error-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
            messageDiv.textContent = message;
            portfolioStatus.appendChild(messageDiv);

            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }