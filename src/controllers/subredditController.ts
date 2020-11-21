import { Request, Response } from 'express';
import db from '../lib/db';

const subredditController = {
    updateSubreddit: async (req: Request, res: Response) => {
        const userID = req.user?.id;
        const { category, subreddits } = req.body;
        
        /**
         * Update the subreddits
         */
        const x = await db.query(`
            UPDATE categories 
            SET subreddits = $1
            WHERE user_id = $2 
            AND category_name = $3
            RETURNING *;
        `, [subreddits, userID, category]);

        /** 
         * Get User's updated subreddits 
         */

        const query2 = await db.query(`
            SELECT 
                id,
                category_name, 
                subreddits 
            FROM categories
            WHERE user_id = $1
            ORDER BY id ASC
            ;
        `, [userID]);

        const data = query2.rows.map(category => {
            return {
                category_id: category.id,
                category_name: category.category_name,
                data: category.subreddits
            }
        });

        res.status(200).send(data);
    }
}

export default subredditController;
