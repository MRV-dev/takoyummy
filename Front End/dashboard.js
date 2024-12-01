document.addEventListener('DOMContentLoaded', function() {
    const trendsCtx = document.getElementById('trendsChart').getContext('2d');
    const topSellingCtx = document.getElementById('topSellingChart').getContext('2d'); // For top-selling items bar chart

    // Initialize the sales trends line chart
    const trendsChart = new Chart(trendsCtx, {
        type: 'line',
        data: {
            labels: [], // Days of the week will be added dynamically
            datasets: [] // Datasets for each flavor will be added dynamically
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantity Sold'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Days of the Week'
                    }
                }
            }
        }
    });

    // Initialize the top-selling items bar chart
    const topSellingChart = new Chart(topSellingCtx, {
        type: 'bar',
        data: {
            labels: [], // Product names will be added dynamically
            datasets: [{
                label: 'Top Selling Products',
                data: [], // Total sales per product will be added dynamically
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantity Sold'
                    }
                }
            }
        }
    });

    // Fetch sales data from the backend
    async function fetchSalesData() {
        try {
            const response = await fetch('http://localhost:5050/api/v1/sales');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const salesData = await response.json();

            // Process data to group by flavor and day
            const { labels, datasets, topSellingItems, topSellingData } = processSalesData(salesData);

            // Update chart with processed data
            updateChart(labels, datasets);
            updateTopSellingChart(topSellingItems, topSellingData); // Update the top-selling chart
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    }

    // Function to process sales data
    function processSalesData(salesData) {
        const salesByDayAndFlavor = {};
        const totalSalesByFlavor = {}; // To track total quantity per flavor

        // Initialize structure
        salesData.forEach(sale => {
            const day = new Date(sale.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
            if (!salesByDayAndFlavor[day]) {
                salesByDayAndFlavor[day] = {};
            }

            const flavor = sale.product;
            salesByDayAndFlavor[day][flavor] = (salesByDayAndFlavor[day][flavor] || 0) + sale.quantity;

            // Track total sales by flavor
            totalSalesByFlavor[flavor] = (totalSalesByFlavor[flavor] || 0) + sale.quantity;
        });

        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const flavors = Array.from(new Set(salesData.map(sale => sale.product)));

        // Prepare datasets for each flavor
        const datasets = flavors.map((flavor, index) => ({
            label: flavor,
            data: labels.map(day => salesByDayAndFlavor[day]?.[flavor] || 0),
            backgroundColor: `rgba(${54 + index * 30}, ${162 - index * 20}, 235, 0.2)`,
            borderColor: `rgba(${54 + index * 30}, ${162 - index * 20}, 235, 1)`,
            borderWidth: 2,
            tension: 0.3
        }));

        // Sort products by total sales and prepare the top-selling items list
        const topSellingItems = Object.entries(totalSalesByFlavor)
            .sort((a, b) => b[1] - a[1]) // Sort by quantity sold
            .slice(0, 5) // Top 5 products
            .map(item => item[0]); // Get only product names

        const topSellingData = topSellingItems.map(item => totalSalesByFlavor[item]);

        return { labels, datasets, topSellingItems, topSellingData };
    }

    // Function to update the trends chart
    function updateChart(labels, datasets) {
        trendsChart.data.labels = labels;
        trendsChart.data.datasets = datasets;
        trendsChart.update();
    }

    // Function to update the top-selling chart
    function updateTopSellingChart(topSellingItems, topSellingData) {
        topSellingChart.data.labels = topSellingItems;
        topSellingChart.data.datasets[0].data = topSellingData;
        topSellingChart.update();
    }

    // Load data and update charts
    fetchSalesData();
});
