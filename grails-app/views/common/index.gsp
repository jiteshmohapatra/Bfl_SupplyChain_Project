<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
            background-color: #f5f5f5;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            display: flex;
            align-items: center;
            padding: 10px 20px;
            background-color: #fff;
            border-bottom: 1px solid #e0e0e0;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .logo {
            display: flex;
            align-items: center;
            margin-right: 20px;
        }
        .logo-icon {
            font-size: 24px;
            margin-right: 10px;
        }
        .logo-text {
            color: #666;
            font-size: 14px;
        }
        .nav {
            display: flex;
            flex-grow: 1;
            position: relative;
        }
        .nav-item {
            padding: 10px 15px;
            color: #333;
            text-decoration: none;
            font-size: 14px;
            position: relative;
            display: flex;
            align-items: center;
        }
        .nav-item.active {
            color: #1976d2;
            border-bottom: 2px solid #1976d2;
        }
        .nav-item.has-dropdown {
            padding-right: 20px; /* Space for the arrow */
        }
        .nav-item.has-dropdown::after {
            content: '';
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #333; /* Downward triangle arrow */
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
        }
        .nav-item:hover .dropdown {
            display: block;
        }
        .dropdown {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-top: none;
            min-width: 200px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            z-index: 1000;
            padding: 5px 0;
        }
        .dropdown a {
            display: block;
            padding: 10px 15px;
            color: #333;
            text-decoration: none;
            font-size: 14px;
        }
        .dropdown a:hover {
            background-color: #f0f0f0;
        }
        .icons {
            display: flex;
        }
        .icon {
            margin-left: 15px;
            cursor: pointer;
        }
        .container {
            display: flex;
            flex: 1;
        }
        .sidebar {
            width: 130px;
            background-color: #fff;
            border-right: 1px solid #e0e0e0;
            transition: width 0.3s;
            overflow-y: auto;
        }
        .sidebar-item {
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            text-align: center;
        }
        .sidebar-item.active {
            background-color: #f0f0f0;
            border-left: 3px solid #1976d2;
        }
        .sidebar-icon {
            font-size: 20px;
            margin-bottom: 5px;
        }
        .sidebar-text {
            font-size: 12px;
            color: #666;
            text-align: center;
            white-space: nowrap;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .content {
            flex: 1;
            padding: 20px;
            overflow-x: auto;
        }
        .dashboard-row {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        .card {
            background-color: #fff;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            flex: 1 1 calc(25% - 15px);
            min-width: 250px;
        }
        .card-header {
            padding: 15px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .card-title {
            font-size: 14px;
            color: #333;
        }
        .card-actions {
            display: flex;
        }
        .card-action {
            margin-left: 10px;
            cursor: pointer;
            color: #999;
        }
        .card-body {
            padding: 15px;
        }
        .big-number {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .subtitle {
            font-size: 12px;
            color: #999;
        }
        .chart-container {
            padding: 15px;
            height: 250px;
            position: relative;
        }
        .chart-title {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }
        .chart-period {
            font-size: 12px;
            color: #666;
            position: absolute;
            top: 5px;
            right: 15px;
        }
        .status-circles {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 100%;
            position: relative;
        }
        .status-circles::before,
        .status-circles::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 1px;
            background-color: #e0e0e0;
        }
        .status-circles::before {
            left: 33.33%;
        }
        .status-circles::after {
            left: 66.66%;
        }
        .status-circle {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 33.33%;
            text-align: center;
        }
        .circle {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-bottom: 10px;
        }
        .circle.blue {
            background-color: #2196f3;
        }
        .circle.purple {
            background-color: #9c27b0;
        }
        .circle.red {
            background-color: #f44336;
        }
        .circle.green {
            background-color: #4caf50;
        }
        .circle.amber {
            background-color: #ff9800;
        }
        .circle-number {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .circle-label {
            font-size: 12px;
            color: #999;
            text-align: center;
        }
        .bar-chart {
            height: 20px;
            background-color: #8bc34a;
            margin: 10px 0;
            border-radius: 2px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
        }
        .table th, .table td {
            padding: 10px;
            text-align: left;
            font-size: 13px;
        }
        .table th {
            border-bottom: 1px solid #e0e0e0;
            color: #666;
        }
        .table td {
            border-bottom: 1px solid #f0f0f0;
        }
        .tag {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 11px;
            margin-right: 5px;
        }
        .tag.blue {
            background-color: #e3f2fd;
            color: #2196f3;
        }
        .tag.green {
            background-color: #e8f5e9;
            color: #4caf50;
        }
        .tag.amber {
            background-color: #fff8e1;
            color: #ffc107;
        }
        .tag.red {
            background-color: #ffebee;
            color: #f44336;
        }
        .footer {
            background-color: #fff;
            padding: 10px 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #666;
            text-align: center;
            flex-shrink: 0;
        }
        .footer span {
            margin: 0 10px;
        }

        /* Enhanced Responsive Design */
        @media (max-width: 1024px) {
            .container {
                flex-direction: column;
            }
            .sidebar {
                width: 100%;
                height: auto;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                border-right: none;
                border-bottom: 1px solid #e0e0e0;
            }
            .sidebar-item {
                flex: 1 0 25%;
                padding: 10px;
                min-width: 100px;
            }
            .content {
                margin-left: 0;
                width: 100%;
            }
            .dashboard-row {
                flex-wrap: wrap;
            }
            .card {
                flex: 1 1 100%;
                min-width: 100%;
            }
            .dropdown {
                position: static;
                width: 100%;
                box-shadow: none;
                border: none;
            }
            .dropdown a {
                padding: 10px;
            }
            .nav-item.has-dropdown::after {
                display: none; /* Hide arrow on small screens if needed */
            }
        }

        @media (max-width: 768px) {
            .header {
                flex-direction: column;
                align-items: flex-start;
            }
            .nav {
                display: none;
            }
            .icons {
                margin-left: 0;
                margin-top: 10px;
            }
            .sidebar-item {
                flex: 1 0 33.33%;
            }
            .status-circles::before,
            .status-circles::after {
                display: none;
            }
            .status-circle {
                width: 100%;
                margin-bottom: 20px;
            }
            .status-circle:last-child {
                margin-bottom: 0;
            }
        }

        @media (max-width: 480px) {
            .sidebar-item {
                flex: 1 0 50%;
            }
            .card {
                min-width: 100%;
            }
            .footer span {
                display: block;
                margin: 5px 0;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="https://www.openboxes.com/img/logo_30.png" alt="Logo" class="logo-icon">
        </div>
        <nav class="nav">
            <a href="#" class="nav-item">Dashboard</a>
            <div class="nav-item has-dropdown">Analytics
                <div class="dropdown">
                    <a href="#">Browse inventory</a>
                    <a href="#">Inventory Snapshots</a>
                    <a href="#">Consumption Report</a>
                </div>
            </div>
            <a href="#" class="nav-item active">Inventory</a>
            <a href="#" class="nav-item">Purchasing</a>
            <a href="#" class="nav-item">Inbound</a>
            <a href="#" class="nav-item">Reporting</a>
            <a href="#" class="nav-item">Products</a>
            <a href="#" class="nav-item">Stocklists</a>
        </nav>
        <div class="icons">
            <div class="icon">🔍</div>
            <div class="icon">❓</div>
            <div class="icon">⚙️</div>
            <div class="icon">👤</div>
        </div>
    </div>

    <div class="container">
        <div class="sidebar">
            <div class="sidebar-item active">
                <div class="sidebar-icon">📊</div>
                <div class="sidebar-text">My Dashboard</div>
            </div>
            <div class="sidebar-item">
                <div class="sidebar-icon">🏠</div>
                <div class="sidebar-text">Warehouse Management</div>
            </div>
            <div class="sidebar-item">
                <div class="sidebar-icon">📦</div>
                <div class="sidebar-text">Inventory Management</div>
            </div>
            <div class="sidebar-item">
                <div class="sidebar-icon">💸</div>
                <div class="sidebar-text">Transaction Management</div>
            </div>
            <div class="sidebar-item">
                <div class="sidebar-icon">📈</div>
                <div class="sidebar-text">Fill Rate</div>
            </div>
        </div>

        <div class="content">
            <div class="dashboard-row">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Inventory Details by Lot and Bin</div>
                        <div class="card-actions">
                            <div class="card-action">ⓘ</div>
                            <div class="card-action">⋮</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="big-number">24</div>
                        <div class="subtitle">In stock</div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Products in Receiving Bin</div>
                        <div class="card-actions">
                            <div class="card-action">ⓘ</div>
                            <div class="card-action">⋮</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="big-number">0</div>
                        <div class="subtitle">Products</div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Your in Progress Shipments</div>
                        <div class="card-actions">
                            <div class="card-action">ⓘ</div>
                            <div class="card-action">⋮</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="big-number">0</div>
                        <div class="subtitle">Shipments</div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Your in Progress Putaways</div>
                        <div class="card-actions">
                            <div class="card-action">ⓘ</div>
                            <div class="card-action">⋮</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="big-number">0</div>
                        <div class="subtitle">Putaways</div>
                    </div>
                </div>
            </div>

            <div class="dashboard-row">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Inventory Summary</div>
                        <div class="card-actions">
                            <div class="card-action">ⓘ</div>
                            <div class="card-action">⋮</div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="inventoryChart"></canvas>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Expiration Summary</div>
                        <div class="card-actions">
                            <div class="card-action">ⓘ</div>
                            <div class="card-action">⋮</div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <div class="chart-period">Next 6 Months</div>
                        <canvas id="expirationChart"></canvas>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Incoming Stock Movements By Status</div>
                        <div class="card-actions">
                            <div class="card-action">ⓘ</div>
                            <div class="card-action">⋮</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="status-circles">
                            <div class="status-circle">
                                <div class="circle blue"></div>
                                <div class="circle-number">25</div>
                                <div class="circle-label">Pending</div>
                            </div>
                            <div class="status-circle">
                                <div class="circle purple"></div>
                                <div class="circle-number">3</div>
                                <div class="circle-label">Shipped</div>
                            </div>
                            <div class="status-circle">
                                <div class="circle red"></div>
                                <div class="circle-number">0</div>
                                <div class="circle-label">Partially Received</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-row">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Outgoing Stock Movements in Progress</div>
                        <div class="card-actions">
                            <div class="card-action">ⓘ</div>
                            <div class="card-action">⋮</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="status-circles">
                            <div class="status-circle">
                                <div class="circle green"></div>
                                <div class="circle-number">0</div>
                                <div class="circle-label">Created < 4 days ago</div>
                            </div>
                            <div class="status-circle">
                                <div class="circle amber"></div>
                                <div class="circle-number">0</div>
                                <div class="circle-label">Created < 4 days ago</div>
                            </div>
                            <div class="status-circle">
                                <div class="circle red"></div>
                                <div class="circle-number">0</div>
                                <div class="circle-label">Created > 7 days ago</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Delayed Incoming Stock Movements</div>
                        <div class="card-actions">
                            <div class="card-action">ⓘ</div>
                            <div class="card-action">⋮</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Shipment</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div><span class="tag blue">1</span></div>
                                        <div>By air</div>
                                    </td>
                                    <td>
                                        <div>3033SC</div>
                                        <div>423423423-11001-27Feb2024-testshipment01</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div><span class="tag blue">1</span></div>
                                        <div>By sea</div>
                                    </td>
                                    <td>
                                        <div>058VJJ</div>
                                        <div>234FRS-11001-30Nov2024-movementidstockelement1</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div><span class="tag blue">1</span></div>
                                        <div>By land</div>
                                    </td>
                                    <td>
                                        <div>033UZR</div>
                                        <div>KKI-11001-06Jan2025-123</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Items received with a discrepancy</div>
                        <div class="card-actions">
                            <div class="card-action">ⓘ</div>
                            <div class="card-action">⋮</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Shipment</th>
                                    <th>Name</th>
                                    <th>Discrepancy</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="3" style="text-align: center; color: #999;">No discrepancies found</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="footer">
        <span>© 2025 Powered by OpenBoxes</span> |
        <span>Grails Version: 1.3.9</span> |
        <span>Application version: 0.8.20-SNAPSHOT</span> |
        <span>Branch: release/0.8.20</span> |
        <span>Build Number: v0.8.19-979-g93fd41</span> |
        <span>Environment: production</span> |
        <span>Build Date: 28 Oct 2022 12:17:29 AM</span> |
        <span>Locale: Deutsch | English | react_default_en_gb_label | Español | Suomi | Français | Italiano | Português | react_default_russian_label 中文</span> |
        <span>IP Address: 127.0.0.1</span> |
        <span>Hostname: ubuntu-s-1vcpu-2gb-nyc3-01 (demo.openboxes.com)</span> |
        <span>Timezone: Asia/Kolkata</span>
    </div>  \
    

    <!-- Include Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const expirationCtx = document.getElementById('expirationChart').getContext('2d');
            new Chart(expirationCtx, {
                type: 'line',
                data: {
                    labels: ['today', 'within 30 days', 'within 60 days', 'within 90 days', 'within 120 days', 'within 150 days', 'within 180 days'],
                    datasets: [{
                        label: 'Expiration Count',
                        data: [10, 1, 1, 1, 1, 1, 1],
                        borderColor: '#1976d2',
                        borderWidth: 2,
                        pointRadius: 5,
                        pointBackgroundColor: '#1976d2',
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 10,
                            ticks: {
                                stepSize: 2
                            },
                            title: {
                                display: false
                            }
                        },
                        x: {
                            title: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: false
                        }
                    },
                    maintainAspectRatio: false
                }
            });

            const inventoryCtx = document.getElementById('inventoryChart').getContext('2d');
            new Chart(inventoryCtx, {
                type: 'bar',
                data: {
                    labels: ['In stock', 'Above maximum', 'Below reorder', 'Below minimum', 'No longer in stock'],
                    datasets: [{
                        label: 'Inventory Count',
                        data: [18, 0, 0, 0, 0],
                        backgroundColor: ['#8bc34a', '#ffeb3b', '#ffeb3b', '#ffeb3b', '#f44336'],
                        borderWidth: 1,
                        barThickness: 20
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: 20,
                            ticks: {
                                stepSize: 2
                            },
                            title: {
                                display: false
                            }
                        },
                        y: {
                            title: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: false
                        }
                    },
                    maintainAspectRatio: false
                }
            });
        });
    </script>
</body>
</html>