document.addEventListener('DOMContentLoaded', function() {
    const trendsCtx = document.getElementById('trendsChart').getContext('2d');

    // Initialize chart with multiple datasets
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

    // Fetch sales data from the backend
    async function fetchSalesData() {
        try {
            const response = await fetch('http://localhost:5050/api/v1/sales');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const salesData = await response.json();

            // Process data to group by flavor and day
            const { labels, datasets } = processSalesData(salesData);

            // Update chart with processed data
            updateChart(labels, datasets);
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

        return { labels, datasets };
    }

    // Function to update chart data
    function updateChart(labels, datasets) {
        trendsChart.data.labels = labels;
        trendsChart.data.datasets = datasets;
        trendsChart.update();
    }

    // Load data and update chart
    fetchSalesData();
});
