import { getEntity } from '../getEntity';
import GError from '../../error-handler/GError';
import { Transaction } from 'sequelize';

describe('getEntity', () => {
  const mockRepository = {
    findById: jest.fn(),
  };

  const mockTransaction = {}; // You can provide a mock transaction object if needed

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return the entity when found', async () => {
    const mockEntity = { id: '1', name: 'Test Entity' };
    mockRepository.findById.mockResolvedValue(mockEntity); // Mocking successful retrieval

    const result = await getEntity(
      '1',
      'TestEntity',
      mockRepository,
      'getEntity',
      'TestService',
      mockTransaction as Transaction
    );

    expect(result).toEqual(mockEntity); // Verify the returned entity
    expect(mockRepository.findById).toHaveBeenCalledWith('1', mockTransaction); // Verify that findById was called with correct parameters
  });

  it('should throw GError when entity is not found', async () => {
    mockRepository.findById.mockResolvedValue(null); // Mocking unsuccessful retrieval

    await expect(
      getEntity(
        '2',
        'TestEntity',
        mockRepository,
        'getEntity',
        'TestService',
        mockTransaction as Transaction
      )
    ).rejects.toThrow(GError); // Expect GError to be thrown

    await expect(
      getEntity(
        '2',
        'TestEntity',
        mockRepository,
        'getEntity',
        'TestService',
        mockTransaction as Transaction
      )
    ).rejects.toThrow('TestEntity does not exist'); // Check the error message

    expect(mockRepository.findById).toHaveBeenCalledWith('2', mockTransaction); // Verify that findById was called with correct parameters
  });

  it('should throw GError with correct properties', async () => {
    mockRepository.findById.mockResolvedValue(null); // Mocking unsuccessful retrieval

    await expect(
      getEntity(
        '3',
        'AnotherEntity',
        mockRepository,
        'getEntity',
        'AnotherService'
      )
    ).rejects.toThrow(GError); // Expect GError to be thrown

    const expectedError = new GError({
      message: 'AnotherEntity does not exist',
      status: 400,
      methodName: 'getEntity',
      serviceName: 'AnotherService',
    });

    await expect(
      getEntity(
        '3',
        'AnotherEntity',
        mockRepository,
        'getEntity',
        'AnotherService'
      )
    ).rejects.toEqual(expect.objectContaining(expectedError)); // Check the properties of the error
  });
});
