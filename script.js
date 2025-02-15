var btc = document.getElementById("bitcoin");
var eth = document.getElementById("ethereum");
var doge = document.getElementById("dogecoin");

// Fetch Bitcoin, Ethereum, and Dogecoin prices
async function fetchCryptoPrices() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd");
        
        if (!response.ok) {
            throw new Error("Failed to fetch crypto prices!");
        }

        const data = await response.json();
        
        btc.innerHTML = `$${data.bitcoin?.usd || "N/A"}`;
        eth.innerHTML = `$${data.ethereum?.usd || "N/A"}`;
        doge.innerHTML = `$${data.dogecoin?.usd || "N/A"}`;
        
    } catch (error) {
        console.error("Error fetching crypto prices:", error);
    }
}

// Fetch specific cryptocurrency based on user input
async function fetchData() {
    try {
        const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
        const searchprice = document.getElementById("searchprice");
        const searchName = document.getElementById("searchName");
        const searchimg = document.getElementById("searchimg");

        if (!searchInput) {
            alert("Please enter a cryptocurrency name!");
            return;
        }

        const url = `https://api.coingecko.com/api/v3/coins/${searchInput}`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Could not fetch cryptocurrency data!");
        }

        const data = await response.json();

        if (data) {
            searchimg.src = data.image.large;
            searchimg.style.display = "inline";
            searchName.textContent = data.name;
            searchprice.textContent = `$${data.market_data.current_price.usd}`;
        } else {
            searchName.textContent = "Crypto not found!";
            searchprice.textContent = "";
            searchimg.style.display = "none";
        }

    } catch (error) {
        console.error("Error:", error);
        searchName.textContent = "Crypto not found!";
        searchprice.textContent = "";
        document.getElementById("searchimg").style.display = "none";
    }
}

// Event listener for search button
document.getElementById("searchBtn").addEventListener("click", fetchData);

// Call the function to load initial crypto prices
fetchCryptoPrices();
