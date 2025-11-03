import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { OrderService } from 'src/domain/entities/orderService.entity';
import { AppLoggerService } from '../logger/logger.service';
import { CreateOrderServiceDto } from '../../dtos/orderService/create-orderService.dto';
import { ReadOrderServiceDto } from '../../dtos/orderService/read-orderService.dto';
import { UpdateOrderServiceDto } from '../../dtos/orderService/update-orderService.dto';
import { Title } from 'src/domain/values-objects/orderService.values-objects/title.values-objects';
import { Description } from 'src/domain/values-objects/orderService.values-objects/description.values-objects';
import { Price } from 'src/domain/values-objects/orderService.values-objects/price.values-objects';
import type { OrderServiceRepository } from 'src/domain/repositories/orderService.repository';
import { ORDER_SERVICE_REPOSITORY } from 'src/domain/repositories/orderService.repository';
import type { ProviderRepository } from 'src/domain/repositories/provider.repository';
import { PROVIDER_REPOSITORY } from 'src/domain/repositories/provider.repository';
import type { OrderRepository } from 'src/domain/repositories/order.repository';
import { ORDER_REPOSITORY } from 'src/domain/repositories/order.repository';
import { StatusEnum } from 'src/domain/entities/enums/status.enum';

@Injectable()
export class OrderServiceService {
  constructor(
    @Inject(ORDER_SERVICE_REPOSITORY)
    private readonly orderServiceRepository: OrderServiceRepository,
    @Inject(PROVIDER_REPOSITORY)
    private readonly providerRepository: ProviderRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(OrderServiceService.name);
  }

  async create(
    createOrderServiceDto: CreateOrderServiceDto,
  ): Promise<OrderService> {
    try {
      this.logger.info(
        `Creating order service with title: ${createOrderServiceDto.title}`,
      );

      const provider = await this.providerRepository.findById(
        createOrderServiceDto.providerId,
      );

      if (!provider) {
        throw new BadRequestException('Provider not found');
      }

      const orderService = new OrderService();
      orderService.title = new Title(createOrderServiceDto.title);
      orderService.description = new Description(
        createOrderServiceDto.description,
      );
      orderService.price = Price.create(createOrderServiceDto.price);
      orderService.providerId = createOrderServiceDto.providerId;

      if (createOrderServiceDto.status) {
        orderService.status = createOrderServiceDto.status;
      }

      const savedOrderService =
        await this.orderServiceRepository.save(orderService);

      this.logger.info(
        `Order service created with ID: ${savedOrderService.id}`,
      );

      return savedOrderService;
    } catch (error) {
      this.logger.error(
        `Error creating order service with title: ${createOrderServiceDto.title}`,
      );
      throw error;
    }
  }

  async findAll(): Promise<ReadOrderServiceDto[]> {
    try {
      this.logger.info('Fetching all order services');

      const orderServices = await this.orderServiceRepository.findAll();

      this.logger.info(`Found ${orderServices.length} order services`);

      return orderServices.map((os) => ({
        id: os.id,
        title: os.title.toString(),
        description: os.description.toString(),
        price: os.price.toNumber(),
        status: os.status,
        providerId: os.providerId,
        provider: {
          id: os.provider.id,
          user: {
            id: os.provider.user.id,
            email: os.provider.user.email.toString(),
            active: os.provider.user.active,
          },
          name: os.provider.name,
          prof_description: os.provider.prof_description.value,
        },
      }));
    } catch (error) {
      this.logger.error(
        `Error fetching all order services. Error details: ${error}`,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<ReadOrderServiceDto | null> {
    try {
      this.logger.info(`Fetching order service with ID: ${id}`);

      const orderService = await this.orderServiceRepository.findById(id);

      if (!orderService) {
        this.logger.error(`Order service not found with ID: ${id}`);
        return null;
      }

      this.logger.info(`Order service found: ${orderService.title.toString()}`);

      return {
        id: orderService.id,
        title: orderService.title.toString(),
        description: orderService.description.toString(),
        price: orderService.price.toNumber(),
        status: orderService.status,
        providerId: orderService.providerId,
        provider: {
          id: orderService.provider.id,
          user: {
            id: orderService.provider.user.id,
            email: orderService.provider.user.email.toString(),
            active: orderService.provider.user.active,
          },
          name: orderService.provider.name,
          prof_description: orderService.provider.prof_description.value,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error fetching order service with ID ${id}. Error: ${error}`,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateOrderServiceDto: UpdateOrderServiceDto,
  ): Promise<OrderService | null> {
    try {
      this.logger.info(`Updating order service with ID: ${id}`);

      const orderService = await this.orderServiceRepository.findById(id);

      if (!orderService) {
        return null;
      }

      if (updateOrderServiceDto.title) {
        orderService.title = new Title(updateOrderServiceDto.title);
      }

      if (updateOrderServiceDto.description) {
        orderService.description = new Description(
          updateOrderServiceDto.description,
        );
      }

      if (updateOrderServiceDto.price) {
        orderService.price = Price.create(updateOrderServiceDto.price);
      }

      if (updateOrderServiceDto.providerId) {
        const provider = await this.providerRepository.findById(
          updateOrderServiceDto.providerId,
        );

        if (!provider) {
          throw new BadRequestException('Provider not found');
        }

        orderService.providerId = updateOrderServiceDto.providerId;
      }

      if (updateOrderServiceDto.status) {
        orderService.status = updateOrderServiceDto.status;
      }

      const updatedOrderService = await this.orderServiceRepository.update(
        id,
        orderService,
      );

      this.logger.info(
        `Order service updated: ${updatedOrderService.title.toString()}`,
      );

      return updatedOrderService;
    } catch (error) {
      this.logger.error(
        `Error updating order service with ID ${id}. Error: ${error}`,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.info(`Attempting to delete order service with ID: ${id}`);

      const linkedOrders = await this.orderRepository.findByServiceId(id);

      if (linkedOrders.length > 0) {
        this.logger.info(
          `Order service has ${linkedOrders.length} linked orders. Inactivating instead of deleting.`,
        );

        await this.update(id, { status: StatusEnum.INACTIVE });

        this.logger.info(
          `Order service inactivated due to linked orders: ${id}`,
        );
      } else {
        await this.orderServiceRepository.delete(id);

        this.logger.info(`Order service physically deleted: ${id}`);
      }
    } catch (error) {
      this.logger.error(
        `Error removing order service with ID ${id}. Error: ${error}`,
      );
      throw error;
    }
  }
}
