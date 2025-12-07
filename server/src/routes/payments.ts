import { Router } from 'express';
    import { getPayments, createPayment, updatePayment, deletePayment } from '../controllers/paymentController';

const router = Router();

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - categoryId
 *               - amount
 *               - paymentDate
 *               - paymentMethod
 *             properties:
 *               studentId:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               amount:
 *                 type: number
 *               paymentDate:
 *                 type: string
 *                 format: date
 *               paymentMethod:
 *                 type: string
 *               reference:
 *                 type: string
 *               notes:
 *                 type: string
 */
router.route('/')
  .get(getPayments)
  .post(createPayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Update a payment
 *     tags: [Payments]
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
 *               - amount
 *               - paymentDate
 *               - paymentMethod
 *             properties:
 *               amount:
 *                 type: number
 *               paymentDate:
 *                 type: string
 *                 format: date
 *               paymentMethod:
 *                 type: string
 *               reference:
 *                 type: string
 *               notes:
 *                 type: string
 *   delete:
 *     summary: Delete a payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.route('/:id')
  .put(updatePayment)
  .delete(deletePayment);

export default router;