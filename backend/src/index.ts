import { Response, Request } from "express";
const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
// Enable CORS for all routes
app.use(cors());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes."
});

app.use('/api/', apiLimiter);

interface WhaleTransaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: string;
}

let transactions: WhaleTransaction[] = [];
let cronSchedule: string = '*/5 * * * *'; // Fixed cron expression

async function monitorTransactions() {
    try {
        const timestamp = new Date(Date.now() - 300000).toISOString();
        const txQuery = `
        query ($network: EthereumNetwork!, $timestamp: ISO8601DateTime!) {
            ethereum(network: $network) {
                transfers(
                    options: {limit: 100}
                    date: {since: $timestamp}
                    amount: {gt: 100000}
                ) {
                    transaction {
                        hash
                    }
                    sender {
                        address
                    }
                    receiver {
                        address
                    }
                    amount(in: USD)
                    currency {
                        symbol
                        address
                    }
                    block {
                        timestamp {
                            iso8601
                        }
                    }
                }
            }
        }`;

        const response = await axios.post(
            'https://graphql.bitquery.io',
            {
                query: txQuery,
                variables: {
                    network: "bsc",
                    timestamp: timestamp
                }
            },
            {
                headers: {
                    'X-API-KEY': process.env.BITQUERY_API_KEY
                }
            }
        );

        // Add error and null checking
        if (response.data.errors) {
            console.error('GraphQL Errors:', response.data.errors);
            return;
        }

        const transfers = response.data.data?.ethereum?.transfers;
        if (!transfers || !Array.isArray(transfers)) {
            console.log('No transfers found in the response');
            return;
        }

        const newTransactions = transfers.map(tx => ({
            hash: tx.transaction.hash,
            from: tx.sender.address,
            to: tx.receiver.address,
            value: tx.amount,
            timestamp: tx.block.timestamp.iso8601
        }));

        transactions = [...newTransactions, ...transactions].slice(0, 1000);
        console.log(`Fetched ${newTransactions.length} new whale transactions`);
    } catch (error) {
        console.error('Error monitoring transactions:', error);
        // Log the full error details in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Full error:', error);
        }
    }
}

let cronJob = cron.schedule(cronSchedule, async () => {
    console.log('Running cron job: Fetching whale transactions...');
    await monitorTransactions();
});

app.get('/api/transactions', (req: Request, res: Response) => {
    res.json(transactions)
});

app.post('/api/cron-interval', (req: Request, res: Response) => {
    const { interval } = req.body;
    if (!interval || !cron.validate(interval)) {
        return res.status(400).json({ error: 'Invalid cron expression' });
    }

    cronJob.stop();
    cronSchedule = interval;
    cronJob = cron.schedule(cronSchedule, async () => {
        console.log('Running cron job: Fetching whale transactions...');
        await monitorTransactions();
    });
    cronJob.start();

    res.json({ message: 'Cron interval updated successfully' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    monitorTransactions();
});