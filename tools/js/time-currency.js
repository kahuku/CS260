async function onClick(e){
    e.preventDefault();

    //get form values
    let quantity = document.getElementById("inputQuantityBox").value;
    quantity = parseFloat(quantity);
    if (Number.isNaN(quantity)){
        quantity = 1.00;
    }
    let baseBox = document.getElementById("base");
    let base = baseBox.value;
    let targetBox = document.getElementById("target");
    let target = targetBox.value;
    let keyC = "9f5acb6a3626465a2d3ed46a";
    let stockKey = "API_KEY18V515JWMSHCRI406PTK6WDUSIRNUDXK";

    //set of currency api values
    let currencyArray = ["GHS", "EUR", "AOA", "AUD", "BRL", "HKD", "ILS", "INR", "JPY", "MXN", "NZD", "TWD", "CAD"];
    let currencySet = new Set(currencyArray);
    let cryptoArray = ["bitcoin", "ethereum", "stellar", "litecoin", "dogecoin", "basic-attention-token"];
    let cryptoSet = new Set(cryptoArray);
    let stockArray = ["AAPL", "TSLA", "SPY", "MCD", "PLUG", "AMZN"];
    let stockSet = new Set(stockArray);
    

    //output key values
    console.log(quantity, base, target);

    //get in-between rates
    //TODO- rate functions- add currencies outside of this API
    let rate1 = await getRate1(base, keyC, currencySet, cryptoSet, stockKey, stockSet);
    let rate2 = await getRate2(target, keyC, currencySet, cryptoSet, stockKey, stockSet);

    console.log(rate1, rate2);
    //get true rate
    let rate = rate1 * rate2;

    //get the converted quantity
    let convertedQuantity = quantity * rate;

    //update the page
    updateResult(base, target, quantity, convertedQuantity);
}

async function getRate1(base, keyC, currencySet, cryptoSet, stockKey, stockSet){
    let rateToUSD = -1;


    if (currencySet.has(base)){
        //setup url
        let url = "https://v6.exchangerate-api.com/v6/" + keyC + "/pair/" + base + "/USD";

        //call API
        await fetch(url)
            .then(function(response){
                if (response.status != 200){
                    return {
                        text: "Error calling API"
                    }
                }
                return response.json();
            }).then(function(json){
                // console.log(json);
                rateToUSD = json.conversion_rate;
            });
    }
    else if (base === "USD"){
        rateToUSD = 1;
    }
    else if (cryptoSet.has(base)){
        let url = "https://api.coincap.io/v2/assets/" + base;
        
        await fetch(url)
            .then(function(response){
                if (response.status != 200){
                    return {
                        text: "Error calling API"
                    }
                }
                return response.json();
            }).then(function(json){
                rateToUSD = json.data.priceUsd;
            });
    }
    else if (stockSet.has(base)){
        let url = "https://api.finage.co.uk/last/trade/stock/" + base + "?apikey=" + stockKey;

        await fetch(url)
            .then(function(response){
                if (response.status != 200){
                    return {
                        text: "Error calling API"
                    }
                }
                return response.json();
            }).then(function(json){
                rateToUSD = json.price;
            });
    }
    else {
        if (base === "BBB"){
            rateToUSD = 6.92;
        }
        if (base === "DBL"){
            rateToUSD = 4.87;
        }
        if (base === "CSRL"){
            rateToUSD = 13.00;
        }
        if (base === "SLC"){
            rateToUSD = 8.35;
        }
        if (base === "CBV"){
            rateToUSD = 2.08;
        }
        if (base === "CNE"){
            rateToUSD = 9.82;
        }
        if (base === "MER"){
            rateToUSD = 72.54;
        }
    }
    
    return rateToUSD;
}

async function getRate2(target, keyC, currencySet, cryptoSet, stockKey, stockSet){
    let rateFromUSD = -1;

    if (currencySet.has(target)){
        let url = "https://v6.exchangerate-api.com/v6/" + keyC + "/pair/USD/" + target;
    
        await fetch(url)
            .then(function(response){
                if (response.status != 200){
                    return {
                        text: "Error calling API"
                    }
                }
                return response.json();
            }).then(function(json){
                rateFromUSD = json.conversion_rate;
            });
    }
    else if (target === "USD"){
        rateFromUSD = 1;
    }
    else if (cryptoSet.has(target)){
        let url = "https://api.coincap.io/v2/assets/" + target;
        
        await fetch(url)
            .then(function(response){
                if (response.status != 200){
                    return {
                        text: "Error calling API"
                    }
                }
                return response.json();
            }).then(function(json){
                rateFromUSD = 1 / json.data.priceUsd;
            });
    }
    else if (stockSet.has(target)){
        let url = "https://api.finage.co.uk/last/trade/stock/" + target + "?apikey=" + stockKey;

        await fetch(url)
            .then(function(response){
                if (response.status != 200){
                    return {
                        text: "Error calling API"
                    }
                }
                return response.json();
            }).then(function(json){
                rateFromUSD = 1 / json.price;
            });
    }
    else {
        if (target === "BBB"){
            rateFromUSD = 1/6.92;
        }
        if (target === "DBL"){
            rateFromUSD = 1/4.87;
        }
        if (target === "CSRL"){
            rateFromUSD = 1/13;
        }
        if (target === "SLC"){
            rateFromUSD = 1/8.35;
        }
        if (target === "CBV"){
            rateFromUSD = 1/2.08;
        }
        if (target === "CNE"){
            rateFromUSD = 1/9.82;
        }
        if (target === "MER"){
            rateFromUSD = 1/72.54;
        }
    }

    return rateFromUSD;
}

function updateResult(base, target, quantity, convertedQuantity){
    let resultBox = document.getElementById("output");
    let result = quantity.toFixed(2) + " " + base + " = " + convertedQuantity.toFixed(2) + " " + target;
    resultBox.textContent = result; 
}

function onClickSwap(e){
    e.preventDefault();

    let baseBox = document.getElementById("base");
    let base = baseBox.selectedIndex;
    let targetBox = document.getElementById("target");
    let target = targetBox.selectedIndex;
    
    document.getElementById("base").selectedIndex = target;
    document.getElementById("target").selectedIndex = base;
}

document.getElementById('Convert').addEventListener('click', onClick);
document.getElementById("Swap").addEventListener("click", onClickSwap);
//TODO: add function for swap button