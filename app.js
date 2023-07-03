let data;
let timeoutId = null;
let results = [];
let sortColumn = null;
let sortDescending = false;
const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_DELAY = 300; // in milliseconds

// Fetch the data from the JSON file
// Fetch the data from the JSON file
fetch('msh_price_guide.json')
    .then(response => response.json())
    .then(json => {
        data = json.map(item => Object.values(item));  // transform your data into an array of arrays
        $('#results').DataTable({
            data: data,
            response: true,
            scrollX: true, // for horizontal scrolling
            scrollY: '50vh', // for vertical scrolling. '50vh' means 50% of the viewport height.
            scrollCollapse: true,
            // columnDefs property can be used if you need to customize specific columns
            // for example, it can be used to disable searching or sorting for certain columns
            columnDefs: []
        });
    });


// Function to display results
function displayResults(results) {
    const resultsContainer = $('#results');
    resultsContainer.empty(); // Clear previous results

    // Create table headers based on the first result item
    if (results.length > 0) {
        const headers = Object.keys(results[0].item);
        const thead = $('<thead></thead>');
        const headerRow = $('<tr></tr>');
        headers.forEach(header => {
            const th = $('<th></th>');
            th.text(header);
            headerRow.append(th);
        });
        thead.append(headerRow);
        resultsContainer.append(thead);
    }

    // Loop through each result and add it to the results container
    for (let item of results) {
        const tr = $('<tr></tr>');
        for (let key in item.item) {
            const td = $('<td></td>');
            td.text(item.item[key]);
            tr.append(td);
        }
        resultsContainer.append(tr);
    }

    // Convert the table to a DataTable
    resultsContainer.DataTable();
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

