document.addEventListener("DOMContentLoaded", () => {
    let total = 0;
    const orderDetails = [];
    const orderSummaryList = document.getElementById("order-summary-list");
    const totalDisplay = document.querySelector(".total");
    const submitButton = document.getElementById("submitOrder");
    const paymentInput = document.querySelector(".input1");
    const changeDisplay = document.querySelector(".change");

    let lastCalculatedChange = null;

    document.querySelectorAll(".product-card").forEach((card) => {
        const addButton = card.querySelector(".add");
        const minusButton = card.querySelector(".minus");
        const quantityDisplay = card.querySelector(".product-quantity");
        const price = parseFloat(card.querySelector(".price").textContent);
        const productName = card.querySelector("p").textContent.trim();

        let quantity = 0;

        addButton.addEventListener("click", () => {
            quantity++;
            quantityDisplay.textContent = quantity;
            updateOrder(productName, price, quantity);
        });

        minusButton.addEventListener("click", () => {
            if (quantity > 0) {
                quantity--;
                quantityDisplay.textContent = quantity;
                updateOrder(productName, price, quantity);
            }
        });
    });

    function updateOrder(productName, price, quantity) {
        const existingOrder = orderDetails.find((item) => item.name === productName);

        if (existingOrder) {
            if (quantity > 0) {
                existingOrder.quantity = quantity;
                existingOrder.totalPrice = quantity * price;
            } else {
                const index = orderDetails.indexOf(existingOrder);
                orderDetails.splice(index, 1);
            }
        } else if (quantity > 0) {
            orderDetails.push({ name: productName, quantity, totalPrice: quantity * price });
        }

        renderOrderSummary();
    }

    function renderOrderSummary() {
        orderSummaryList.innerHTML = ""; 
        total = 0;

        orderDetails.forEach((item) => {
            total += item.totalPrice;
            const itemElement = document.createElement("div");
            itemElement.classList.add("order-item");
            itemElement.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>₱${item.totalPrice.toFixed(2)}</span>
            `;
            orderSummaryList.prepend(itemElement);  
        });

        totalDisplay.textContent = `Total: ₱${total.toFixed(2)}`;
    }

    paymentInput.addEventListener("input", () => {
        const payment = parseFloat(paymentInput.value);
        if (isNaN(payment) || payment < total) {
            changeDisplay.textContent = `Change: ₱0.00`;
            lastCalculatedChange = null;
        } else {
            const change = payment - total;
            changeDisplay.textContent = `Change: ₱${change.toFixed(2)}`;
            lastCalculatedChange = change;
        }
    });

   
    submitButton.addEventListener("click", () => {
        const payment = parseFloat(paymentInput.value);

        if (isNaN(payment) || payment < total) {
            alert("Invalid or insufficient payment.");
            return;
        }


        const saleData = {
            items: orderDetails.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.totalPrice / item.quantity,
            })),
            totalPrice: total,
            payment: payment,
            change: lastCalculatedChange !== null ? lastCalculatedChange : (payment - total),
        };

        fetch('http://localhost:5050/api/pos/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(saleData),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Sale submitted:", data);
            alert("Order submitted successfully!");
            resetPOS();  
        })
        .catch(error => {
            console.error("Error submitting sale:", error);
            alert("Failed to submit sale.");
        });
    });

    function resetPOS() {
        orderDetails.length = 0;  
        total = 0;                
        lastCalculatedChange = null;
        

        orderSummaryList.innerHTML = "";
        totalDisplay.textContent = `Total: ₱0.00`;
        paymentInput.value = "";  
        changeDisplay.textContent = `Change: ₱0.00`; 

        
        document.querySelectorAll(".product-card").forEach((card) => {
            const quantityDisplay = card.querySelector(".product-quantity");
            quantityDisplay.textContent = '0';  
        });
    }
});
