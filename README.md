# **Whale Transactions Monitoring Application**

## **Overview**

This application provides a user-friendly interface for monitoring cryptocurrency transactions of whale accounts on the Binance Smart Chain (BSC). It integrates with the Bitquery API to fetch real-time transaction data and allows users to customize the refresh interval for transaction updates. The backend is built with Node.js and Express, while the frontend uses React.js, offering a seamless experience.

---

## **Table of Contents**

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Installation Guide](#installation-guide)
4. [Usage](#usage)
5. [File Structure](#file-structure)
6. [API Endpoints](#api-endpoints)
7. [Customization](#customization)
8. [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)
9. [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)

---

## **Features**

- **Transaction Monitoring**: Real-time data from whale accounts on the BSC, displaying transaction details such as hash, sender, receiver, amount, and timestamp.
- **Customizable Refresh Interval**: Set a custom interval (in minutes) to automatically refresh transaction data.
- **Responsive Frontend**: Built using React.js and Tailwind CSS for a clean and responsive design.
- **Backend API**: Node.js/Express.js-based backend integrated with Bitquery for blockchain data retrieval.
- **Cross-Origin Resource Sharing (CORS)**: Enabled for communication between the frontend and backend.

---

## **Technology Stack**

### **Frontend**:
- **React.js**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **Lucide React**: Icon package for interactive UI elements.

### **Backend**:
- **Node.js**: JavaScript runtime for backend logic.
- **Express.js**: Web framework for building REST APIs.
- **Bitquery API**: Used to fetch whale transaction data from the Binance Smart Chain.
- **Cron Jobs**: Used for periodic transaction updates based on user-defined intervals.
- **CORS**: Enabled for cross-origin requests between the frontend and backend.

---

## **Installation Guide**

### **Prerequisites**

Before running this application, ensure you have the following installed:

- **Node.js** (v16.x or higher)
- **npm** (v7.x or higher)
- **Bitquery API Key** (You can obtain one by signing up at [Bitquery](https://bitquery.io/))

### **Steps for Installation**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/whale-transactions-monitor.git
   cd whale-transactions-monitor
   ```

2. **Backend Setup**:
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Install the required packages:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `backend` directory and add your environment variables:
     ```bash
     BITQUERY_API_KEY=<your-bitquery-api-key>
     PORT=8000
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

3. **Frontend Setup**:
   - Navigate to the `frontend` directory:
     ```bash
     cd ../frontend
     ```
   - Install frontend dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```

The frontend will be accessible at `http://localhost:3000`, and the backend at `http://localhost:8000`.

---

## **Usage**

### **Setting Custom Interval for Data Refresh**

1. **Launch the App**: Once the application is running, you will see a table listing recent whale transactions.
2. **Set Interval**: Enter a custom interval (in minutes) into the input field. This will define how frequently the data refreshes. 
3. **Automatic Data Refresh**: After setting the interval, the system will automatically refresh the data based on your input.

---

## **File Structure**

```bash
whale-transactions-monitor/
│
├── backend/
│   ├── app.js               # Main server logic for API endpoints
│   ├── routes/              # API routes for transactions and interval management
│   ├── services/            # Bitquery integration for fetching blockchain data
│   ├── .env                 # Environment variables (API key)
│   ├── package.json         # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components (Navbar, WhaleTransactions)
│   │   ├── assets/          # Static assets like images, icons, etc.
│   │   ├── App.js           # Main component for rendering the application
│   ├── public/              # Static frontend files
│   └── package.json         # Frontend dependencies
│
└── README.md                # Project documentation
```

---

## **API Endpoints**

### **Backend API Endpoints**

1. **GET /api/transactions**
   - **Description**: Retrieves the most recent whale transactions from Binance Smart Chain.
   - **Response**: Array of transaction objects.

2. **POST /api/cron-interval**
   - **Description**: Updates the cron job interval for automatic transaction refresh.
   - **Request Body**:
     ```json
     {
       "interval": "*/5 * * * *"  // Every 5 minutes
     }
     ```

---

## **Customization**

1. **Update the Bitquery API Endpoint**: 
   - You can customize the API query in the backend by modifying the `fetchTransactions` function in the `services/bitquery.js` file. You can adjust the query to fetch specific types of transactions or monitor other blockchains.

2. **Modify the Cron Interval**:
   - The cron interval logic is defined in the backend. Modify the interval through the POST `/api/cron-interval` endpoint to suit your needs.

3. **Change UI Elements**: 
   - You can customize the UI by editing the components in the `src/components/` directory. Tailwind CSS makes it easy to adjust the layout and styles.

---

## **Common Issues and Troubleshooting**

### **CORS Issues**
- If you encounter Cross-Origin Resource Sharing (CORS) issues, ensure that the `cors` middleware is correctly configured in `app.js` in the backend.

### **Interval Countdown Bug**
- Ensure that the `setInterval` in `WhaleTransactions.js` is correctly calculating the time and slowing down the countdown based on the interval set by the user.

### **API Rate Limits**
- Bitquery API has rate limits based on your API key plan. Ensure you are within the limits or consider upgrading to a higher tier if necessary.

---

## **Contributing**

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Contact**

For any inquiries, please contact [jimijay.oj@gmail.com].