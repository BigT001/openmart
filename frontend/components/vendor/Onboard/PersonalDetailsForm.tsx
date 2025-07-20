import React from "react";

interface PersonalDetailsFormProps {
  form: any;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error: string;
}

export default function PersonalDetailsForm({ form, handleChange, handleSubmit, loading, error }: PersonalDetailsFormProps) {
  const [firstNameError, setFirstNameError] = React.useState("");
  const [lastNameError, setLastNameError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [lgaError, setLgaError] = React.useState("");
  const [cityError, setCityError] = React.useState("");
  const [landmarkError, setLandmarkError] = React.useState("");
  const [step, setStep] = React.useState(1);

  // Step 1: Basic personal info
  const handleStep1Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation
    if (!form.first_name || !form.last_name || !form.phone || !form.gender || !form.birth_date) {
      return;
    }
    setStep(2);
  };

  // Step 2: Address and extra info
  const handleStep2Submit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
  };

  return (
    <div className="flex-1 w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
      {step === 1 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">Personal Information</h2>
          <p className="text-black text-sm mb-2">Please provide your personal details. This helps us verify your identity and improve your onboarding experience.</p>
        </div>
      )}
      <div className="w-full">
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <div className="relative mt-4">
                  <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={e => {
                      let val = e.target.value.replace(/[^a-zA-Z ]/g, "");
                      val = val.replace(/ +/g, " ").trim();
                      // Validation: at least 3 chars, only letters, no consecutive spaces, not common fake names
                      const fakeNames = ["test", "admin", "user", "unknown", "none", "null", "name", "firstname", "lastname", "abc", "qwerty", "asdf", "demo", "sample"];
                      if (val.length < 3) {
                        setFirstNameError("First name must be at least 3 letters.");
                      } else if (!/^[A-Za-z ]+$/.test(val)) {
                        setFirstNameError("First name must contain only letters.");
                      } else if (fakeNames.includes(val.toLowerCase())) {
                        setFirstNameError("Please enter a valid first name.");
                      } else {
                        setFirstNameError("");
                      }
                      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                      if (nativeInputValueSetter) {
                        nativeInputValueSetter.call(e.target, val);
                      }
                      handleChange(e);
                    }}
                    required
                    className="w-full px-4 pt-3 pb-2 border-2 border-black rounded-lg focus:outline-none bg-white text-black text-base"
                    placeholder="As in your national ID"
                  />
                  {firstNameError && <span className="text-xs text-red-500 mt-2 block">{firstNameError}</span>}
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative mt-4">
                  <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={e => {
                      let val = e.target.value.replace(/[^a-zA-Z ]/g, "");
                      val = val.replace(/ +/g, " ").trim();
                      const fakeNames = ["test", "admin", "user", "unknown", "none", "null", "name", "firstname", "lastname", "abc", "qwerty", "asdf", "demo", "sample"];
                      if (val.length < 3) {
                        setLastNameError("Last name must be at least 3 letters.");
                      } else if (!/^[A-Za-z ]+$/.test(val)) {
                        setLastNameError("Last name must contain only letters.");
                      } else if (fakeNames.includes(val.toLowerCase())) {
                        setLastNameError("Please enter a valid last name.");
                      } else {
                        setLastNameError("");
                      }
                      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                      if (nativeInputValueSetter) {
                        nativeInputValueSetter.call(e.target, val);
                      }
                      handleChange(e);
                    }}
                    required
                    className="w-full text-sm px-4 pt-3 pb-2 border-2 border-black rounded-lg focus:outline-none bg-white text-black text-base"
                    placeholder="As in your national ID"
                  />
                  {lastNameError && <span className="text-xs text-red-500 mt-2 block">{lastNameError}</span>}
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative mt-4">
                  <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">Phone Number</label>
                  <div className="relative flex items-center mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-semibold pointer-events-none">+234</span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={e => {
                        // Only allow numbers
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        // Error if starts with 0
                        if (val.startsWith("0")) {
                          setPhoneError("Phone number cannot start with 0.");
                        } else {
                          setPhoneError("");
                        }
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                        if (nativeInputValueSetter) {
                          nativeInputValueSetter.call(e.target, val);
                        }
                        handleChange(e);
                      }}
                      required
                      inputMode="numeric"
                      className="pl-16  pt-2 pb-2 w-full border-2 border-black rounded-lg 
                                focus:outline-none bg-white text-black text-base tracking-wider"
                      placeholder="8012345678"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      minLength={10}
                      autoComplete="off"
                    />
                  </div>
                  {phoneError && <span className="text-xs text-red-500 mt-2 block w-full">{phoneError}</span>}
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative mt-4">
                  <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} required className="w-full px-6 pt-5 pb-3 border-2 border-black rounded-lg focus:outline-none bg-white text-black">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2">
                <div className="relative mt-4">
                  <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">Birth date</label>
                  <input
                    name="birth_date"
                    type="date"
                    value={form.birth_date}
                    onChange={handleChange}
                    required
                    className="w-full px-6 pt-5 pb-3 border-2 border-black rounded-lg focus:outline-none bg-white text-black"
                    placeholder="YYYY-MM-DD"
                    min="1920-01-01"
                    max="2007-12-31"
                  />
                  <span className="text-xs text-gray-500 mt-1 block">Year must be between 1920 and 2007</span>
                </div>
              </div>
            </div>
            {error && <div className="text-red-400 font-semibold text-center mt-4">{error}</div>}
            <button type="submit" disabled={loading} className="w-full py-3 px-4 mt-8 bg-gradient-to-r from-[#23182b] to-black text-white font-bold rounded-lg shadow-md hover:from-black hover:to-[#181024] transition text-lg">
              Continue
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <div className="relative mt-4">
                  <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">State</label>
                  <select name="state" value={form.state || ""} onChange={handleChange} required className="w-full px-6 pt-5 pb-3 border-2 border-black rounded-lg focus:outline-none bg-white text-black">
                    <option value="">Select State</option>
                    <option value="Abia">Abia</option>
                    <option value="Adamawa">Adamawa</option>
                    <option value="Akwa Ibom">Akwa Ibom</option>
                    <option value="Anambra">Anambra</option>
                    <option value="Bauchi">Bauchi</option>
                    <option value="Bayelsa">Bayelsa</option>
                    <option value="Benue">Benue</option>
                    <option value="Borno">Borno</option>
                    <option value="Cross River">Cross River</option>
                    <option value="Delta">Delta</option>
                    <option value="Ebonyi">Ebonyi</option>
                    <option value="Edo">Edo</option>
                    <option value="Ekiti">Ekiti</option>
                    <option value="Enugu">Enugu</option>
                    <option value="FCT">FCT</option>
                    <option value="Gombe">Gombe</option>
                    <option value="Imo">Imo</option>
                    <option value="Jigawa">Jigawa</option>
                    <option value="Kaduna">Kaduna</option>
                    <option value="Kano">Kano</option>
                    <option value="Katsina">Katsina</option>
                    <option value="Kebbi">Kebbi</option>
                    <option value="Kogi">Kogi</option>
                    <option value="Kwara">Kwara</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Nasarawa">Nasarawa</option>
                    <option value="Niger">Niger</option>
                    <option value="Ogun">Ogun</option>
                    <option value="Ondo">Ondo</option>
                    <option value="Osun">Osun</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Plateau">Plateau</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Sokoto">Sokoto</option>
                    <option value="Taraba">Taraba</option>
                    <option value="Yobe">Yobe</option>
                    <option value="Zamfara">Zamfara</option>
                  </select>
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative mt-4">
                  <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">LGA</label>
                  <input
                    type="text"
                    name="lga"
                    value={form.lga || ""}
                    onChange={e => {
                      let val = e.target.value.replace(/[^a-zA-Z ]/g, "");
                      val = val.replace(/ +/g, " ").trim();
                      if (e.target.value.match(/[^a-zA-Z ]/)) {
                        setLgaError("Only letters are allowed. Numbers or symbols are not permitted.");
                      } else {
                        setLgaError("");
                      }
                      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                      if (nativeInputValueSetter) {
                        nativeInputValueSetter.call(e.target, val);
                      }
                      handleChange(e);
                    }}
                    required
                    className="w-full px-6 pt-5 pb-3 border-2 border-black rounded-lg focus:outline-none bg-white text-black"
                    placeholder="Select LGA"
                  />
                  {lgaError && <span className="text-xs text-red-500 mt-2 block">{lgaError}</span>}
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative mt-4">
                  <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city || ""}
                    onChange={e => {
                      let val = e.target.value.replace(/[^a-zA-Z ]/g, "");
                      val = val.replace(/ +/g, " ").trim();
                      if (e.target.value.match(/[^a-zA-Z ]/)) {
                        setCityError("Only letters are allowed. Numbers or symbols are not permitted.");
                      } else {
                        setCityError("");
                      }
                      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                      if (nativeInputValueSetter) {
                        nativeInputValueSetter.call(e.target, val);
                      }
                      handleChange(e);
                    }}
                    required
                    className="w-full px-6 pt-5 pb-3 border-2 border-black rounded-lg focus:outline-none bg-white text-black"
                    placeholder="Enter your city"
                  />
                  {cityError && <span className="text-xs text-red-500 mt-2 block">{cityError}</span>}
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative mt-4">
                  <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={form.landmark || ""}
                    onChange={e => {
                      let val = e.target.value.replace(/[^a-zA-Z ]/g, "");
                      val = val.replace(/ +/g, " ").trim();
                      if (e.target.value.match(/[^a-zA-Z ]/)) {
                        setLandmarkError("Only letters are allowed. Numbers or symbols are not permitted.");
                      } else {
                        setLandmarkError("");
                      }
                      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                      if (nativeInputValueSetter) {
                        nativeInputValueSetter.call(e.target, val);
                      }
                      handleChange(e);
                    }}
                    required
                    className="w-full px-6 pt-5 pb-3 border-2 border-black rounded-lg focus:outline-none bg-white text-black"
                    placeholder="Closest landmark to your location"
                  />
                  {landmarkError && <span className="text-xs text-red-500 mt-2 block">{landmarkError}</span>}
                </div>
              </div>
              <div className="col-span-1 md:col-span-2">
                <div className="relative mt-4">
                  <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-semibold text-black z-10">How did you hear about OpenMart?</label>
                  <select name="how_heard" value={form.how_heard || ""} onChange={handleChange} required className="w-full px-6 pt-5 pb-3 border-2 border-black rounded-lg focus:outline-none bg-white text-black">
                    <option value="">Select option</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Friend">Friend</option>
                    <option value="Online Ad">Online Ad</option>
                    <option value="Event">Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            {error && 
            <div className="text-red-400 font-semibold text-center mt-4">{error}</div>}
            <button type="submit" disabled={loading} className="w-full py-3 px-4 mt-8 bg-gradient-to-r from-[#23182b] to-black text-white font-bold rounded-lg shadow-md hover:from-black hover:to-[#181024] transition text-lg">
              Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
