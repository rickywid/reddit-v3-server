import { Request, Response } from 'express';
import db from '../lib/db';

const userController = {
    getUser: async(req:Request, res:Response) => {
        const { rows } = await db.query(`
            SELECT 
                id,
                username,
                picture
            FROM users
            WHERE id = $1;
        `, [req.params.id]);
        
        const user = rows[0];
        const categories = await db.query(`
            SELECT 
                id,
                category_name, 
                subreddits 
            FROM categories
            WHERE user_id = $1
            ORDER BY id DESC;
        `, [req.params.id]);

        user['categories'] = categories.rows.map(category => {
            return {
                category_id: category.id,
                category_name: category.category_name,
                data: category.subreddits
            }

        });
        res.status(200).send(user);
    }
}

export default userController;
