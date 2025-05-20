// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Get references to all the HTML elements we'll need to interact with
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

    // Global variables - Store application state
    let currentPage = 1;              // Current page in the packages table
    let totalPages = 1;               // Total number of pages available
    let currentPackageType = 'one-day'; // Default package type (one-day or two-day)
    let currentPackageData = null;     // Currently selected package data
    let allPackages = [];              // Array to store all loaded packages

    // Event Listeners - Set up event handlers for user interactions

    // Navigation buttons - switch between different sections of the app
    createPackageBtn.addEventListener('click', () => showSection('create'));
    trackPackageBtn.addEventListener('click', () => showSection('track'));
    managePackagesBtn.addEventListener('click', () => {
        showSection('manage');
        loadPackages(); // Load packages when managing section is shown
    });

    // Package type tabs (one-day vs two-day)
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Update current package type
            currentPackageType = btn.dataset.type;
        });
    });

    // Form submission and button click handlers
    packageForm.addEventListener('submit', handlePackageSubmit);
    printLabelBtn.addEventListener('click', printLabel);
    searchPackageBtn.addEventListener('click', trackPackage);
    updateStatusBtn.addEventListener('click', updatePackageStatus);
    printTrackedLabelBtn.addEventListener('click', printTrackedLabel);
    deleteTrackedPackageBtn.addEventListener('click', deleteTrackedPackage);

    // Filter and pagination controls
    applyFiltersBtn.addEventListener('click', () => {
        currentPage = 1; // Reset to first page when filters change
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

    // Functions - Define all the application functionality

    /**
     * Shows the specified section and hides others
     * @param {string} section - The section to show ('create', 'track', or 'manage')
     */
    function showSection(section) {
        // Hide all sections first
        createPackageSection.classList.add('hidden');
        trackPackageSection.classList.add('hidden');
        managePackagesSection.classList.add('hidden');

        // Show the requested section and perform section-specific setup
        if (section === 'create') {
            createPackageSection.classList.remove('hidden');
            packageForm.reset(); // Reset the form
            packageResult.classList.add('hidden'); // Hide any previous results
        } else if (section === 'track') {
            trackPackageSection.classList.remove('hidden');
            trackingResult.classList.add('hidden'); // Hide any previous results
            trackingNumberInput.value = ''; // Clear the tracking number input
        } else if (section === 'manage') {
            managePackagesSection.classList.remove('hidden');
        }
    }

    /**
     * Handles package form submission
     * @param {Event} e - The form submission event
     */
    async function handlePackageSubmit(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Collect form data
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
            // Determine the API endpoint based on package type
            const endpoint = currentPackageType === 'one-day'
                ? '/api/packages/one-day'
                : '/api/packages/two-day';

            // Send the package data to the server
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // Check for errors
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create package');
            }

            // Process successful response
            const data = await response.json();
            currentPackageData = data.package; // Store the created package
            displayPackageDetails(data.package, data.trackingNumber); // Show package details
            packageResult.classList.remove('hidden'); // Show the result section
            packageForm.reset(); // Reset the form for new entries
        } catch (error) {
            // Handle errors
            showError('Error creating package: ' + error.message);
            console.error('Error:', error);
        }
    }

    /**
     * Displays package details in the UI
     * @param {Object} pkg - The package data to display
     * @param {string} [trackingNumber] - Optional tracking number to display
     */
    function displayPackageDetails(pkg, trackingNumber = null) {
        const totalCost = parseFloat(pkg.total_cost);
        const trackingNum = trackingNumber || pkg.tracking_number;
        
        // Generate HTML to display package details
        packageDetails.innerHTML = `
            <p><strong>Tracking Number:</strong> ${trackingNum}</p>
            <p><strong>Status:</strong> ${pkg.status}</p>
            <p><strong>Shipping Method:</strong> ${pkg.shipping_method}</p>
            <p><strong>Sender:</strong> ${pkg.sender_name}</p>
            <p><strong>Receiver:</strong> ${pkg.receiver_name}</p>
            <p><strong>Total Cost:</strong> $${!isNaN(totalCost) ? totalCost.toFixed(2) : 'N/A'}</p>
        `;
    }

    /**
     * Opens a print window with the shipping label for the current package
     */
    function printLabel() {
        if (!currentPackageData) return; // No package to print
        
        // Open a new window for printing
        const printWindow = window.open('', '_blank');
        const totalCost = parseFloat(currentPackageData.total_cost);
        
        // Generate the label HTML
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
        
        // Close the document and trigger print dialog
        printWindow.document.close();
        printWindow.print();
    }

    /**
     * Tracks a package by its tracking number
     */
    async function trackPackage() {
        const trackingNumber = trackingNumberInput.value.trim();
        
        // Validate input
        if (!trackingNumber) {
            showError('Please enter a tracking number');
            return;
        }

        try {
            // First check if we have the package in our local state
            const localPackage = allPackages.find(pkg => pkg.tracking_number === trackingNumber);
            if (localPackage) {
                currentPackageData = localPackage;
                displayTrackedPackage(localPackage);
                return;
            }

            // If not found locally, fetch from server
            const response = await fetch(`/api/packages/${trackingNumber}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Package not found');
            }

            // Display the fetched package
            const data = await response.json();
            currentPackageData = data.package;
            displayTrackedPackage(data.package);
        } catch (error) {
            showError('Error tracking package: ' + error.message);
            console.error('Error:', error);
        }
    }

    /**
     * Displays tracked package information
     * @param {Object} pkg - The package data to display
     */
    function displayTrackedPackage(pkg) {
        const totalCost = parseFloat(pkg.total_cost);
        const createdAt = new Date(pkg.created_at);
        const updatedAt = pkg.updated_at ? new Date(pkg.updated_at) : null;
        
        // Generate HTML for package details
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

        // Show status update controls if package isn't delivered
        if (pkg.status !== 'Delivered') {
            statusSelect.value = pkg.status;
            statusUpdateSection.classList.remove('hidden');
        } else {
            statusUpdateSection.classList.add('hidden');
        }

        // Show the results section and scroll to it
        trackingResult.classList.remove('hidden');
        trackingResult.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Updates the status of the currently tracked package
     */
    async function updatePackageStatus() {
        if (!currentPackageData) {
            showError('No package selected for update');
            return;
        }

        const newStatus = statusSelect.value;
        const trackingNumber = currentPackageData.tracking_number;

        try {
            // Show loading state
            updateStatusBtn.disabled = true;
            updateStatusBtn.textContent = 'Updating...';

            // Send update request to server
            const response = await fetch('/api/packages/status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trackingNumber: trackingNumber,
                    newStatus: newStatus
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update status');
            }

            const data = await response.json();

            // Update local data
            currentPackageData = data.package;
            const packageIndex = allPackages.findIndex(function(pkg) {
                return pkg.tracking_number === trackingNumber;
            });
            if (packageIndex !== -1) {
                allPackages[packageIndex] = data.package;
            }

            // Update UI
            const statusElements = packageInfo.querySelectorAll('p');
            if (statusElements.length >= 5) {
                statusElements[4].innerHTML = '<strong>Status:</strong> ' + data.package.status;
            }

            // Hide update controls if package is now delivered
            if (newStatus === 'Delivered') {
                statusUpdateSection.classList.add('hidden');
            }

            showSuccess('Status updated successfully');
        } catch (error) {
            console.error('Update status error:', error);
            showError('Error updating status: ' + error.message);
        } finally {
            // Reset button state
            updateStatusBtn.disabled = false;
            updateStatusBtn.textContent = 'Update Status';
        }
    }

    /**
     * Prints the label for the currently tracked package
     */
    function printTrackedLabel() {
        if (!currentPackageData) return;
        printLabel(); // Reuse the existing print function
    }

    /**
     * Deletes the currently tracked package
     */
    async function deleteTrackedPackage() {
        if (!currentPackageData) {
            showError('No package selected to delete');
            return;
        }
    
        // Confirm deletion with user
        if (!confirm('Are you sure you want to delete this package?')) {
            return;
        }
    
        try {
            // Show loading state
            deleteTrackedPackageBtn.disabled = true;
            deleteTrackedPackageBtn.textContent = 'Deleting...';
    
            // Send delete request to server
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
            // Reset button state
            deleteTrackedPackageBtn.disabled = false;
            deleteTrackedPackageBtn.textContent = 'Delete Package';
        }
    }

    /**
     * Loads packages from the server with current filters and pagination
     */
    async function loadPackages() {
        const status = statusFilter.value;
        const shippingMethod = shippingMethodFilter.value;

        try {
            // Build the URL with current filters and pagination
            let url = `/api/packages?page=${currentPage}`;
            if (status) url += `&status=${encodeURIComponent(status)}`;
            if (shippingMethod) url += `&shippingMethod=${encodeURIComponent(shippingMethod)}`;

            // Fetch packages from server
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to load packages');
            }

            // Process response
            const data = await response.json();
            totalPages = data.pagination.totalPages;
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            
            // Update pagination button states
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
            
            // Store packages and render them
            allPackages = data.packages;
            renderPackagesTable(data.packages);
        } catch (error) {
            showError('Error loading packages: ' + error.message);
            console.error('Error:', error);
        }
    }

    /**
     * Renders the packages table with the provided package data
     * @param {Array} packages - Array of package objects to display
     */
    function renderPackagesTable(packages) {
        packagesTableBody.innerHTML = ''; // Clear existing rows

        // Show message if no packages found
        if (packages.length === 0) {
            packagesTableBody.innerHTML = '<tr><td colspan="7" class="no-packages">No packages found</td></tr>';
            return;
        }

        // Create a row for each package
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

        // Add click handlers to all view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                showSection('track'); // Switch to track section
                trackingNumberInput.value = btn.dataset.id; // Set tracking number
                
                // Try to find package in local state first
                const packageToView = allPackages.find(pkg => pkg.tracking_number === btn.dataset.id);
                if (packageToView) {
                    currentPackageData = packageToView;
                    displayTrackedPackage(packageToView);
                } else {
                    // If not found locally, fetch from server
                    await trackPackage();
                }
            });
        });
    }

    /**
     * Shows an error message to the user
     * @param {string} message - The error message to display
     */
    function showError(message) {
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        // Remove any existing error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Insert the error message at the top of the current section
        const currentSection = document.querySelector('section:not(.hidden)');
        currentSection.insertBefore(errorElement, currentSection.firstChild);
        
        // Remove the error message after 5 seconds
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }

    /**
     * Shows a success message to the user
     * @param {string} message - The success message to display
     */
    function showSuccess(message) {
        // Create success message element
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = message;
        
        // Remove any existing success messages
        document.querySelectorAll('.success-message').forEach(el => el.remove());
        
        // Insert the success message at the top of the current section
        const currentSection = document.querySelector('section:not(.hidden)');
        currentSection.insertBefore(successElement, currentSection.firstChild);
        
        // Remove the success message after 5 seconds
        setTimeout(() => {
            successElement.remove();
        }, 5000);
    }

    // Initialize the application by showing the create package section
    showSection('create');
});