const invoiceService = require("../../../src/domains/sales/invoices/invoice.service");
const { Invoice } = require("../../../src/models");

jest.mock("../../../src/models", () => ({
  Invoice: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));

describe("Invoice Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all invoices", async () => {
    const mockInvoices = [{ id: 1, number: "INV-001" }];
    Invoice.findAll.mockResolvedValue(mockInvoices);

    const result = await invoiceService.getAllInvoices();
    expect(Invoice.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockInvoices);
  });

  it("should get invoice by ID", async () => {
    const mockInvoice = { id: 1, number: "INV-001" };
    Invoice.findByPk.mockResolvedValue(mockInvoice);

    const result = await invoiceService.getInvoiceById(1);
    expect(Invoice.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
    expect(result).toEqual(mockInvoice);
  });

  it("should create an invoice", async () => {
    const invoiceData = { number: "INV-002", amount: 1000 };
    const created = { id: 2, ...invoiceData };
    Invoice.create.mockResolvedValue(created);

    const result = await invoiceService.createInvoice(invoiceData);
    expect(Invoice.create).toHaveBeenCalledWith(invoiceData);
    expect(result).toEqual(created);
  });
});
