import { errorResponse } from "../utils/response.js";
import type{ NextFunction, Request, Response } from "express";
import {  ZodError,type ZodTypeAny } from "zod";
//Shape of the data we validate from each request
type RequestData = {
  body?: unknown;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
};
export const validator = 
<T extends ZodTypeAny>(schema: T) => 
    async(req: Request, res: Response, next: NextFunction)=> {
        try {
            //combine request parts into one object for schema validation
            const parsed = await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            });
            const data = parsed as RequestData;
            //Mutate the original Express object in place with validated,
            const update = <K extends keyof RequestData>(
                target: unknown,
                source: RequestData[K]
            ) => {
              if (
                source === undefined ||
                typeof target !== "object" ||
                target === null
              )
                return;
              const t = target as Record<string, unknown>;
              // Clear old unvalidated keys before assigning sanitized values
              for(const key of Object.keys(t)) {
                delete t[key];
              }
              Object.assign(t, source);
            };
            update(req.body, data.body);
            update(req.params, data.params);
            update(req.query, data.query);
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
              return errorResponse(
                res,
                error.issues.map((e) => ({
                  path: e.path.join("."),
                  message: e.message,
                })),
                'Validation Error',
                400
              );
            }

            console.error("[Validator Error]:", error);

            return  errorResponse(res, null, 'Internal Server Error', 500);
        }
    }
