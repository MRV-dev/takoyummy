document.addEventListener("DOMContentLoaded", function () {
    const salesTableBody = document.getElementById("salesTableBody");
    const filterDateInput = document.getElementById("filterDate");
    const paginationControls = document.getElementById("paginationControls");

    let filteredData = [];
    let currentPage = 1;
    const rowsPerPage = 6;

    const renderTable = (data, page = 1) => {
        salesTableBody.innerHTML = "";
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = data.slice(start, end);

        if (paginatedData.length === 0) {
            salesTableBody.innerHTML = '<tr><td colspan="5">No sales data available</td></tr>';
            return;
        }

        paginatedData.forEach(sale => {
            const row = `
                <tr>
                    <td>${new Date(sale.createdAt).toLocaleDateString()}</td>
                    <td>${sale.product}</td>
                    <td>₱${sale.price.toFixed(2)}</td>
                    <td>${sale.quantity}</td>
                    <td>₱${(sale.price * sale.quantity).toFixed(2)}</td>
                </tr>
            `;
            salesTableBody.innerHTML += row;
        });

        renderPagination(data.length);
    };

    const renderPagination = (totalRows) => {
        paginationControls.innerHTML = "";
        const totalPages = Math.ceil(totalRows / rowsPerPage);

        const createButton = (text, disabled, onClick) => {
            const button = document.createElement("button");
            button.textContent = text;
            button.className = "btn btn-secondary btn-sm mx-1";
            button.disabled = disabled;
            button.addEventListener("click", onClick);
            return button;
        };

        paginationControls.appendChild(
            createButton("Previous", currentPage === 1, () => {
                currentPage--;
                renderTable(filteredData, currentPage);
            })
        );

        paginationControls.appendChild(
            createButton("Next", currentPage === totalPages, () => {
                currentPage++;
                renderTable(filteredData, currentPage);
            })
        );
    };

    fetch("http://localhost:5050/api/v1/sales")
        .then(response => response.json())
        .then(data => {
            filteredData = data;
            renderTable(filteredData);

            filterDateInput.addEventListener("input", () => {
                const selectedDate = new Date(filterDateInput.value);
                filteredData = data.filter(sale => {
                    const saleDate = new Date(sale.createdAt);
                    return saleDate.toDateString() === selectedDate.toDateString();
                });
                currentPage = 1;
                renderTable(filteredData, currentPage);
            });
        })
        .catch(error => {
            console.error("Error fetching sales data:", error);
            salesTableBody.innerHTML = `<tr><td colspan="5">Failed to load sales data: ${error.message}</td></tr>`;
        });
});