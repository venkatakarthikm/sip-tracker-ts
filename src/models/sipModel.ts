import pool from './pgManager';

export interface SIP {
    id: number;
    investor_id: number;
    fund_id: number;
    amount: number;
    execution_date: string;
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
    fund_name?: string;
    current_nav?: number;
}

export interface CreateSIPData {
    investor_id: number;
    fund_id: number;
    amount: number;
    execution_date: string;
    status?: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
}

export interface Transaction {
    id: number;
    fund_name: string;
    units_allotted: number;
    nav_at_transaction: number;
    amount_paid: number;
    transaction_date: Date;
}

export interface InstallmentResult {
    transactionId: number;
    units: number;
}

const processInstallment = (sipId: string | number): Promise<InstallmentResult> => {
    return new Promise((resolve, reject) => {
        pool.query("BEGIN", (err) => {
            if (err) return reject(err);

            const selectSql = `SELECT s.*, f.current_nav FROM sips s 
                               JOIN funds f ON s.fund_id = f.id 
                               WHERE s.id = $1`;

            pool.query(selectSql, [sipId], (err, result) => {
                const sip = result?.rows[0] as (SIP & { current_nav: number }) | undefined;
                if (err || !sip) {
                    return pool.query("ROLLBACK", () => reject(err || "SIP not found"));
                }

                const units = sip.amount / sip.current_nav;
                const insertSql = `INSERT INTO transactions (sip_id, investor_id, fund_id, units_allotted, nav_at_transaction, amount_paid)
                                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;

                pool.query(insertSql, [sip.id, sip.investor_id, sip.fund_id, units, sip.current_nav, sip.amount], (err, res) => {
                    if (err) {
                        return pool.query("ROLLBACK", () => reject(err));
                    }
                    pool.query("COMMIT", (err) => {
                        if (err) return reject(err);
                        resolve({ transactionId: res.rows[0].id, units });
                    });
                });
            });
        });
    });
};

const getTransactions = (investorId: string | number): Promise<Transaction[]> => {
    const sql = `
        SELECT t.id, f.fund_name, t.units_allotted, t.nav_at_transaction, t.amount_paid, t.transaction_date
        FROM transactions t
        JOIN funds f ON t.fund_id = f.id
        WHERE t.investor_id = $1
        ORDER BY t.transaction_date DESC`;
    return new Promise((resolve, reject) => {
        pool.query(sql, [investorId], (err, result) => {
            if (err) return reject(err);
            resolve(result.rows as Transaction[]);
        });
    });
};

const createSIP = (data: CreateSIPData): Promise<{ id: number }> => {
    const sql = `INSERT INTO sips (investor_id, fund_id, amount, execution_date, status) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const status = data.status || 'ACTIVE';

    return new Promise((resolve, reject) => {
        pool.query(sql, [data.investor_id, data.fund_id, data.amount, data.execution_date, status], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.rows[0].id });
        });
    });
};

const getSipById = (id: string | number): Promise<SIP> => {
    const sql = `SELECT * FROM sips WHERE id = $1`;
    return new Promise((resolve, reject) => {
        pool.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result.rows[0] as SIP);
        });
    });
};

const getSipByInvestorId = (investorId: string | number): Promise<SIP[]> => {
    const sql = `SELECT s.*, f.fund_name FROM sips s JOIN funds f ON s.fund_id = f.id WHERE s.investor_id = $1`;
    return new Promise((resolve, reject) => {
        pool.query(sql, [investorId], (err, result) => {
            if (err) return reject(err);
            resolve(result.rows as SIP[]);
        });
    });
};

export default { processInstallment, getTransactions, createSIP, getSipById, getSipByInvestorId };