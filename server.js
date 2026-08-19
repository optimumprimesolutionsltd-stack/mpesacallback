const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "mpesa-callback-api",
    timestamp: new Date().toISOString()
  });
});

// M-PESA STK Push callback
app.post("/mpesa/callback", async (req, res) => {
  try {
    const callback = req.body;

    console.log("M-PESA callback received:", JSON.stringify(callback));

    const stkCallback = callback?.Body?.stkCallback;

    if (!stkCallback) {
      console.warn("Invalid M-PESA callback received");

      return res.status(400).json({
        ResultCode: 1,
        ResultDesc: "Invalid callback payload"
      });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc
    } = stkCallback;

    console.log({
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc
    });

    // TODO:
    // Save transaction to PostgreSQL/database.
    // TODO:
    // Process successful payment.
    // TODO:
    // Implement duplicate transaction protection.

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Accepted"
    });

  } catch (error) {
    console.error("Callback processing error:", error);

    return res.status(500).json({
      ResultCode: 1,
      ResultDesc: "Internal server error"
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found"
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`M-PESA callback API running on port ${PORT}`);
});
