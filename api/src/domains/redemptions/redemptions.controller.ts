import { Request, Response, NextFunction } from 'express';
import { redemptionsService } from './redemptions.service';
import { createRedemptionSchema, rejectRedemptionSchema, redemptionFilterSchema } from './redemptions.dto';
import { AppError } from '../../shared/utils/AppError';

export class RedemptionsController {
  async getRedemptions(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedQuery = redemptionFilterSchema.safeParse(req.query);
      if (!parsedQuery.success) {
        throw new AppError(400, 'BAD_REQUEST', parsedQuery.error.message);
      }

      const { redemptions, total, page, limit } = await redemptionsService.getRedemptions(
        parsedQuery.data,
        req.user!.role,
        req.user!.sub
      );

      res.status(200).json({
        success: true,
        data: redemptions,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getRedemptionById(req: Request, res: Response, next: NextFunction) {
    try {
      const redemption = await redemptionsService.getRedemptionById(req.params.id as string, req.user!.role, req.user!.sub);
      res.json({ success: true, data: redemption });
    } catch (error) {
      next(error);
    }
  }

  async createRedemption(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createRedemptionSchema.parse(req.body);
      const redemption = await redemptionsService.createRedemption(data, req.user!.sub);
      res.status(201).json({ success: true, data: redemption });
    } catch (error) {
      next(error);
    }
  }

  async approveRedemption(req: Request, res: Response, next: NextFunction) {
    try {
      const redemption = await redemptionsService.approveRedemption(req.params.id as string, req.user!.sub);
      res.json({ success: true, data: redemption });
    } catch (error) {
      next(error);
    }
  }

  async rejectRedemption(req: Request, res: Response, next: NextFunction) {
    try {
      const data = rejectRedemptionSchema.parse(req.body);
      const redemption = await redemptionsService.rejectRedemption(req.params.id as string, data.rejectionNote, req.user!.sub);
      res.json({ success: true, data: redemption });
    } catch (error) {
      next(error);
    }
  }
}

export const redemptionsController = new RedemptionsController();
