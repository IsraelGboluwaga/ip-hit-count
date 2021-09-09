import Redis from 'ioredis';

interface IInitIpCount {
  client?: {
    get: (key: any) => Promise<any>,
    set: (key: any, value: any) => Promise<any>
    incr: (key: any) => Promise<number>,
  };
  maxTime: number;
  maxHits: number;
}

export default class IpHitCount {
  private client;
  private maxTime;
  private maxHits;

  constructor(init: IInitIpCount) {
    this.client = init.client || new Redis();
    this.maxHits = init.maxHits;
    this.maxTime = init.maxTime;
  }
}
