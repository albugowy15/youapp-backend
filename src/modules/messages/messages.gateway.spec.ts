import { Test, TestingModule } from '@nestjs/testing';
import { MessagesGateway } from './messages.gateway';
import { MessagesRepository } from './messages.repository';

describe('MessagesGateway', () => {
  let gateway: MessagesGateway;

  const mockMessagesRepository = {
    create: jest.fn(),
    findByFromUserIDOrToUserID: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesGateway,
        { provide: MessagesRepository, useValue: mockMessagesRepository },
      ],
    }).compile();

    gateway = module.get<MessagesGateway>(MessagesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
