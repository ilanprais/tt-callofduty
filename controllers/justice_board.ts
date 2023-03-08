import express, { Request, Response } from 'express';

import getJusticeBoard from '../services/justice_board.service';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await getJusticeBoard();
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json(error.message);
    }
  }
});

export default router;
