import { IPackage } from './iPackage';

export interface ITwoDay extends IPackage {
  flatFee: number;
  setFlatFee(fee: number): void;
  getFlatFee(): number;
}