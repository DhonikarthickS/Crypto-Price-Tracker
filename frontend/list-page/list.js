document.addEventListener("DOMContentLoaded", async function () {
    const cryptoApiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
    const forexApiUrlBase = 'https://api.exchangerate-api.com/v4/latest/USD'; // Reliable exchange rate API
    let exchangeRate = 1; // Default exchange rate (USD)
    let targetCurrency = 'USD'; // Default currency
    let cryptoData = []; // Store fetched cryptocurrency data

    async function fetchTopCryptos() {
        try {
            const response = await fetch(cryptoApiUrl);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            cryptoData = await response.json(); // Store data for reuse
            updateCryptoList();

        } catch (error) {
            console.error('Error fetching cryptocurrency data:', error);
        }
    }

    async function fetchExchangeRate(newCurrency) {
        try {
            if (newCurrency === 'USD') {
                exchangeRate = 1; // Reset to USD values
                targetCurrency = 'USD';
                updateCryptoList();
                return;
            }

            const response = await fetch(forexApiUrlBase);
            if (!response.ok) throw new Error(`Forex API Error! Status: ${response.status}`);

            const data = await response.json();
            console.log("Forex API Response:", data); // Debugging log

            if (data.rates && data.rates[newCurrency]) {
                exchangeRate = parseFloat(data.rates[newCurrency]); // Get correct USD → Target currency rate
                targetCurrency = newCurrency;
                updateCryptoList();
            } else {
                alert("Invalid currency code or data not available.");
            }

        } catch (error) {
            console.error('Error fetching exchange rate:', error);
        }
    }

    function updateCryptoList() {
        const coinListDiv = document.querySelector('.coin-list');
        coinListDiv.innerHTML = ''; // Clear existing content

        // Sort cryptocurrencies in descending order based on converted price
        const sortedCryptos = [...cryptoData].sort((a, b) => 
            (b.current_price * exchangeRate) - (a.current_price * exchangeRate)
        );

        sortedCryptos.forEach(coin => {
            const convertedPrice = (coin.current_price * exchangeRate).toFixed(2); // Correct conversion

            const coinDiv = document.createElement('div');
            coinDiv.classList.add('coin');

            coinDiv.innerHTML = 
                `<img src="${coin.image}" alt="${coin.name}" width="50" height="50">
                <div>
                    <p><strong>${targetCurrency}:</strong> ${convertedPrice} ${targetCurrency}</p>
                    <p>${coin.name}</p>
                </div>`;

            coinListDiv.appendChild(coinDiv);
        });
    }

    // Event Listener for Convert Button
    document.getElementById('convert-btn').addEventListener('click', () => {
        const selectedCurrency = document.getElementById('currency-select').value;
        fetchExchangeRate(selectedCurrency);
    });

    // Initial load with USD values only
    await fetchTopCryptos();
});

updateCryptoList();
