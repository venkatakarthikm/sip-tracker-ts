import pool from './pgManager';

export interface Fund {
    id: number;
    fund_name: string;
    amc_name: string;
    current_nav: number;
    updated_at?: Date;
}

export interface CreateFundData {
    fund_name: string;
    amc_name: string;
    current_nav: number;
}

const getAll = (): Promise<Fund[]> => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM funds", (err, result) => {
            if (err) return reject(err);
            resolve(result.rows as Fund[]);
        });
    });
};

const create = (data: CreateFundData): Promise<{ id: number }> => {
    const sql = `INSERT INTO funds (fund_name, amc_name, current_nav) VALUES ($1, $2, $3) RETURNING id`;
    return new Promise((resolve, reject) => {
        pool.query(sql, [data.fund_name, data.amc_name, data.current_nav], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.rows[0].id });
        });
    });
};

const updateNav = (id: string | number, newNav: number): Promise<{ updated: number }> => {
    const sql = `UPDATE funds SET current_nav = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`;
    return new Promise((resolve, reject) => {
        pool.query(sql, [newNav, id], (err, result) => {
            if (err) return reject(err);
            resolve({ updated: result.rowCount ?? 0 });
        });
    });
};

export default { getAll, create, updateNav };