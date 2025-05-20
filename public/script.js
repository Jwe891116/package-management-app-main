document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const createPackageBtn = document.getElementById('createPackageBtn');
    const trackPackageBtn = document.getElementById('trackPackageBtn');
    const managePackagesBtn = document.getElementById('managePackagesBtn');
    const createPackageSection = document.getElementById('createPackageSection');
    const trackPackageSection = document.getElementById('trackPackageSection');
    const managePackagesSection = document.getElementById('managePackagesSection');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const packageForm = document.getElementById('packageForm');
    const packageResult = document.getElementById('packageResult');
    const packageDetails = document.getElementById('packageDetails');
    const printLabelBtn = document.getElementById('printLabelBtn');
    const trackingNumberInput = document.getElementById('trackingNumberInput');
    const searchPackageBtn = document.getElementById('searchPackageBtn');
    const trackingResult = document.getElementById('trackingResult');
    const packageInfo = document.getElementById('packageInfo');
    const statusUpdateSection = document.getElementById('statusUpdateSection');
    const statusSelect = document.getElementById('statusSelect');
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    const printTrackedLabelBtn = document.getElementById('printTrackedLabelBtn');
    const deleteTrackedPackageBtn = document.getElementById('deleteTrackedPackageBtn');
    const statusFilter = document.getElementById('statusFilter');
    const shippingMethodFilter = document.getElementById('shippingMethodFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const packagesTableBody = document.getElementById('packagesTableBody');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');

    // Global variables
    let currentPage = 1;
    let totalPages = 1;
    let currentPackageType = 'one-day';
    let currentPackageData = null;
    let allPackages = [];

    // Event Listeners
    createPackageBtn.addEventListener('click', () => showSection('create'));
    trackPackageBtn.addEventListener('click', () => showSection('track'));
    managePackagesBtn.addEventListener('click', () => {
        showSection('manage');
        loadPackages();
    });

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPackageType = btn.dataset.type;
        });
    });

    packageForm.addEventListener('submit', handlePackageSubmit);
    printLabelBtn.addEventListener('click', printLabel);
    searchPackageBtn.addEventListener('click', trackPackage);
    updateStatusBtn.addEventListener('click', updatePackageStatus);
    printTrackedLabelBtn.addEventListener('click', printTrackedLabel);
    deleteTrackedPackageBtn.addEventListener('click', deleteTrackedPackage);

    applyFiltersBtn.addEventListener('click', () => {
        currentPage = 1;
        loadPackages();
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadPackages();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadPackages();
        }
    });

    // Functions
    function showSection(section) {
        createPackageSection.classList.add('hidden');
        trackPackageSection.classList.add('hidden');
        managePackagesSection.classList.add('hidden');

        if (section === 'create') {
            createPackageSection.classList.remove('hidden');
            packageForm.reset();
            packageResult.classList.add('hidden');
        } else if (section === 'track') {
            trackPackageSection.classList.remove('hidden');
            trackingResult.classList.add('hidden');
            trackingNumberInput.value = '';
        } else if (section === 'manage') {
            managePackagesSection.classList.remove('hidden');
        }
    }

    async function handlePackageSubmit(e) {
        e.preventDefault();
        const formData = {
            senderName: document.getElementById('senderName').value,
            senderAddress: document.getElementById('senderAddress').value,
            receiverName: document.getElementById('receiverName').value,
            receiverAddress: document.getElementById('receiverAddress').value,
            weight: parseFloat(document.getElementById('weight').value),
            costPerUnitWeight: parseFloat(document.getElementById('costPerUnitWeight').value),
            flatFee: parseFloat(document.getElementById('flatFee').value),
            shippingMethod: currentPackageType === 'one-day' ? 'One-Day' : 'Two-Day'
        };

        try {
            const endpoint = currentPackageType === 'one-day'
                ? '/api/packages/one-day'
                : '/api/packages/two-day';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create package');
            }

            const data = await response.json();
            currentPackageData = data.package;
            displayPackageDetails(data.package, data.trackingNumber);
            packageResult.classList.remove('hidden');
            packageForm.reset();
        } catch (error) {
            showError('Error creating package: ' + error.message);
            console.error('Error:', error);
        }
    }

    function displayPackageDetails(pkg, trackingNumber = null) {
        const totalCost = parseFloat(pkg.total_cost);
        const trackingNum = trackingNumber || pkg.tracking_number;
        packageDetails.innerHTML = `
            <p><strong>Tracking Number:</strong> ${trackingNum}</p>
            <p><strong>Status:</strong> ${pkg.status}</p>
            <p><strong>Shipping Method:</strong> ${pkg.shipping_method}</p>
            <p><strong>Sender:</strong> ${pkg.sender_name}</p>
            <p><strong>Receiver:</strong> ${pkg.receiver_name}</p>
            <p><strong>Total Cost:</strong> $${!isNaN(totalCost) ? totalCost.toFixed(2) : 'N/A'}</p>
        `;
    }

    function printLabel() {
        if (!currentPackageData) return;
        const printWindow = window.open('', '_blank');
        const totalCost = parseFloat(currentPackageData.total_cost);
        
        printWindow.document.write(`
            <html>
            <head>
                <title>Shipping Label - ${currentPackageData.tracking_number}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .label { border: 2px dashed #000; padding: 20px; max-width: 500px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .section { margin-bottom: 15px; }
                    .bold { font-weight: bold; }
                    .tracking { text-align: center; margin-top: 20px; font-size: 18px; }
                    .barcode { text-align: center; margin-top: 10px; font-family: 'Libre Barcode 128', cursive; font-size: 36px; }
                </style>
            </head>
            <body>
                <div class="label">
                    <div class="header">
                        <h2>SHIPPING LABEL</h2>
                        <p>${currentPackageData.shipping_method} Delivery</p>
                    </div>
                    <div class="section">
                        <p class="bold">FROM:</p>
                        <p>${currentPackageData.sender_name}</p>
                        <p>${currentPackageData.sender_address}</p>
                    </div>
                    <div class="section">
                        <p class="bold">TO:</p>
                        <p>${currentPackageData.receiver_name}</p>
                        <p>${currentPackageData.receiver_address}</p>
                    </div>
                    <div class="section">
                        <p><span class="bold">Weight:</span> ${currentPackageData.weight} kg</p>
                        <p><span class="bold">Cost:</span> $${!isNaN(totalCost) ? totalCost.toFixed(2) : 'N/A'}</p>
                    </div>
                    <div class="tracking">
                        <p class="bold">TRACKING NUMBER</p>
                        <p>${currentPackageData.tracking_number}</p>
                    </div>
                    <div class="barcode">
                        *${currentPackageData.tracking_number}*
                    </div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    async function trackPackage() {
        const trackingNumber = trackingNumberInput.value.trim();
        if (!trackingNumber) {
            showError('Please enter a tracking number');
            return;
        }

        try {
            const localPackage = allPackages.find(pkg => pkg.tracking_number === trackingNumber);
            if (localPackage) {
                currentPackageData = localPackage;
                displayTrackedPackage(localPackage);
                return;
            }

            const response = await fetch(`/api/packages/${trackingNumber}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Package not found');
            }

            const data = await response.json();
            currentPackageData = data.package;
            displayTrackedPackage(data.package);
        } catch (error) {
            showError('Error tracking package: ' + error.message);
            console.error('Error:', error);
        }
    }

    function displayTrackedPackage(pkg) {
        const totalCost = parseFloat(pkg.total_cost);
        const createdAt = new Date(pkg.created_at);
        const updatedAt = pkg.updated_at ? new Date(pkg.updated_at) : null;
        
        packageInfo.innerHTML = `
            <p><strong>Tracking Number:</strong> ${pkg.tracking_number}</p>
            <p><strong>Sender:</strong> ${pkg.sender_name}</p>
            <p><strong>Receiver:</strong> ${pkg.receiver_name}</p>
            <p><strong>Shipping Method:</strong> ${pkg.shipping_method}</p>
            <p><strong>Status:</strong> ${pkg.status}</p>
            <p><strong>Weight:</strong> ${pkg.weight} kg</p>
            <p><strong>Total Cost:</strong> $${!isNaN(totalCost) ? totalCost.toFixed(2) : 'N/A'}</p>
            <p><strong>Created:</strong> ${createdAt.toLocaleString()}</p>
            ${updatedAt ? `<p><strong>Last Updated:</strong> ${updatedAt.toLocaleString()}</p>` : ''}
        `;

        if (pkg.status !== 'Delivered') {
            statusSelect.value = pkg.status;
            statusUpdateSection.classList.remove('hidden');
        } else {
            statusUpdateSection.classList.add('hidden');
        }

        trackingResult.classList.remove('hidden');
        trackingResult.scrollIntoView({ behavior: 'smooth' });
    }

    async function updatePackageStatus() {
        const newStatus = statusSelect.value;
        try {
            const response = await fetch('/api/packages/status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trackingNumber: currentPackageData.tracking_number,
                    newStatus: newStatus
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update status');
            }

            const data = await response.json();
            currentPackageData = data.package;

            const packageIndex = allPackages.findIndex(pkg => pkg.tracking_number === data.package.tracking_number);
            if (packageIndex !== -1) {
                allPackages[packageIndex] = data.package;
            }

            const statusElements = packageInfo.querySelectorAll('p');
            if (statusElements.length >= 5) {
                statusElements[4].innerHTML = `<strong>Status:</strong> ${data.package.status}`;
            }

            if (newStatus === 'Delivered') {
                statusUpdateSection.classList.add('hidden');
            }

            showSuccess('Status updated successfully');
        } catch (error) {
            showError('Error updating status: ' + error.message);
            console.error('Error:', error);
        }
    }

    function printTrackedLabel() {
        if (!currentPackageData) return;
        printLabel();
    }

    async function deleteTrackedPackage() {
        if (!currentPackageData) {
            showError('No package selected to delete');
            return;
        }
    
        if (!confirm('Are you sure you want to delete this package?')) {
            return;
        }
    
        try {
            deleteTrackedPackageBtn.disabled = true;
            deleteTrackedPackageBtn.textContent = 'Deleting...';
    
            const response = await fetch(`/api/packages/${currentPackageData.tracking_number}`, {
                method: 'DELETE'
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete package');
            }
    
            // Remove from local state
            allPackages = allPackages.filter(pkg => pkg.tracking_number !== currentPackageData.tracking_number);
            
            // Clear current package and UI
            currentPackageData = null;
            trackingResult.classList.add('hidden');
            trackingNumberInput.value = '';
            
            showSuccess('Package deleted successfully');
            
        } catch (error) {
            console.error('Delete error:', error);
            showError(error.message || 'Failed to delete package');
        } finally {
            deleteTrackedPackageBtn.disabled = false;
            deleteTrackedPackageBtn.textContent = 'Delete Package';
        }
    }

    async function loadPackages() {
        const status = statusFilter.value;
        const shippingMethod = shippingMethodFilter.value;

        try {
            let url = `/api/packages?page=${currentPage}`;
            if (status) url += `&status=${encodeURIComponent(status)}`;
            if (shippingMethod) url += `&shippingMethod=${encodeURIComponent(shippingMethod)}`;

            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to load packages');
            }

            const data = await response.json();
            totalPages = data.pagination.totalPages;
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
            allPackages = data.packages;
            renderPackagesTable(data.packages);
        } catch (error) {
            showError('Error loading packages: ' + error.message);
            console.error('Error:', error);
        }
    }

    function renderPackagesTable(packages) {
        packagesTableBody.innerHTML = '';

        if (packages.length === 0) {
            packagesTableBody.innerHTML = '<tr><td colspan="7" class="no-packages">No packages found</td></tr>';
            return;
        }

        packages.forEach(pkg => {
            const totalCost = parseFloat(pkg.total_cost);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pkg.tracking_number}</td>
                <td>${pkg.sender_name}</td>
                <td>${pkg.receiver_name}</td>
                <td>${pkg.shipping_method}</td>
                <td><span class="status-badge status-${pkg.status.toLowerCase().replace(' ', '-')}">${pkg.status}</span></td>
                <td>$${!isNaN(totalCost) ? totalCost.toFixed(2) : 'N/A'}</td>
                <td class="actions">
                    <button class="view-btn" data-id="${pkg.tracking_number}">View</button>
                </td>
            `;
            packagesTableBody.appendChild(row);
        });

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                showSection('track');
                trackingNumberInput.value = btn.dataset.id;
                const packageToView = allPackages.find(pkg => pkg.tracking_number === btn.dataset.id);
                if (packageToView) {
                    currentPackageData = packageToView;
                    displayTrackedPackage(packageToView);
                } else {
                    await trackPackage();
                }
            });
        });
    }

    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        const currentSection = document.querySelector('section:not(.hidden)');
        currentSection.insertBefore(errorElement, currentSection.firstChild);
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }

    function showSuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = message;
        document.querySelectorAll('.success-message').forEach(el => el.remove());
        const currentSection = document.querySelector('section:not(.hidden)');
        currentSection.insertBefore(successElement, currentSection.firstChild);
        setTimeout(() => {
            successElement.remove();
        }, 5000);
    }

    // Initialize
    showSection('create');
});