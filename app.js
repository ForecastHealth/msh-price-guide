let data;

// Fetch the data from the JSON file
fetch('msh_price_guide.json')
    .then(response => response.json())
    .then(json => {
        data = json;
        // Initialize Fuse.js after the data is loaded
        const options = {
            keys: ['Description', 'ATC Code'], // replace with your column names
            threshold: 0.2 // adjust for your desired "fuzziness"
        };
        const fuse = new Fuse(data, options);

        // Add an event listener to the search button
        document.getElementById('search-button').addEventListener('click', (e) => {
            const searchString = document.getElementById('search').value;
            const results = fuse.search(searchString);
            displayResults(results);
        });
    });

// Function to display results
function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    // Create table headers based on the first result item
    if (results.length > 0) {
        const headers = Object.keys(results[0].item);
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        resultsContainer.appendChild(thead);
    }

    // Loop through each result and add it to the results container
    for (let item of results) {
        const tr = document.createElement('tr');
        for (let key in item.item) {
            const td = document.createElement('td');
            td.textContent = item.item[key];
            tr.appendChild(td);
        }
        resultsContainer.appendChild(tr);
    }
}
