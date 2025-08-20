
function incrementQuantity(button) {
    const quantitySpan = button.closest('tr').querySelector('.quantity');
    let currentQuantity = parseInt(quantitySpan.textContent);
    currentQuantity++;
    quantitySpan.textContent = currentQuantity;
    updateStatus(quantitySpan, currentQuantity);
}

function decrementQuantity(button) {
    const quantitySpan = button.closest('tr').querySelector('.quantity');
    let currentQuantity = parseInt(quantitySpan.textContent);
    
    if (currentQuantity > 0) {
        currentQuantity--;
        quantitySpan.textContent = currentQuantity;
        updateStatus(quantitySpan, currentQuantity);
    }
}

function updateStatus(quantitySpan, quantity) {
    const statusCell = quantitySpan.closest('tr').querySelector('.status');
    
    if (quantity > 0) {
        statusCell.textContent = 'In-stock';
        statusCell.classList.remove('out-of-stock');
        statusCell.classList.add('in-stock');
    } else {
        statusCell.textContent = 'Out of stock';
        statusCell.classList.remove('in-stock');
        statusCell.classList.add('out-of-stock');
    }
}