import { handleErrors, winsorize, makeBins } from "../common/utils/data";
import { scatterHist } from "../scatter_hist";
import { simpleHist } from "../simple_hist";

// Mock Looker global object
global.LookerCharts = {
  Utils: {
    toggleCrossfilter: jest.fn(),
    openDrillMenu: jest.fn(),
  },
};

describe("Looker Visualization done() Callback and Defensive Logic Tests", () => {
  let doneMock;
  let visMock;
  let elementMock;
  let queryResponseMock;

  beforeEach(() => {
    doneMock = jest.fn();
    visMock = {
      addError: jest.fn(),
      clearErrors: jest.fn(),
      trigger: jest.fn(),
    };
    elementMock = {
      clientWidth: 800,
      clientHeight: 600,
      appendChild: jest.fn().mockImplementation((el) => el),
    };
    queryResponseMock = {
      fields: {
        pivots: [],
        dimension_like: [{ name: "order_items.id", label: "ID", type: "number" }],
        dimensions: [{ name: "order_items.id", label: "ID", type: "number" }],
        measure_like: [{ name: "order_items.count", label: "Count", type: "number", value_format: "#,##0" }],
        measures: [{ name: "order_items.count", label: "Count", type: "number", value_format: "#,##0" }],
      },
    };
  });

  describe("winsorize & makeBins safe parsing (no eval)", () => {
    test("winsorize correctly parses percentile string safely", () => {
      const sampleData = [{ val: 10 }, { val: 20 }, { val: 30 }, { val: 100 }];
      const result = winsorize(sampleData, "val", "5_95");
      expect(result).toBeDefined();
      expect(result.length).toBe(4);
    });

    test("makeBins correctly parses breakpoints safely without eval", () => {
      const sampleData = [{ val: 10 }, { val: 20 }, { val: 30 }, { val: 40 }];
      const result = makeBins(sampleData, "val", "min, 20, 30, max", "#,##0", "x");
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].bin_start_x).toBe(10);
      expect(result[0].bin_end_x).toBe(20);
    });
  });

  describe("done() callback execution in scatterHist & simpleHist", () => {
    test("scatterHist calls done() when dataProperties for x or y are missing", () => {
      const embedMock = jest.fn();
      const config = { x: "missing_x", y: "missing_y", bin_style: "binned_hist" };
      scatterHist([], elementMock, config, queryResponseMock, {}, doneMock, visMock, embedMock);
      expect(doneMock).toHaveBeenCalledTimes(1);
    });

    test("simpleHist calls done() when embed promise resolves", async () => {
      const mockView = { addEventListener: jest.fn() };
      const embedMock = jest.fn().mockResolvedValue({ spec: {}, view: mockView });
      const data = [{ order_items_id: 1, order_items_count: 50 }];
      const config = { bin_type: "bins", max_bins: "10", color_col: "#123456", color_on_hover: "#654321" };

      simpleHist(data, elementMock, config, queryResponseMock, { print: false }, doneMock, visMock, embedMock);

      await Promise.resolve(); // Wait for promise resolution
      expect(embedMock).toHaveBeenCalled();
      expect(doneMock).toHaveBeenCalledTimes(1);
    });

    test("simpleHist calls done() and registers error when embed promise rejects", async () => {
      const embedMock = jest.fn().mockRejectedValue(new Error("Vega embed failure"));
      const data = [{ order_items_id: 1, order_items_count: 50 }];
      const config = { bin_type: "bins", max_bins: "10" };

      simpleHist(data, elementMock, config, queryResponseMock, { print: false }, doneMock, visMock, embedMock);

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(visMock.addError).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Rendering Error" })
      );
      expect(doneMock).toHaveBeenCalledTimes(1);
    });

    test("scatterHist calls done() and registers error when embed promise rejects", async () => {
      const embedMock = jest.fn().mockRejectedValue(new Error("Scatter embed error"));
      const data = [{ order_items_id: 1, order_items_count: 50 }];
      const config = { x: "order_items_id", y: "order_items_count", bin_type: "bins" };

      queryResponseMock.fields.measure_like.push({ name: "order_items.amount", label: "Amount", type: "number" });

      scatterHist(data, elementMock, config, queryResponseMock, { print: false }, doneMock, visMock, embedMock);

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(visMock.addError).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Rendering Error" })
      );
      expect(doneMock).toHaveBeenCalledTimes(1);
    });
  });
});
