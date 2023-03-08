import getJusticeBoard from '../repositories/justice_board.repository';

const getJusticeBoardService = async () => {
  const result = await getJusticeBoard();
  return result;
};

export default getJusticeBoardService;
