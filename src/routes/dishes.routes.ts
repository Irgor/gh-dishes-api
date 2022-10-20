import express from 'express';
import { dishesController } from '@controllers/dishes.controller';

const router = express.Router();

router.post('/', dishesController.create);
router.get('/', dishesController.get);
router.get('/:id', dishesController.show)
router.put('/:id', dishesController.update)
router.delete('/:id', dishesController.destroy)

export = router;