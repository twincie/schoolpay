import { Router } from 'express';
    import { getCategories, createCategory, updateCategory, toggleStatus, deleteCategory, getActiveCategories } from '../controllers/categoryController';

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 */
router.route('/')
  .get(getCategories)
  .post(createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.route('/:id')
  .put(updateCategory)
  .delete(deleteCategory);

/**
 * @swagger
 * /api/categories/{id}/toggle-status:
 *   patch:
 *     summary: Toggle category status (activate/deactivate)
 *     description: Toggles the isActive status of a category. If active, becomes inactive and vice versa.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Category activated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       400:
 *         description: Invalid category ID
 */
router.patch('/:id/toggle-status', toggleStatus);

/**
 * @swagger
 * /api/categories/active:
 *   get:
 *     summary: Get only active categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Active categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/active', getActiveCategories);

export default router;