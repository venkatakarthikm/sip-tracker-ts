# SIP Tracker and Portfolio Valuation System

A backend fintech solution for managing Systematic Investment Plans (SIPs), mutual funds, and investor portfolios. This system ensures data integrity through a normalized relational database and provides secure REST APIs for financial operations.

---

## Tech Stack

- Runtime: Node
- Framework: Express
- Language: TypeScript
- Database: Relational (Normalized to 3NF)
- API Documentation: Postman

---

## Features

- Investor Management: Secure registration, login, and profile tracking.
- Mutual Fund Management: CRUD operations for funds and real-time NAV updates.
- SIP Engine: Register SIPs with custom amounts and execution dates.
- Transaction Tracking: Automated installment processing and comprehensive history logs.
- Portfolio Analytics: Real-time calculation of holdings and total net worth.

---

## Database Schema

The system implements a normalized relational schema to maintain referential integrity.

- Investors: Personal details and authentication data.
- Funds: Mutual fund information, AMC details, and latest NAV.
- SIPs: Registration links between investors and funds.
- Transactions: Records of units allotted, price paid, and transaction dates.
- Token Blacklist: Security layer for managing logged-out JWT sessions.

---

## API Endpoints (Postman Collection)

### Investor APIs
| Name | Method | URL |
| :--- | :--- | :--- |
| register | POST | http://localhost:3000/api/investors/register |
| login | POST | http://localhost:3000/api/investors/login |
| logout | POST | http://localhost:3000/api/investors/logout |
| getInvestor | GET | http://localhost:3000/api/investors/1 |
| investor holdings | GET | http://localhost:3000/api/investors/holdings/1 |
| networth | GET | http://localhost:3000/api/investors/1/networth |

### Fund APIs
| Name | Method | URL |
| :--- | :--- | :--- |
| addFunds | POST | http://localhost:3000/api/funds |
| getFunds | GET | http://localhost:3000/api/funds |
| put fund nav | PUT | http://localhost:3000/api/funds/1/nav |

### SIP APIs
| Name | Method | URL |
| :--- | :--- | :--- |
| create sip | POST | http://localhost:3000/api/sips |
| process sip | POST | http://localhost:3000/api/sips/1/process |
| get transactions | GET | http://localhost:3000/api/sips/transactions/1 |
| get sips | GET | http://localhost:3000/api/sips/1 |

---

## Data Integrity and Transactions

The system uses ACID-compliant database transactions for critical operations like SIP Processing. This ensures that updating unit balances and creating transaction records happen as a single, atomic operation:
- BEGIN TRANSACTION
- COMMIT on success
- ROLLBACK on any failure to prevent data corruption

---

## Installation and Setup

1. Clone the repository: `git clone https://github.com/venkatakarthikm/SIP-Tracker`
2. Install dependencies: `npm install`
3. Configure Environment Variables: Create a .env file and add your database credentials and JWT Secret.
4. Run the server: `npm start`

---
Developed as part of the Backend and Database Assignment for Fintech Systems.
