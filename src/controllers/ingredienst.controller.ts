import { NextFunction, Request, Response } from "express";
import Ingredient from "@models/Ingredient.model";

import { ErrorMessages } from "@utils/errorMessages";
import { defaultCathError } from "@utils/requestHandling";
import { errorWrapper } from "@utils/errorHandlerWrapper ";

const create = async (req: Request, res: Response, next: NextFunction) => {
    const { image, name, quantity, price, measurement, coin, isBoxed, giver } = req.body;

    const ingredient = new Ingredient({
        image,
        name,
        quantity,
        price,
        measurement,
        coin,
        isBoxed,
        giver,
        total: isBoxed ? price : price * quantity
    })

    const createdIngredient = await ingredient.save().catch(error => {
        defaultCathError(ErrorMessages.CREATE_INGREDIENT_ERROR, error)
    });

    return res.status(201).json(createdIngredient);
};

const show = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const ingredient = await Ingredient.findById(id).catch(error => {
        defaultCathError(ErrorMessages.GET_INGREDIENT_ERROR, error);
    });

    if (!ingredient) {
        return res.status(404).json({ message: ErrorMessages.INGREDIENT_NOT_FOUND });
    }

    return res.status(200).json(ingredient);
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    const ingredients = await Ingredient.find();

    if (!ingredients) {
        return res.status(201).json({ message: ErrorMessages.GET_INGREDIENTS_NOT_FOUND });
    }

    return res.status(200).json(ingredients);
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const ingredient = await Ingredient.findById(id).catch(error => {
        defaultCathError(ErrorMessages.GET_INGREDIENT_ERROR, error);
    });

    if (!ingredient) {
        return res.status(404).json({ message: ErrorMessages.INGREDIENT_NOT_FOUND });
    }

    let newData = req.body;

    const dataToUse = {
        isBoxed: req.body.isBoxed ? req.body.isBoxed : ingredient.isBoxed,
        quantity: req.body.quantity ? req.body.quantity : ingredient.quantity,
    }

    if (req.body.price) {
        newData.total = dataToUse.isBoxed ? req.body.price : req.body.price * dataToUse.quantity
    }

    ingredient.set(newData);

    const updatedIngredient = await ingredient.save().catch(error => {
        defaultCathError(ErrorMessages.UPDATE_INGREDIENT_ERROR, error);
    })

    return res.status(200).json(updatedIngredient)
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    await Ingredient.findByIdAndDelete(id).catch(error => {
        defaultCathError(ErrorMessages.DELETE_INGREDIENT_ERROR, error);
    });

    return res.status(200).json({ deleted: true });
};

export const ingredientsController = errorWrapper(create, show, get, update, destroy);