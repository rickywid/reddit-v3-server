import { Request, Response } from 'express';
import db from '../lib/db';

const categoryController = {
    createCategory: async (req: Request, res: Response) => {
        const userID = req.user?.id;
        const { name } = req.body;

        await db.query(`
            INSERT INTO categories(category_name, user_id, subreddits)
            VALUES($1, $2, '{}');
        `, [name, userID]);

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
    },
    updateCategory: async (req: Request, res: Response) => {
        /**
         * Route forwhen user submits Get Started Form
         */

        const userID = req.user?.id;
        const data = req.body.subreddits.map((s: { name: string }) => s.name);

        await db.query(`
            UPDATE categories 
            SET subreddits = $1
            WHERE user_id = $2 
            AND category_name = 'uncategorized';
        `, [data, userID]);

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

        const categories = query2.rows.map(category => {
            return {
                category_id: category.id,
                category_name: category.category_name,
                data: category.subreddits
            }
        });

        res.status(200).send(categories);
    },
    renameCategory: async (req: Request, res: Response) => {
        const { category, id } = req.body;
        const userID = req.user?.id;

        const { rows } = await db.query(`
            UPDATE categories 
            SET category_name = $1
            WHERE id = $2 
            AND user_id = $3
            RETURNING *;
        `, [category, id, userID]);

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
    },
    deleteCategory: async (req: Request, res: Response) => {

        const { mergedSubs, category } = req.body;
        const userID = req.user?.id;

        /**
         * Update Uncategorized subreddits with merged subs 
         */
        await db.query(`
            UPDATE categories 
            SET subreddits = $1
            WHERE category_name = 'uncategorized'
            AND user_id = $2;
        `, [mergedSubs, userID]);

        /**
         * Delete Category
         */
        await db.query(`
            DELETE
            FROM categories
            WHERE category_name = $1
            AND user_id = $2;
        `, [category, userID]);

        const query2 = await db.query(`
            SELECT 
                category_name, 
                subreddits 
            FROM categories
            WHERE user_id = $1
            ORDER BY id ASC
            ;
        `, [userID]);

        const data = query2.rows.map(category => {
            return {
                id: category.id,
                category_name: category.category_name,
                data: category.subreddits
            }
        });

        res.status(200).send(data);
    }
}

export default categoryController;
