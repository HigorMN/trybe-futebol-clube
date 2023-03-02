import IMatches from './IMatches';

export default interface IResponse {
  type?: number;
  message?: string;
  token?: string;
  createdMatche?: IMatches;
}
