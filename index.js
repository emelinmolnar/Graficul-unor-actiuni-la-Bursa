let values = [];
let dates = [];

async function callAPI() {
    const stockName = document.getElementById("inputStock").value;
    const API_Key = 'DHE289O3YLGE9ZLP';
    let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockName}&interval=60min&apikey=${API_Key}`;
    try {
        const response = await fetch(API_Call);
        if(response.ok) {
            const data = await response.json();
            console.log("data = " + data);
            const arrayOfAllValues = (Object.keys(Object.entries(data)[1][1]));
            console.log("arrayOfAllValues = " + arrayOfAllValues);
            dates.push(arrayOfAllValues[0]);
            for(let i = 10; i >= 1; i--) {
                dates.push(arrayOfAllValues[Math.floor((arrayOfAllValues.length - 1) / i)]);
             }
            console.log("dates = " + dates);
        
            for(let i = 0; i <= 10; i++) {
                values.push(parseFloat(data['Time Series (60min)'][dates[i]]['1. open']));
            }
            console.log("data['Time Series (60min)'][dates[0]]['1. open'] = " + data['Time Series (60min)'][dates[0]]['1. open']);
            console.log("Values = " + values);
        } else {
            throw new Error('Request Failed');
        }
    } catch(error) {
        console.log(error);
    }

}

async function drawChart() {
    await callAPI();
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.reverse(),
            datasets: [{
                label: document.getElementById("inputStock").value,
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
    });
}

function clearChart() {
    let div = document.getElementById("chartDiv");
    let elem = document.getElementById("myChart");
    div.removeChild(elem);
    let newElem = document.createElement("canvas");
    newElem.id = "myChart";
    newElem.height = "200";
    newElem.width = "200";
    div.appendChild(newElem);
    values.length = 0;
    dates.length = 0;
}