import { IPackage } from './iPackage';

export interface IOneDay extends IPackage {
  flatFee: number;
  setFlatFee(fee: number): void;
  getFlatFee(): number;
}