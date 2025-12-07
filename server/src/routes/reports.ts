import { Router } from 'express';
    import { generateReport, uploadPayments } from '../controllers/reportController';
    import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/reports/generate:
 *   get:
 *     summary: Generate payment report
 *     tags: [Reports]
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
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: class
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Excel report generated
 */
router.get('/generate', generateReport);

/**
 * @swagger
 * /api/reports/upload:
 *   post:
 *     summary: Upload payments from Excel
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Payments uploaded successfully
 */
router.post('/upload', upload.single('file'), uploadPayments);

export default router;