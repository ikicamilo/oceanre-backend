const periodService = require("../../../src/domains/accounting/periods/period.service");
const { AccountingPeriod } = require("../../../src/models");

jest.mock("../../../src/models", () => ({
  AccountingPeriod: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(), // <-- IMPORTANT
    create: jest.fn(),
  },
}));

describe("Accounting Period Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all periods", async () => {
    const mockPeriods = [{ id: 1, period_name: "2025-01" }];
    AccountingPeriod.findAll.mockResolvedValue(mockPeriods);

    const result = await periodService.getAllPeriods();
    expect(AccountingPeriod.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockPeriods);
  });

  it("should get a period by ID", async () => {
    const mockPeriod = { id: 1, period_name: "2025-01" };
    AccountingPeriod.findByPk.mockResolvedValue(mockPeriod);

    const result = await periodService.getPeriodById(1);
    expect(AccountingPeriod.findByPk).toHaveBeenCalledWith(1); // <-- FIXED
    expect(result).toEqual(mockPeriod);
  });

  it("should create a period", async () => {
    const periodData = { period_name: "2025-02", start_date: "2025-02-01", end_date: "2025-02-28" };
    AccountingPeriod.findOne.mockResolvedValue(null); // no duplicates
    AccountingPeriod.create.mockResolvedValue({ id: 2, ...periodData });

    const result = await periodService.createPeriod(periodData, 1);

    expect(AccountingPeriod.findOne).toHaveBeenCalledWith({
      where: { period_name: periodData.period_name },
    });

    expect(AccountingPeriod.create).toHaveBeenCalledWith({
      ...periodData,
      status: "OPEN",
      created_by: 1,
    });

    expect(result).toEqual({ id: 2, ...periodData });
  });
});
