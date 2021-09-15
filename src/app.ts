import Redis from 'ioredis';
import moment from 'moment-timezone';

type TClient = {
  get: (key: any) => Promise<any>;
  set: (key: any, value: any) => Promise<any>;
  incr: (key: any) => Promise<number>;
};

interface IInitIpCount {
  client?: TClient;
  maxTimeInSeconds: number;
  maxHits: number;
}

export default class IpHitCount {
  private client: TClient;
  private maxTime: number;
  private initTime: moment.Moment;
  private maxHits: number;
  private noOfHits: number;

  constructor(init: IInitIpCount) {
    this.client = init.client || new Redis();
    this.maxHits = init.maxHits;
    this.maxTime = init.maxTimeInSeconds;
    this.noOfHits = 0;
    this.initTime = moment.utc(); // uhm, this is IP specific so??
  }

  checkTimeFrame() {
    const now = moment.utc();
    const maxTime = this.initTime.add(this.maxTime, 'seconds');
    return now.isBefore(maxTime);
  }

  async getCount(ip: string) {
    return this.client.get(ip);
  }

  async createIPKey(ip: string) {
    this.client.set(ip, 1);
  }

  protected async increaseHit(ip: string): Promise<void> {
    await this.client.incr(ip);
  }

  resetHits() {
    this.noOfHits = 0;
  }

  async checkHits(ip: string) {
    if (!this.checkTimeFrame()) {
      // error here: Not all ips will hit together and this means we can't reset them all together.
      // probable solution: save as json string of the form { count, initTime }
      this.resetHits();
    }
    const count = await this.getCount(ip);
    if (!count) {
      return Boolean(this.createIPKey(ip));
    } else {
      if (count < this.maxHits) {
      }
    }
  }
}
