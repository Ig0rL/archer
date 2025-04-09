import { Injectable } from '@nestjs/common';
import { IocContainer } from '@/ioc-container/ioc-container.service';
import { IMovable } from '@/commands/move/movable.interface';
import { ICommands } from '@/commands/commands.interface';

@Injectable()
export class MovableAdapter implements IMovable {
  constructor(private iocContainer: IocContainer) {}

  public getLocation(): any {
    const key = "IMovable:getLocation";
    const result = this.iocContainer.resolve<ICommands>(key, this);
    return result;
  }

  public setLocation(): any {
    const key = "IMovable:setLocation";
    const result = this.iocContainer.resolve<ICommands>(key, this);
    return result;
  }

  public getVelocity(): any {
    const key = "IMovable:getVelocity";
    const result = this.iocContainer.resolve<ICommands>(key, this);
    return result;
  }

}
