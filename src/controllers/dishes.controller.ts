import { NextFunction, Request, Response } from "express";
import Dish from "@models/Dish.model";

import { ErrorMessages } from "@utils/errorMessages";
import { defaultCathError } from "@utils/requestHandling";
import { errorWrapper } from "@utils/errorHandlerWrapper ";
import Ingredient from "@models/Ingredient.model";


const create = async (req: Request, res: Response, next: NextFunction) => {
    const { image, name, stars, origin, description, more_reference, how_to, stuff, } = req.body;

    const dish = new Dish({
        image,
        name,
        stars,
        origin,
        description,
        more_reference,
        how_to,
        stuff
    })

    const createdDish = await dish.save().catch(error => {
        defaultCathError(ErrorMessages.CREATE_DISH_ERROR, error)
    });

    return res.status(201).json(createdDish);
};

const show = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const dish = await Dish.findById(id).catch(error => {
        defaultCathError(ErrorMessages.GET_DISH_ERROR, error);
    });

    const using = dish!.stuff;

    const actualIngs = await Ingredient.find();
    const actualIngsNames = actualIngs.map(act => act.name);

    const notHaving = using.map(us => us.name).filter(use => actualIngsNames.indexOf(use) < 0);
    const having = actualIngs.filter(use => using.map(us => us.name).indexOf(use.name) > 0);

    let missings: any = [];

    having.forEach(have => {
        const use = using.filter(act => act.name == have.name)[0];

        const isKgToG = use.measurement == 'G' && have.measurement == 'KG';
        const isLToMl = use.measurement == 'ML' && have.measurement == 'L';

        const isGToKg = use.measurement == 'KG' && have.measurement == 'G';
        const isMlToL = use.measurement == 'L' && have.measurement == 'ML';

        let havingQuantity = have.quantity;

        if (isKgToG || isLToMl) {
            havingQuantity *= 1000;
        }

        if (isGToKg || isMlToL) {
            havingQuantity /= 1000;
        }

        const leaving = havingQuantity - use.quantity;
        if (leaving < 0) {
            missings.push({ name: have.name, missing: Math.abs(leaving) + ' ' + use.measurement })
        }
    });

    if (!dish) {
        return res.status(404).json({ message: ErrorMessages.DISH_NOT_FOUND });
    }

    return res.status(200).json({ dish, notHaving, missings });
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    const dishes: any = await Dish.find();

    if (!dishes) {
        return res.status(201).json({ message: ErrorMessages.GET_DISHES_NOT_FOUND });
    }

    let response = [];

    for (let dish of dishes) {
        const using = dish!.stuff;

        const actualIngs = await Ingredient.find();
        const actualIngsNames = actualIngs.map(act => act.name);

        const notHaving = using.map((us: any) => us.name).filter((use: any) => actualIngsNames.indexOf(use) < 0);
        const having = actualIngs.filter(use => using.map((us: any) => us.name).indexOf(use.name) > 0);

        let missings: any = [];

        having.forEach(have => {
            const use = using.filter((act: any) => act.name == have.name)[0];

            const isKgToG = use.measurement == 'G' && have.measurement == 'KG';
            const isLToMl = use.measurement == 'ML' && have.measurement == 'L';

            const isGToKg = use.measurement == 'KG' && have.measurement == 'G';
            const isMlToL = use.measurement == 'L' && have.measurement == 'ML';

            let havingQuantity = have.quantity;

            if (isKgToG || isLToMl) {
                havingQuantity *= 1000;
            }

            if (isGToKg || isMlToL) {
                havingQuantity /= 1000;
            }

            const leaving = havingQuantity - use.quantity;
            if (leaving < 0) {
                missings.push({ name: have.name, missing: Math.abs(leaving) + ' ' + use.measurement })
            }
        });
        response.push({ ...dish._doc, notHaving, missings })
    }

    return res.status(200).json(response);
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const dish = await Dish.findById(id).catch(error => {
        defaultCathError(ErrorMessages.GET_DISH_ERROR, error);
    });

    if (!dish) {
        return res.status(404).json({ message: ErrorMessages.DISH_NOT_FOUND });
    }

    dish.set(req.body);

    const updatedDish = await dish.save().catch(error => {
        defaultCathError(ErrorMessages.UPDATE_DISH_ERROR, error);
    })

    return res.status(200).json(updatedDish)
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    await Dish.findByIdAndDelete(id).catch(error => {
        defaultCathError(ErrorMessages.DELETE_INGREDIENT_ERROR, error);
    });

    return res.status(200).json({ deleted: true });
};

export const dishesController = errorWrapper(create, show, get, update, destroy);