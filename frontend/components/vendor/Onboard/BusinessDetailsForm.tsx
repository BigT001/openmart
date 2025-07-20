import React from "react";

interface BusinessDetailsFormProps {
  form: any;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCategoryToggle: (cat: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error: string;
  categories: string[];
  toggleCategoryDropdown: () => void;
}

const BusinessDetailsForm: React.FC<BusinessDetailsFormProps> = ({ form, handleChange, handleCategoryToggle, handleSubmit, loading, error, categories, toggleCategoryDropdown }) => {
  // Removed businessNameError state
  const [businessPhoneError, setBusinessPhoneError] = React.useState("");
  const [step, setStep] = React.useState(1);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };

  const isLastStep = step === 3;

  return (
    <form onSubmit={isLastStep ? handleSubmit : handleNext} className="flex-1 w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
      {/* ...existing code... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {step === 1 && (
          <>
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black mb-2">Business Information</h2>
                {/* <p className="text-black text-sm mb-2">Please provide your business details. This helps us verify your business and improve your onboarding experience.</p> */}
              </div>
              <div className="relative mt-4">
                <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">Account Type</label>
                <div className="flex gap-6 pt-5">
                  <label
                    className={`flex flex-col items-center justify-center gap-1 px-3 py-2 border-2 rounded-lg 
                      cursor-pointer transition-all duration-200 shadow-sm text-base ${form.account_type === "Business" ? "border-black bg-gray-50" : "border-gray-300 bg-white"}`}
                    style={{ minWidth: 80 }}
                  >
                    <input type="radio" name="account_type" value="Business" checked={form.account_type === "Business"} onChange={handleChange} className="hidden" required />
                    <span className="flex items-center gap-2">
                      {/* Business icon */}
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black"><rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V4a3 3 0 0 1 6 0v3"/></svg>
                      <span className="font-semibold text-black">Business</span>
                    </span>
                  </label>
                  <label
                    className={`flex flex-col items-center justify-center gap-1 px-3 py-2 border-2 rounded-lg cursor-pointer transition-all duration-200 shadow-sm text-base ${form.account_type === "Individual" ? "border-black bg-gray-50" : "border-gray-300 bg-white"}`}
                    style={{ minWidth: 80 }}
                  >
                    <input type="radio" name="account_type" value="Individual" checked={form.account_type === "Individual"} onChange={handleChange} className="hidden" required />
                    <span className="flex items-center gap-2">
                      {/* Individual icon */}
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black"><circle cx="12" cy="10" r="4"/><path d="M4 20c0-3.333 2.667-6 8-6s8 2.667 8 6"/></svg>
                      <span className="font-semibold text-black">Individual</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="relative mt-4">
                <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">Business Name</label>
                <input
                  name="business_name"
                  type="text"
                  value={form.business_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 pt-3 pb-2 border-2 border-black rounded-lg focus:outline-none bg-white text-black text-base"
                  placeholder="e.g. Arewa Foods"
                />
              </div>
            </div>
            <div className="col-span-1">
              <div className="relative mt-4">
                <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">Business Phone</label>
                <div className="relative flex items-center mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-semibold pointer-events-none">+234</span>
                  <input
                    name="business_phone"
                    type="tel"
                    value={form.business_phone}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      if (e.target.value.match(/[^0-9]/)) {
                        setBusinessPhoneError("Only numbers are allowed.");
                      } else {
                        setBusinessPhoneError("");
                      }
                      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                      if (nativeInputValueSetter) {
                        nativeInputValueSetter.call(e.target, val);
                      }
                      handleChange(e);
                    }}
                    required
                    inputMode="numeric"
                    className="pl-16  pt-2 pb-2 w-full border-2 border-black rounded-lg focus:outline-none bg-white text-black text-base tracking-wider"
                    placeholder="8012345678"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    minLength={10}
                    autoComplete="off"
                  />
                </div>
                {businessPhoneError && <span className="text-xs text-red-500 mt-2 block w-full">{businessPhoneError}</span>}
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <div className="relative mt-4">
                <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">Business Description</label>
                <textarea name="business_description" value={form.business_description} onChange={handleChange} required className="w-full px-3 pt-2 pb-2 border-2 border-black rounded-lg focus:outline-none bg-white text-black text-base" rows={2} style={{minHeight: '48px'}} placeholder="Tell us about your business..." />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <div className="relative mt-4">
                <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">Business Address</label>
                <input name="business_address" value={form.business_address} onChange={handleChange} required className="w-full px-6 pt-5 pb-3 border-2 border-black rounded-lg focus:outline-none bg-white text-black" placeholder="e.g. Kano, Nigeria" />
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="col-span-1 md:col-span-2 relative">
              <div className="relative mt-4">
                <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">Business Categories <span className="text-xs text-black/70">(Select all that apply)</span></label>
                <div className="relative pt-5">
                  <button type="button" onClick={toggleCategoryDropdown} className="w-full flex justify-between items-center px-6 py-3 border-2 border-black rounded-lg bg-white text-black font-semibold focus:outline-none focus:border-black transition">
                    {form.categories.length > 0 ? form.categories.join(", ") : "Select categories"}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ml-2 transition-transform ${form.showCategories ? "rotate-180" : "rotate-0"}`}> 
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25L12 15.75 4.5 8.25" />
                    </svg>
                  </button>
                  {form.showCategories && (
                    <div className="absolute left-0 right-0 z-20 mt-2 bg-white border-2 border-black rounded-lg shadow-lg p-4 flex flex-wrap gap-3">
                      {categories.map((cat) => (
                        <button type="button" key={cat} onClick={() => handleCategoryToggle(cat)} className={`px-4 py-2 rounded-full border-2 transition-all duration-200 text-sm font-semibold focus:outline-none ${form.categories.includes(cat) ? "bg-black text-white border-black shadow" : "bg-white text-black border-black hover:bg-black hover:text-white"}`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <div className="relative mt-4">
                <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">Landmark <span className="text-xs text-black/70">*</span></label>
                <input name="shop_name" value={form.shop_name || ""} onChange={handleChange} required className="w-full px-6 pt-5 pb-3 border-2 border-black rounded-lg focus:outline-none bg-white text-black" placeholder="e.g. Landmark" />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <div className="relative mt-4">
                <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">Shipping Zone</label>
                <input name="shipping_zone" value={form.shipping_zone || ""} onChange={handleChange} required className="w-full px-6 pt-5 pb-3 border-2 border-black rounded-lg focus:outline-none bg-white text-black" placeholder="e.g. North West" />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <div className="relative mt-4">
                <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">How did you hear about OpenMart?</label>
                <input name="referral_source" value={form.referral_source || ""} onChange={handleChange} className="w-full px-6 pt-5 pb-3 border-2 border-black rounded-lg focus:outline-none bg-white text-black" placeholder="e.g. Social Media, Friend, etc." />
              </div>
            </div>
          </>
        )}
      </div>
      {step === 3 && (
        <div className="col-span-1 md:col-span-2 flex flex-col items-start gap-4 mt-4">
          <div className="w-full">
            <div className="relative mt-4">
              <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">CAC Registration Number <span className="text-xs text-black/70">*</span></label>
              <input
                name="cac_registration_number"
                type="text"
                value={form.cac_registration_number || ""}
                onChange={handleChange}
                required
                className="w-full px-4 pt-3 pb-2 border-2 border-black rounded-lg focus:outline-none bg-white text-black text-base"
                placeholder="e.g. RC1234567"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <input type="checkbox" name="business_terms" checked={form.business_terms || false} onChange={handleChange} className="h-5 w-5 text-black border-2 border-black rounded focus:ring-black" required />
            <span className="text-black text-sm">I hereby confirm that I have read and I agree to the OpenMart seller contract, OpenMart codes, policies and guidelines and Privacy Notice and Cookie Notice referenced therein.</span>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 px-4 mt-4 bg-gradient-to-r from-[#23182b] to-black text-white font-bold rounded-lg shadow-md hover:from-black hover:to-[#181024] transition text-lg border border-black">
            {loading ? "Submitting..." : "Submit & Continue"}
          </button>
        </div>
      )}
      {error && <div className="text-red-400 font-semibold text-center mt-4">{error}</div>}
      {step < 3 && (
        <button type="submit" disabled={loading} className="w-full py-3 px-4 mt-8 bg-gradient-to-r from-[#23182b] to-black text-white font-bold rounded-lg shadow-md hover:from-black hover:to-[#181024] transition text-lg border border-black">
          {loading ? "Continue..." : "Continue"}
        </button>
      )}
    </form>
  );
}

export default BusinessDetailsForm;
