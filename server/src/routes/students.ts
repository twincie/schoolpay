import { Router } from 'express';
    import { getStudents, createStudent, updateStudent, deleteStudent } from '../controllers/studentController';

const router = Router();

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - studentId
 *               - class
 *               - categories
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               studentId:
 *                 type: string
 *               class:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 */
router.route('/')
  .get(getStudents)
  .post(createStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
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
 *               - firstName
 *               - lastName
 *               - studentId
 *               - class
 *               - categories
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               studentId:
 *                 type: string
 *               class:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.route('/:id')
  .put(updateStudent)
  .delete(deleteStudent);

export default router;