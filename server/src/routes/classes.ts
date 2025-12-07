import { Router } from 'express';
import { getClasses, createClass, updateClass, deleteClass, toggleClassStatus } from '../controllers/classController';

const router = Router();

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: Classes retrieved successfully
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 */
router.route('/')
  .get(getClasses)
  .post(createClass);

/**
 * @swagger
 * /api/classes/{id}:
 *   put:
 *     summary: Update a class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *   delete:
 *     summary: Delete a class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.route('/:id')
  .put(updateClass)
  .delete(deleteClass);

/**
 * @swagger
 * /api/classes/{id}/toggle:
 *   patch:
 *     summary: Toggle class activation status
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class status toggled successfully
 */
router.route('/:id/toggle')
  .patch(toggleClassStatus);

export default router;