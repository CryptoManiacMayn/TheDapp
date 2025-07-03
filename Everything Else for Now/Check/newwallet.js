        // Mock wallet state
        let isWalletConnected = false;
        let currentNetwork = 'base';

        // Network configurations
        const networks = {
            base: { name: 'Base', chainId: 8453, connected: true },
            ethereum: { name: 'Ethereum', chainId: 1, connected: false },
            arbitrum: { name: 'Arbitrum One', chainId: 42161, connected: false },
            polygon: { name: 'Polygon', chainId: 137, connected: false },
            optimism: { name: 'Optimism', chainId: 10, connected: false }
        };

        function initializeNetworkSelector() {
            const networkButton = document.getElementById('networkButton');
            const networkDropdown = document.getElementById('networkDropdown');
            const chevronIcon = document.getElementById('chevronIcon');

            // Toggle dropdown
            networkButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const isActive = networkDropdown.classList.toggle('active');
                chevronIcon.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                networkDropdown.classList.remove('active');
                chevronIcon.style.transform = 'rotate(0deg)';
            });

            // Handle network selection
            const networkOptions = document.querySelectorAll('.network-option');
            networkOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const networkKey = option.dataset.network;
                    selectNetwork(networkKey);
                    networkDropdown.classList.remove('active');
                    chevronIcon.style.transform = 'rotate(0deg)';
                });
            });

            // Update network status
            updateNetworkStatus();
        }

        function selectNetwork(networkKey) {
            const network = networks[networkKey];
            if (!network) return;

            currentNetwork = networkKey;
            
            // Update current selection
            document.querySelectorAll('.network-option').forEach(option => {
                option.classList.remove('selected');
            });
            document.querySelector(`[data-network="${networkKey}"]`).classList.add('selected');

            // Update button display
            document.getElementById('networkName').textContent = network.name;
            
            // Update network status
            updateNetworkStatus();

            // If wallet is connected, trigger network switch
            if (isWalletConnected) {
                switchNetwork(network.chainId);
            }

            console.log(`Selected network: ${network.name} (Chain ID: ${network.chainId})`);
        }

        function updateNetworkStatus() {
            const networkDot = document.getElementById('networkDot');
            const network = networks[currentNetwork];
            
            // Show connected status based on whether wallet is connected to this network
            if (isWalletConnected && network.connected) {
                networkDot.classList.remove('disconnected');
            } else {
                networkDot.classList.add('disconnected');
            }
        }

        function toggleWalletConnection() {
            const walletBtn = document.getElementById('walletBtn');
            const walletBtnText = document.getElementById('walletBtnText');
            
            if (isWalletConnected) {
                // Disconnect
                isWalletConnected = false;
                walletBtn.classList.remove('connected');
                walletBtnText.textContent = 'Connect Wallet';
                
                // Reset all network connections
                Object.keys(networks).forEach(key => {
                    networks[key].connected = false;
                });
            } else {
                // Connect
                isWalletConnected = true;
                walletBtn.classList.add('connected');
                walletBtnText.textContent = '0x1234...5678';
                
                // Set current network as connected
                networks[currentNetwork].connected = true;
            }
            
            updateNetworkStatus();
        }

        async function switchNetwork(chainId) {
            if (!isWalletConnected) {
                alert('Please connect your wallet first');
                return;
            }

            try {
                // Simulate network switching
                console.log(`Switching to chain ID: ${chainId}`);
                
                // Reset all connections
                Object.keys(networks).forEach(key => {
                    networks[key].connected = false;
                });
                
                // Set new network as connected
                networks[currentNetwork].connected = true;
                updateNetworkStatus();
                
                // In a real app, you would use:
                // await window.ethereum.request({
                //     method: 'wallet_switchEthereumChain',
                //     params: [{ chainId: `0x${chainId.toString(16)}` }],
                // });
                
            } catch (error) {
                console.error('Failed to switch network:', error);
            }
        }

        function toggleTheme() {
            const body = document.body;
            const themeIcon = document.getElementById('themeIcon');
            const currentTheme = body.getAttribute('data-theme');

            if (currentTheme === 'light') {
                body.setAttribute('data-theme', 'dark');
                themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
            } else {
                body.setAttribute('data-theme', 'light');
                themeIcon.innerHTML = '<path d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM12 4V2c0-.6-.4-1-1-1s-1 .4-1 1v2c0 .6.4 1 1 1s1-.4 1-1zM12 22v-2c0-.6-.4-1-1-1s-1 .4-1 1v2c0 .6.4 1 1 1s1-.4 1-1zM20 13h2c.6 0 1-.4 1-1s-.4-1-1-1h-2c-.6 0-1 .4-1 1s.4 1 1 1zM4 13H2c-.6 0-1-.4-1-1s.4-1 1-1h2c.6 0 1 .4 1 1s-.4 1-1 1zM17.7 7.7c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4l-1.4-1.4c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l1.4 1.4zM5.6 19.8c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L5.6 17c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l1.4 1.4zM19.8 18.4c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L17 18.4c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l1.4-1.4zM7 5.6c.4-.4.4-1 0-1.4C6.6 3.8 6 3.8 5.6 4.2L4.2 5.6c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0L7 5.6z"/>';
            }
        }

        // Initialize everything when page loads
        document.addEventListener('DOMContentLoaded', () => {
            initializeNetworkSelector();
            
            // Add click handler for wallet button
            document.getElementById('walletBtn').addEventListener('click', toggleWalletConnection);
        });