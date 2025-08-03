import React, { useState } from "react";

// Example: Replace with real data from API/props
const mockBank = {
  bank_name: "First Bank",
  bank_account_number: "1234567890",
  bank_account_name: "Acme Corp",
  card_last4: "1234",
  connected: false, // set to true if bank/card is connected
};

const VendorBanks: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full mt-0 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-black">Bank & Card Details</h2>
      {mockBank.connected ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Bank Name</label>
            <div className="mt-1 text-lg text-black">{mockBank.bank_name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Account Number</label>
            <div className="mt-1 text-lg text-black">{mockBank.bank_account_number}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Account Name</label>
            <div className="mt-1 text-lg text-black">{mockBank.bank_account_name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Card (Last 4)</label>
            <div className="mt-1 text-lg text-black">**** **** **** {mockBank.card_last4}</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-4">No bank or card details connected.</p>
          <button
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition font-semibold shadow"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "Add Bank/Card Details"}
          </button>
          {showForm && (
            <form className="mt-6 w-full max-w-sm space-y-4">
              <input className="w-full p-2 rounded border border-gray-300 text-black" placeholder="Bank Name" />
              <input className="w-full p-2 rounded border border-gray-300 text-black" placeholder="Account Number" />
              <input className="w-full p-2 rounded border border-gray-300 text-black" placeholder="Account Name" />
              <input className="w-full p-2 rounded border border-gray-300 text-black" placeholder="Card Number" />
              <button type="submit" className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 font-semibold shadow">Save</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorBanks;
