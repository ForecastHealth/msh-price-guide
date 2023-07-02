let data;
let timeoutId = null;
let results = [];
let sortColumn = null;
let sortDescending = false;
const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_DELAY = 300; // in milliseconds

// Fetch the data from the JSON file
fetch('msh_price_guide.json')
    .then(response => response.json())
    .then(json => {
        data = json;
        // Initialize Fuse.js after the data is loaded
        const options = {
            keys: ['Description'], // replace with your column names
            threshold: 0.2 // adjust for your desired "fuzziness"
        };
        const fuse = new Fuse(data, options);

        // Add an event listener to the search input
        document.getElementById('search').addEventListener('input', (e) => {
            // Clear any existing timeout
            clearTimeout(timeoutId);

            // Start a new timeout
            timeoutId = setTimeout(() => {
                const searchString = e.target.value;

                // Only search if the search string is long enough
                if (searchString.length >= MIN_SEARCH_LENGTH) {
                    results = fuse.search(searchString);
                    displayResults(results);
                } else {
                    results = [];
                    displayResults([]); // clear the results
                }
            }, DEBOUNCE_DELAY);
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
            th.addEventListener('click', () => {
                if (sortColumn === header) {
                    sortDescending = !sortDescending; // reverse the sort direction
                } else {
                    sortColumn = header;
                    sortDescending = false;
                }
                sortResults(sortColumn, sortDescending);
                displayResults(results);
            });
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

// Function to sort results
function sortResults(column, descending) {
    results.sort((a, b) => {
        const aValue = a.item[column];
        const bValue = b.item[column];

        if (aValue < bValue) return descending ? 1 : -1;
        if (aValue > bValue) return descending ? -1 : 1;
        return 0;
    });
}
