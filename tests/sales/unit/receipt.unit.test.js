const receiptService = require("../../../src/domains/sales/receipts/receipt.service");
const { Receipt } = require("../../../src/models");

jest.mock("../../../src/models", () => ({
  Receipt: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));

describe("Receipt Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all receipts", async () => {
    const mockReceipts = [{ id: 1, number: "RCPT-001" }];
    Receipt.findAll.mockResolvedValue(mockReceipts);

    const result = await receiptService.getAllReceipts();
    expect(Receipt.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockReceipts);
  });

  it("should get receipt by ID", async () => {
    const mockReceipt = { id: 1, number: "RCPT-001" };
    Receipt.findByPk.mockResolvedValue(mockReceipt);

    const result = await receiptService.getReceiptById(1);
    expect(Receipt.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
    expect(result).toEqual(mockReceipt);
  });

  it("should create a receipt", async () => {
    const receiptData = { receipt_number: "RCPT-002", amount: 1000 };
    const created = { id: 2, ...receiptData };
    Receipt.create.mockResolvedValue(created);

    const result = await receiptService.createReceipt(receiptData);

    expect(Receipt.create).toHaveBeenCalledWith({
      receipt_number: "RCPT-002",
      amount: 1000,
      currency: "USD",
      invoice_id: null,
      period_id: null,
      customer_id: undefined,
      payment_date: undefined,
      created_by: undefined,
    });

    expect(result).toEqual(created);
  });
});
