document.addEventListener('DOMContentLoaded', function() {
    const trendsCtx = document.getElementById('trendsChart').getContext('2d');
    const topSellingCtx = document.getElementById('topSellingChart').getContext('2d'); 

    const trendsChart = new Chart(trendsCtx, {
        type: 'line',
        data: {
            labels: [], 
            datasets: [] 
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

    
    const topSellingChart = new Chart(topSellingCtx, {
        type: 'bar',
        data: {
            labels: [], 
            datasets: [{
                label: 'Top Selling Products',
                data: [], 
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

  
    async function fetchSalesData() {
        try {
            const response = await fetch('http://localhost:5050/api/v1/sales');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const salesData = await response.json();

            
            const { labels, datasets, topSellingItems, topSellingData } = processSalesData(salesData);

            updateChart(labels, datasets);
            updateTopSellingChart(topSellingItems, topSellingData); 
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    }

    function processSalesData(salesData) {
        const salesByDayAndFlavor = {};
        const totalSalesByFlavor = {}; 

        salesData.forEach(sale => {
            const day = new Date(sale.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
            if (!salesByDayAndFlavor[day]) {
                salesByDayAndFlavor[day] = {};
            }

            const flavor = sale.product;
            salesByDayAndFlavor[day][flavor] = (salesByDayAndFlavor[day][flavor] || 0) + sale.quantity;

            totalSalesByFlavor[flavor] = (totalSalesByFlavor[flavor] || 0) + sale.quantity;
        });

        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const flavors = Array.from(new Set(salesData.map(sale => sale.product)));

        const datasets = flavors.map((flavor, index) => ({
            label: flavor,
            data: labels.map(day => salesByDayAndFlavor[day]?.[flavor] || 0),
            backgroundColor: `rgba(${54 + index * 30}, ${162 - index * 20}, 235, 0.2)`,
            borderColor: `rgba(${54 + index * 30}, ${162 - index * 20}, 235, 1)`,
            borderWidth: 2,
            tension: 0.3
        }));


        const topSellingItems = Object.entries(totalSalesByFlavor)
            .sort((a, b) => b[1] - a[1]) 
            .slice(0, 5) 
            .map(item => item[0]); // 

        const topSellingData = topSellingItems.map(item => totalSalesByFlavor[item]);

        return { labels, datasets, topSellingItems, topSellingData };
    }

    function updateChart(labels, datasets) {
        trendsChart.data.labels = labels;
        trendsChart.data.datasets = datasets;
        trendsChart.update();
    }

    function updateTopSellingChart(topSellingItems, topSellingData) {
        topSellingChart.data.labels = topSellingItems;
        topSellingChart.data.datasets[0].data = topSellingData;
        topSellingChart.update();
    }

    fetchSalesData();
});
