import express from 'express';
import { ingredientsController } from '@controllers/ingredienst.controller';

const router = express.Router();

router.post('/', ingredientsController.create);
router.get('/', ingredientsController.get);
router.get('/total', ingredientsController.price);
router.get('/:id', ingredientsController.show)
router.put('/:id', ingredientsController.update)
router.delete('/:id', ingredientsController.destroy)

export = router;